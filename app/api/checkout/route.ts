import { NextResponse } from 'next/server';
import { isMercadoPagoConfigured, createMercadoPagoPreference } from '@/lib/mercadopago';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemType, planName, amount, currency = 'CLP', email, nombre } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 1. Prioridad: Mercado Pago (Soporte nativo Chile en CLP)
    if (isMercadoPagoConfigured) {
      const preference = await createMercadoPagoPreference({
        title: planName || 'Aporte Cielo Santo',
        unit_price: Number(amount) || 4990,
        currency_id: currency.toUpperCase() === 'USD' ? 'USD' : 'CLP',
        external_reference: `${itemType || 'aporte'}-${Date.now()}`,
        success_url: `${appUrl}/gracias?tipo=${itemType || 'aporte'}&status=aprobado`,
        failure_url: `${appUrl}/productos?status=fallido`,
        pending_url: `${appUrl}/gracias?tipo=${itemType || 'aporte'}&status=pendiente`,
      });

      if (preference.init_point) {
        return NextResponse.json({ url: preference.init_point });
      }
    }

    // 2. Stripe si está configurado para moneda internacional
    if (isStripeConfigured && stripe) {
      const mode = itemType === 'suscripcion' ? 'subscription' : 'payment';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: planName || 'Aporte Cielo Santo',
                description: `Sostén y recursos de Cielo Santo para ${nombre || 'hermano'}`,
              },
              unit_amount: Math.round(Number(amount) * (currency.toUpperCase() === 'CLP' ? 1 : 100)),
              ...(mode === 'subscription' && { recurring: { interval: 'month' } }),
            },
            quantity: 1,
          },
        ],
        mode,
        success_url: `${appUrl}/gracias?session_id={CHECKOUT_SESSION_ID}&tipo=${itemType || 'aporte'}`,
        cancel_url: `${appUrl}/productos`,
      });

      return NextResponse.json({ url: session.url });
    }

    // 3. Modo demostración si ninguna pasarela tiene credenciales en el entorno actual
    return NextResponse.json({
      demo: true,
      message: 'Modo demostración: Las pasarelas de pago están listas para recibir credenciales.',
      successUrl: `${appUrl}/gracias?tipo=${itemType || 'aporte'}&demo=true`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error en checkout';
    console.error('Error en checkout API:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
