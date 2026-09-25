import 'server-only';
import { createHash } from 'node:crypto';
import { supabase } from '@/lib/supabase';

export async function isRateLimited(request: Request, bucket: string, max: number, windowSeconds: number) {
  if (!supabase) return true;
  const forwarded = request.headers.get('x-vercel-forwarded-for')
    ?? request.headers.get('x-forwarded-for')
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  const clientKey = forwarded.split(',')[0].trim().slice(0, 100);
  const keyHash = createHash('sha256').update(clientKey).digest('hex');
  const { data, error } = await supabase.rpc('consume_rate_limit', {
    p_bucket: bucket, p_key_hash: keyHash, p_max: max, p_window_seconds: windowSeconds,
  });
  return Boolean(error) || data !== true;
}
