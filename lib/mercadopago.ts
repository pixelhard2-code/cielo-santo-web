import { MercadoPagoConfig, Preference } from 'mercadopago';

const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

export const isMercadoPagoConfigured = Boolean(mpAccessToken);

export const mpClient = isMercadoPagoConfigured
  ? new MercadoPagoConfig({ accessToken: mpAccessToken })
  : null;

export async function createMercadoPagoPreference({
  title,
  quantity = 1,
  unit_price,
  currency_id = 'CLP',
  external_reference,
  success_url,
  failure_url,
  pending_url,
}: {
  title: string;
  quantity?: number;
  unit_price: number;
  currency_id?: string;
  external_reference?: string;
  success_url: string;
  failure_url: string;
  pending_url?: string;
}) {
  if (!mpClient) {
    throw new Error('Mercado Pago no está configurado con MERCADOPAGO_ACCESS_TOKEN');
  }

  const preference = new Preference(mpClient);

  const res = await preference.create({
    body: {
      items: [
        {
          id: external_reference || 'cielo-santo-item',
          title,
          quantity,
          unit_price,
          currency_id,
        },
      ],
      back_urls: {
        success: success_url,
        failure: failure_url,
        pending: pending_url || failure_url,
      },
      auto_return: 'approved',
      external_reference,
    },
  });

  return res;
}
