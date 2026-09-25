import { NextResponse } from 'next/server';
import { createMercadoPagoPreference, isMercadoPagoConfigured } from '@/lib/mercadopago';
import { PRODUCT_CATALOG, isProductSku } from '@/lib/catalog';
import { isDonationCheckoutReady, isFulfillmentReady } from '@/lib/checkout-readiness';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isRateLimited } from '@/lib/rate-limit';
import { readJsonRecord } from '@/lib/request-body';

export const runtime = 'nodejs';

function unavailable(message: string, status = 503) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (request.headers.get('origin')) {
    try {
      if (new URL(request.headers.get('origin')!).host !== new URL(request.url).host) {
        return unavailable('Solicitud no válida.', 403);
      }
    } catch {
      return unavailable('Solicitud no válida.', 403);
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return unavailable('Los pagos no están disponibles en este momento. No se ha realizado ningún cobro.');
  }
  if (await isRateLimited(request, 'checkout-create', 5, 600)) {
    return unavailable('Has iniciado varios intentos. Espera unos minutos antes de probar otra vez.', 429);
  }

  try {
    const parsed = await readJsonRecord(request, 4_000);
    if ('error' in parsed) return unavailable('Solicitud no válida.', parsed.error === 'too_large' ? 413 : 400);
    const body = parsed.value;
    const sku = typeof body.sku === 'string' ? body.sku : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 100) : '';
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail || !nombre) return unavailable('Ingresa un nombre y un correo válido.', 400);

    const donation = DONATION_CATALOG[sku as DonationSku];
    const isDonation = Boolean(donation);
    if (!isDonation && !isProductSku(sku)) return unavailable('El producto seleccionado no existe.', 400);

    const product = isProductSku(sku) ? PRODUCT_CATALOG[sku] : null;
    const amount = isDonation ? Number(body.amount) : product!.amount;
    if (!Number.isInteger(amount) || amount < (isDonation ? 1000 : 1) || amount > (isDonation ? 2_000_000 : 1_000_000)) {
      return unavailable('El monto ingresado no es válido.', 400);
    }

    if (isDonation ? !isDonationCheckoutReady() : !isFulfillmentReady(product!.kind)) {
      return unavailable('Los pagos y su confirmación aún no están configurados. No se ha realizado ningún cobro.');
    }
    if (sku === 'devocional_30d') {
      const { data: assets, error: assetError } = await supabase.storage.from('paid-resources').list('', { search: 'treinta-dias-con-los-salmos.pdf' });
      if (assetError || !assets?.some((asset) => asset.name === 'treinta-dias-con-los-salmos.pdf')) {
        return unavailable('El devocional aún no está disponible para entrega. No se ha realizado ningún cobro.');
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) return unavailable('Falta configurar la dirección pública del sitio.');
    let origin: string;
    try {
      const parsed = new URL(appUrl);
      if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') throw new Error();
      origin = parsed.origin;
    } catch {
      return unavailable('La dirección pública del sitio no es válida.');
    }

    const itemName = product?.name ?? donation!.name;
    const fund = donation?.fund ?? null;
    const currency = 'CLP';
    const { data: intent, error: intentError } = await supabase
      .from('checkout_intents')
      .insert({ sku, email, amount, currency, fund, status: 'pending' })
      .select('id')
      .single();

    if (intentError || !intent) {
      console.error('No se pudo crear el intento de pago:', intentError?.message);
      return unavailable('No pudimos iniciar el pago. Inténtalo nuevamente.');
    }

    // El producto recurrente solo se ofrece con Stripe: Mercado Pago Preference
    // crea un pago único y no debe presentarse como una suscripción mensual.
    if (product?.kind === 'subscription' && stripe && isStripeConfigured) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        client_reference_id: intent.id,
        line_items: [{
          price_data: {
            currency: 'clp',
            product_data: { name: itemName, description: 'Suscripción mensual voluntaria.' },
            unit_amount: amount,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        metadata: { intentId: intent.id, sku, nombre },
        subscription_data: { metadata: { intentId: intent.id, sku, nombre } },
        success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/productos?checkout=cancelado`,
      });
      await supabase.from('checkout_intents').update({ status: 'created' }).eq('id', intent.id);
      return NextResponse.json({ url: session.url });
    }

    // Aporte y compra única en Chile: Mercado Pago procesa CLP.
    if (isMercadoPagoConfigured && process.env.MP_WEBHOOK_SECRET && isDonation) {
      const preference = await createMercadoPagoPreference({
        title: itemName,
        unit_price: amount,
        currency_id: currency,
        external_reference: intent.id,
        success_url: `${origin}/gracias?provider=mercadopago`,
        failure_url: `${origin}/donaciones?checkout=fallido`,
        pending_url: `${origin}/gracias?provider=mercadopago&status=pendiente`,
      });

      if (preference.init_point) {
        await supabase.from('checkout_intents').update({ status: 'created' }).eq('id', intent.id);
        return NextResponse.json({ url: preference.init_point });
      }
    }

    if (stripe && isStripeConfigured) {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: email,
        client_reference_id: intent.id,
        line_items: [{
          price_data: {
            currency: 'clp',
            product_data: { name: itemName },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        metadata: { intentId: intent.id, sku, nombre },
        success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${isDonation ? 'donaciones' : 'productos'}?checkout=cancelado`,
      });
      await supabase.from('checkout_intents').update({ status: 'created' }).eq('id', intent.id);
      return NextResponse.json({ url: session.url });
    }

    return unavailable('No hay una pasarela configurada para este pago. No se ha realizado ningún cobro.');
  } catch (error) {
    console.error('Error al iniciar el checkout:', error instanceof Error ? error.message : 'Error desconocido');
    return unavailable('No pudimos iniciar el pago. Inténtalo nuevamente.', 502);
  }
}

type DonationSku = 'aporte' | 'aporte_operativo' | 'aporte_solidario' | 'aporte_continuidad';
const DONATION_CATALOG: Record<DonationSku, { name: string; fund: 'operativo' | 'solidario' | 'continuidad' }> = {
  aporte: { name: 'Aporte voluntario a Cielo Santo', fund: 'operativo' },
  aporte_operativo: { name: 'Aporte de sostenimiento digital', fund: 'operativo' },
  aporte_solidario: { name: 'Aporte solidario', fund: 'solidario' },
  aporte_continuidad: { name: 'Aporte de continuidad', fund: 'continuidad' },
};
