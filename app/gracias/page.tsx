import type { Metadata } from 'next';
import Link from 'next/link';
import { Payment } from 'mercadopago';
import { isMercadoPagoConfigured, mpClient } from '@/lib/mercadopago';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Estado del pago', robots: { index: false, follow: false } };

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function verifyStripeSession(id: string) {
  if (!stripe || !isSupabaseConfigured || !supabase || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    const intentId = session.metadata?.intentId;
    if (!intentId || !session.metadata?.sku || !session.customer_details?.email || session.payment_status !== 'paid') return null;
    const { data: intent } = await supabase.from('checkout_intents')
      .select('sku, email, amount, currency').eq('id', intentId).maybeSingle();
    if (!intent || intent.sku !== session.metadata.sku || intent.email !== session.customer_details.email.toLowerCase()
      || intent.amount !== session.amount_total || intent.currency.toLowerCase() !== session.currency) return null;
    return { sku: intent.sku };
  } catch {
    return null;
  }
}

async function verifyMercadoPagoPayment(id: string, externalReference: string) {
  if (!isMercadoPagoConfigured || !mpClient || !isSupabaseConfigured || !supabase || !/^\d+$/.test(id)) return false;
  try {
    const payment = await new Payment(mpClient).get({ id });
    if (payment.status !== 'approved' || payment.external_reference !== externalReference) return false;
    const { data: intent } = await supabase.from('checkout_intents')
      .select('sku, fund, amount, currency').eq('id', externalReference).maybeSingle();
    return Boolean(intent && intent.sku.startsWith('aporte') && intent.fund
      && intent.amount === payment.transaction_amount && intent.currency === payment.currency_id);
  } catch {
    return false;
  }
}

export default async function GraciasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === 'string' ? params.session_id : '';
  const provider = typeof params.provider === 'string' ? params.provider : '';
  const paymentId = typeof params.payment_id === 'string' ? params.payment_id : '';
  const externalReference = typeof params.external_reference === 'string' ? params.external_reference : '';
  const stripePayment = sessionId ? await verifyStripeSession(sessionId) : null;
  const mercadopagoPayment = provider === 'mercadopago' && paymentId && externalReference
    ? await verifyMercadoPagoPayment(paymentId, externalReference)
    : false;
  const verified = Boolean(stripePayment || mercadopagoPayment);
  const isPending = !verified && (params.status === 'pending' || params.status === 'in_process' || params.status === 'pendiente');
  const title = verified ? 'Pago confirmado' : isPending ? 'Pago en proceso' : 'No pudimos confirmar el pago';
  const message = verified
    ? stripePayment?.sku === 'devocional_30d'
      ? 'El pago fue verificado. Enviaremos al correo usado en el checkout un enlace privado para descargar tu devocional.'
      : stripePayment?.sku === 'suscripcion_alba'
        ? 'El pago fue verificado. Recibirás un correo para administrar tu suscripción y comenzar el acompañamiento diario.'
        : 'El pago fue verificado. Gracias por sostener el trabajo de Cielo Santo.'
    : isPending
      ? 'La pasarela todavía está procesando el pago. No vuelvas a pagar; revisa nuevamente dentro de unos minutos.'
      : 'No tenemos una confirmación verificable de la pasarela. Revisa el estado desde el correo de pago o contáctanos antes de intentar pagar otra vez.';

  return <main className="max-w-2xl mx-auto px-6 py-24 text-center">
    <p className="text-xs uppercase tracking-[.18em] text-amber-800 mb-3">Cielo Santo</p>
    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-4">{title}</h1>
    <p className="text-stone-600 leading-relaxed mb-8">{message}</p>
    <Link href="/" className="inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800">Volver al inicio</Link>
  </main>;
}
