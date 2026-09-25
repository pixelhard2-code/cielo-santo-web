import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { readJsonRecord } from '@/lib/request-body';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: 'La confirmación no está disponible.' }, { status: 503 });
  }

  try {
    const parsed = await readJsonRecord(request, 1_000);
    if ('error' in parsed) return NextResponse.json({ error: 'El enlace no es válido.' }, { status: 400 });
    const { token } = parsed.value;
    if (typeof token !== 'string' || token.length < 32 || token.length > 100) {
      return NextResponse.json({ error: 'El enlace no es válido.' }, { status: 400 });
    }
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const { data, error } = await supabase.from('newsletter_subscribers')
      .update({ status: 'confirmed', confirmation_token_hash: null, confirmation_expires_at: null, confirmed_at: new Date().toISOString() })
      .eq('confirmation_token_hash', tokenHash)
      .eq('status', 'pending')
      .gt('confirmation_expires_at', new Date().toISOString())
      .select('email')
      .maybeSingle();
    if (error || !data) return NextResponse.json({ error: 'El enlace ya se usó o venció. Solicita una nueva confirmación.' }, { status: 410 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No pudimos confirmar el correo.' }, { status: 400 });
  }
}
