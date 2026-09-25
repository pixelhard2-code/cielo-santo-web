import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isResendConfigured, resend } from '@/lib/resend';
import { createSignedToken } from '@/lib/signed-token';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

async function deliverDevotional(email: string, sessionId: string) {
  if (!resend || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_APP_URL) throw new Error('No está configurado el envío del devocional.');
  const token = createSignedToken('download', 'devocional_30d', Math.floor(Date.now() / 1000) + 72 * 60 * 60);
  const url = new URL('/api/downloads/devocional', process.env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set('token', token);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'Tu devocional de Cielo Santo está listo',
    text: `Gracias por tu compra. Descarga aquí el devocional, disponible por 72 horas: ${url.toString()}`,
    html: `<p>Gracias por tu compra.</p><p><a href="${url.toString()}">Descargar 30 días con los Salmos</a> (enlace disponible por 72 horas).</p><p>Referencia: ${sessionId}</p>`,
  });
  if (error) throw new Error(error.message);
}

async function sendSubscriptionWelcome(email: string, subscriptionId: string) {
  if (!resend || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_APP_URL) throw new Error('No está configurado el correo de bienvenida.');
  const token = createSignedToken('billing-portal', subscriptionId, Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60);
  const portalUrl = new URL('/api/billing-portal', process.env.NEXT_PUBLIC_APP_URL);
  portalUrl.searchParams.set('token', token);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: 'Tu suscripción a Oraciones del Alba está activa',
    text: `Gracias por suscribirte. Recibirás una oración y reflexión diaria. Puedes administrar o cancelar tu suscripción aquí: ${portalUrl.toString()}`,
    html: `<p>Gracias por sumarte a Oraciones del Alba.</p><p>Recibirás una oración y reflexión diaria en este correo.</p><p><a href="${portalUrl.toString()}">Administrar o cancelar mi suscripción</a></p>`,
  });
  if (error) throw new Error(error.message);
}

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET || !isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) return NextResponse.json({ error: 'Firma requerida.' }, { status: 400 });
    event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Firma de webhook no válida.' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== 'paid') return NextResponse.json({ received: true });

      const intentId = session.metadata?.intentId;
      const sku = session.metadata?.sku;
      const email = session.customer_details?.email?.toLowerCase();
      if (!intentId || !sku || !email || !session.currency || session.amount_total === null) {
        return NextResponse.json({ error: 'Datos de pago incompletos.' }, { status: 400 });
      }

      const { data: intent, error: intentError } = await supabase.from('checkout_intents')
        .select('id, sku, fund, email, amount, currency')
        .eq('id', intentId)
        .maybeSingle();
      if (intentError || !intent || intent.sku !== sku || intent.email !== email || intent.amount !== session.amount_total || intent.currency.toLowerCase() !== session.currency) {
        return NextResponse.json({ error: 'El pago no coincide con el pedido.' }, { status: 400 });
      }

      const paymentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.id;
      const { data: previous } = await supabase.from('payments').select('delivered_at')
        .eq('provider', 'stripe').eq('provider_payment_id', paymentId).maybeSingle();
      const { error: saveError } = await supabase.from('payments').upsert({
        provider: 'stripe', provider_payment_id: paymentId, provider_session_id: session.id,
        checkout_intent_id: intent.id, sku, fund: intent.fund, email, amount: intent.amount, currency: intent.currency,
        status: 'paid', updated_at: new Date().toISOString(),
      }, { onConflict: 'provider,provider_payment_id' });
      if (saveError) throw new Error('No se pudo guardar el pago.');
      await supabase.from('checkout_intents').update({ status: 'paid' }).eq('id', intent.id);

      if (sku === 'devocional_30d' && !previous?.delivered_at) {
        if (!isResendConfigured || !resend) throw new Error('El servicio de correo no está configurado.');
        await deliverDevotional(email, session.id);
        await supabase.from('payments').update({ delivered_at: new Date().toISOString() }).eq('provider', 'stripe').eq('provider_payment_id', paymentId);
      }

      if (sku === 'suscripcion_alba' && session.subscription) {
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        if (!customerId) throw new Error('El cliente de la suscripción no está disponible.');
        const { data: existingMember } = await supabase.from('subscription_members')
          .select('id, welcome_sent_at').eq('stripe_subscription_id', subscriptionId).maybeSingle();
        const { error: memberError } = await supabase.from('subscription_members').upsert({
          stripe_subscription_id: subscriptionId, stripe_customer_id: customerId,
          email, status: 'active', updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_subscription_id' });
        if (memberError) throw new Error('No se pudo activar la suscripción.');
        if (!existingMember?.welcome_sent_at) {
          await sendSubscriptionWelcome(email, subscriptionId);
          await supabase.from('subscription_members').update({ welcome_sent_at: new Date().toISOString() }).eq('stripe_subscription_id', subscriptionId);
        }
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
      await supabase.from('subscription_members').update({
        stripe_customer_id: customerId, status: subscription.status, updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', subscription.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook de Stripe:', error instanceof Error ? error.message : 'Error desconocido');
    return NextResponse.json({ error: 'No pudimos procesar la notificación.' }, { status: 500 });
  }
}
