import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: 'No pudimos procesar la baja.' }, { status: 503 });
  }
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (token.length < 32 || token.length > 100) return NextResponse.json({ error: 'Enlace no válido.' }, { status: 400 });

  const hash = createHash('sha256').update(token).digest('hex');
  const { data: tokenRow, error: tokenError } = await supabase.from('newsletter_unsubscribe_tokens')
    .select('email').eq('token_hash', hash).maybeSingle();
  if (tokenError || !tokenRow) return NextResponse.json({ error: 'El enlace venció o ya fue utilizado.' }, { status: 410 });
  const { error } = await supabase.from('newsletter_subscribers')
    .update({ status: 'unsubscribed', daily_enabled: false, confirmation_token_hash: null })
    .eq('email', tokenRow.email);
  if (error) return NextResponse.json({ error: 'No pudimos procesar la baja.' }, { status: 503 });
  await supabase.from('newsletter_unsubscribe_tokens').delete().eq('email', tokenRow.email);
  return new NextResponse('<!doctype html><html lang="es"><meta charset="utf-8"><title>Suscripción cancelada</title><body style="font-family:system-ui;max-width:36rem;margin:5rem auto;padding:1rem;color:#29251f"><h1>Suscripción cancelada</h1><p>Ya no recibirás el correo diario de Cielo Santo.</p></body></html>', {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
