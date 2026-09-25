import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment, WebhookSignatureValidator } from 'mercadopago';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;
  if (!accessToken || !webhookSecret || !isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 503 });
  }

  const url = new URL(request.url);
  const dataId = url.searchParams.get('data.id') ?? url.searchParams.get('id');
  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId,
      secret: webhookSecret,
      toleranceSeconds: 300,
    });
  } catch {
    return NextResponse.json({ error: 'Firma de webhook no válida.' }, { status: 401 });
  }

  if (!dataId || !/^\d+$/.test(dataId)) return NextResponse.json({ error: 'Pago no válido.' }, { status: 400 });

  try {
    const payment = await new Payment(new MercadoPagoConfig({ accessToken })).get({ id: dataId });
    const intentId = payment.external_reference;
    if (!intentId || !payment.transaction_amount || !payment.currency_id) {
      return NextResponse.json({ error: 'Pago incompleto.' }, { status: 400 });
    }

    const { data: intent, error: intentError } = await supabase.from('checkout_intents')
      .select('id, sku, fund, email, amount, currency').eq('id', intentId).maybeSingle();
    if (intentError || !intent || !intent.sku.startsWith('aporte') || !intent.fund || intent.amount !== payment.transaction_amount || intent.currency !== payment.currency_id) {
      return NextResponse.json({ error: 'El pago no coincide con el pedido.' }, { status: 400 });
    }

    const email = payment.payer?.email?.toLowerCase() || intent.email;
    const { error } = await supabase.from('payments').upsert({
      provider: 'mercadopago', provider_payment_id: String(payment.id),
      checkout_intent_id: intent.id, sku: intent.sku, fund: intent.fund, email, amount: intent.amount,
      currency: intent.currency, status: payment.status || 'pending', updated_at: new Date().toISOString(),
    }, { onConflict: 'provider,provider_payment_id' });
    if (error) throw new Error('No se pudo registrar el pago.');
    if (payment.status === 'approved') await supabase.from('checkout_intents').update({ status: 'paid' }).eq('id', intent.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error instanceof Error ? error.message : 'Error desconocido');
    return NextResponse.json({ error: 'No pudimos procesar la notificación.' }, { status: 500 });
  }
}
