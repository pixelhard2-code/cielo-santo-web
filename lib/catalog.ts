export type ProductSku = 'suscripcion_alba' | 'devocional_30d';

export const PRODUCT_CATALOG: Record<ProductSku, {
  name: string;
  amount: number;
  currency: 'CLP';
  kind: 'one_time' | 'subscription';
}> = {
  suscripcion_alba: {
    name: 'Oraciones del Alba',
    amount: 2990,
    currency: 'CLP',
    kind: 'subscription',
  },
  devocional_30d: {
    name: '30 días con los Salmos',
    amount: 4990,
    currency: 'CLP',
    kind: 'one_time',
  },
};

export function isProductSku(value: unknown): value is ProductSku {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PRODUCT_CATALOG, value);
}
