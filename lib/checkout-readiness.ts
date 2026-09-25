import 'server-only';
import { isResendConfigured } from '@/lib/resend';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isStripeConfigured } from '@/lib/stripe';

export function isFulfillmentReady(kind: 'one_time' | 'subscription') {
  return Boolean(
    isSupabaseConfigured &&
    isResendConfigured &&
    process.env.RESEND_FROM_EMAIL &&
    process.env.NEXT_PUBLIC_APP_URL &&
    process.env.DOWNLOAD_TOKEN_SECRET &&
    process.env.STRIPE_WEBHOOK_SECRET &&
    isStripeConfigured &&
    (kind !== 'subscription' || process.env.CRON_SECRET),
  );
}

export function isDonationCheckoutReady() {
  const mpReady = Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MP_WEBHOOK_SECRET);
  const stripeReady = Boolean(isStripeConfigured && process.env.STRIPE_WEBHOOK_SECRET);
  return Boolean(isSupabaseConfigured && process.env.NEXT_PUBLIC_APP_URL && (mpReady || stripeReady));
}
