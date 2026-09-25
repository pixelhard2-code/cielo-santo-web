import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { isResendConfigured, resend } from '@/lib/resend';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isRateLimited } from '@/lib/rate-limit';
import { readJsonRecord } from '@/lib/request-body';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (request.headers.get('origin')) {
    try {
      if (new URL(request.headers.get('origin')!).host !== new URL(request.url).host) {
        return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 });
    }
  }
  if (!isSupabaseConfigured || !supabase || !isResendConfigured || !resend || !process.env.NEXT_PUBLIC_APP_URL || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json({ error: 'El registro por correo no está configurado. No guardamos tu dirección.' }, { status: 503 });
  }
  if (await isRateLimited(request, 'newsletter-subscribe', 3, 3600)) {
    return NextResponse.json({ error: 'Espera un momento antes de solicitar otra confirmación.' }, { status: 429 });
  }

  try {
    const parsed = await readJsonRecord(request, 2_000);
    if ('error' in parsed) return NextResponse.json({ error: 'El formulario no es válido.' }, { status: parsed.error === 'too_large' ? 413 : 400 });
    const body = parsed.value;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (typeof body.website === 'string' && body.website) return NextResponse.json({ success: true });
    if (body.consent !== true || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Ingresa un correo válido y confirma que deseas recibir el correo diario.' }, { status: 400 });
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const { error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      status: 'pending',
      daily_enabled: true,
      confirmation_token_hash: tokenHash,
      confirmation_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      consented_at: new Date().toISOString(),
      confirmed_at: null,
    }, { onConflict: 'email' });
    if (error) {
      console.error('No se pudo guardar la suscripción:', error.message);
      return NextResponse.json({ error: 'No pudimos iniciar la suscripción. Inténtalo nuevamente.' }, { status: 503 });
    }

    const confirmUrl = new URL('/newsletter/confirmar', process.env.NEXT_PUBLIC_APP_URL);
    confirmUrl.searchParams.set('token', token);
    const { error: mailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Confirma tu correo diario de Cielo Santo',
      text: `Para confirmar tu suscripción diaria, abre este enlace: ${confirmUrl.toString()}`,
      html: `<p>Gracias por querer recibir una oración y reflexión diaria de Cielo Santo.</p><p><a href="${confirmUrl.toString()}">Confirmar mi suscripción</a></p><p>Si no pediste este correo, puedes ignorarlo.</p>`,
    });
    if (mailError) {
      console.error('No se pudo enviar la confirmación del boletín:', mailError.message);
      return NextResponse.json({ error: 'Guardamos tu solicitud, pero no pudimos enviar la confirmación. Inténtalo más tarde.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No pudimos procesar la suscripción.' }, { status: 400 });
  }
}
