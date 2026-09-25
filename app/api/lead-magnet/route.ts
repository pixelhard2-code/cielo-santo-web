import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isResendConfigured, resend } from '@/lib/resend';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isRateLimited } from '@/lib/rate-limit';
import { readJsonRecord } from '@/lib/request-body';
import { createSignedToken } from '@/lib/signed-token';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 });
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!isSupabaseConfigured || !supabase || !isResendConfigured || !resend || !appUrl
    || !process.env.RESEND_FROM_EMAIL || !secret || secret.length < 32) {
    return NextResponse.json({ error: 'El envío del libro todavía no está configurado.' }, { status: 503 });
  }
  if (await isRateLimited(request, 'lead-magnet', 3, 3600)) {
    return NextResponse.json({ error: 'Has solicitado varios envíos. Inténtalo más tarde.' }, { status: 429 });
  }

  const parsed = await readJsonRecord(request, 2_000);
  if ('error' in parsed) return NextResponse.json({ error: 'El formulario no es válido.' }, { status: parsed.error === 'too_large' ? 413 : 400 });
  const body = parsed.value;
  if (typeof body.website === 'string' && body.website) return NextResponse.json({ success: true });
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Ingresa un correo válido.' }, { status: 400 });
  }

  try {
    const emailHash = createHash('sha256').update(email).digest('hex');
    const { data: emailAllowed, error: limitError } = await supabase.rpc('consume_rate_limit', {
      p_bucket: 'lead-magnet-email', p_key_hash: emailHash, p_max: 2, p_window_seconds: 3600,
    });
    if (limitError || emailAllowed !== true) {
      return NextResponse.json({ error: 'Ya enviamos recientemente un enlace a ese correo. Inténtalo más tarde.' }, { status: 429 });
    }

    const { data: availableFile, error: storageError } = await supabase.storage.from('paid-resources')
      .createSignedUrl('siete-salmos-para-el-descanso.pdf', 60);
    if (storageError || !availableFile?.signedUrl) {
      return NextResponse.json({ error: 'El libro todavía no está disponible para envío.' }, { status: 503 });
    }

    const { error: recordError } = await supabase.from('lead_magnet_requests').upsert({
      email,
      resource: 'siete_salmos_7d',
      requested_at: new Date().toISOString(),
    }, { onConflict: 'email,resource' });
    if (recordError) {
      console.error('No se pudo registrar la solicitud del libro:', recordError.message);
      return NextResponse.json({ error: 'No pudimos procesar la solicitud. Inténtalo nuevamente.' }, { status: 503 });
    }

    const token = createSignedToken('download', 'siete_salmos_7d', Math.floor(Date.now() / 1000) + 48 * 60 * 60);
    const downloadUrl = new URL('/api/downloads/siete-salmos', appUrl);
    downloadUrl.searchParams.set('token', token);
    const { error: mailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Tu libro gratuito: Siete Salmos para el descanso',
      text: `Aquí tienes el libro gratuito de Cielo Santo: ${downloadUrl.toString()}\n\nEste enlace vence en 48 horas. Este correo contiene el recurso que solicitaste y no activa una suscripción diaria.`,
      html: `<p>Gracias por solicitar el libro gratuito de Cielo Santo.</p><p><a href="${downloadUrl.toString()}">Descargar Siete Salmos para el descanso</a></p><p>El enlace vence en 48 horas. Este correo contiene el recurso que solicitaste y no activa una suscripción diaria.</p>`,
    });
    if (mailError) {
      console.error('No se pudo enviar el libro solicitado:', mailError.message);
      return NextResponse.json({ error: 'No pudimos enviar el correo. Inténtalo más tarde.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No pudimos procesar la solicitud.' }, { status: 400 });
  }
}
