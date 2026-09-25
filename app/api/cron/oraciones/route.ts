import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getChileDateParts, getDailyReading } from '@/lib/daily-content';
import { isResendConfigured, resend } from '@/lib/resend';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const localHour = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Santiago', hour: '2-digit', hourCycle: 'h23' }).format(new Date());
  if (localHour !== '07') return NextResponse.json({ skipped: 'outside the 7 AM Santiago window' });
  if (!isSupabaseConfigured || !supabase || !isResendConfigured || !resend || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: 'El envío diario no está configurado.' }, { status: 503 });
  }
  const db = supabase;
  const mailer = resend;

  const parts = getChileDateParts();
  const today = `${parts.year}-${parts.month}-${parts.day}`;
  const { data: freeSubscribers, error: subscribersError } = await db.from('newsletter_subscribers')
    .select('email, unsubscribe_token_hash').eq('status', 'confirmed').eq('daily_enabled', true).limit(1000);
  const { data: members, error: membersError } = await db.from('subscription_members')
    .select('email').in('status', ['active', 'trialing']).limit(1000);
  if (subscribersError || membersError) return NextResponse.json({ error: 'No pudimos obtener la lista de envío.' }, { status: 503 });

  const freeSubscriberEmails = new Set((freeSubscribers ?? []).map((row) => row.email));
  const recipients = new Set([
    ...(freeSubscribers ?? []).map((row) => row.email),
    ...(members ?? []).map((row) => row.email),
  ]);
  const reading = getDailyReading();
  let sent = 0;
  let failed = 0;
  const emails = [...recipients];

  for (let offset = 0; offset < emails.length; offset += 10) {
    const results = await Promise.all(emails.slice(offset, offset + 10).map(async (email) => {
      const { data: prior, error: lookupError } = await db.from('daily_email_deliveries')
        .select('id, status').eq('email', email).eq('delivery_date', today).maybeSingle();
      if (lookupError || prior?.status === 'sent') return prior?.status === 'sent' ? 'skipped' : 'failed';

      let deliveryId = prior?.id;
      if (!deliveryId) {
        const { data: created, error: createError } = await db.from('daily_email_deliveries')
          .insert({ email, delivery_date: today, status: 'pending' }).select('id').single();
        if (createError || !created) return 'skipped';
        deliveryId = created.id;
      } else {
        await db.from('daily_email_deliveries').update({ status: 'pending' }).eq('id', deliveryId);
      }

      let unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletter`;
      if (freeSubscriberEmails.has(email)) {
        const token = randomBytes(32).toString('base64url');
        const newHash = createHash('sha256').update(token).digest('hex');
        const { error: tokenError } = await db.from('newsletter_unsubscribe_tokens')
          .insert({ token_hash: newHash, email });
        if (tokenError) return 'failed';
        unsubscribeUrl = new URL(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, process.env.NEXT_PUBLIC_APP_URL).toString();
      }

      const { error: sendError } = await mailer.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: `${reading.reference} · ${reading.title} | Cielo Santo`,
        text: `${reading.reference}\n${reading.title}\n\n${reading.reflection}\n\nOración\n${reading.prayer}\n\nSi ya no deseas recibir estos correos, puedes darte de baja: ${unsubscribeUrl}`,
        html: `<main style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#29251f;line-height:1.7"><p style="letter-spacing:.12em;color:#9a5a21;font:600 11px system-ui">CIELO SANTO · ORACIÓN DE HOY</p><p style="font:12px system-ui;color:#777">${reading.reference}</p><h1 style="font-size:28px">${reading.title}</h1><p>${reading.reflection}</p><h2 style="font-size:18px">Oración</h2><p><em>${reading.prayer}</em></p><hr style="border:0;border-top:1px solid #e6ded2;margin:28px 0"><p style="font:12px system-ui;color:#777">Recibes este mensaje porque confirmaste tu suscripción a Cielo Santo. <a href="${unsubscribeUrl}">Darme de baja</a></p></main>`,
      });
      await db.from('daily_email_deliveries').update({ status: sendError ? 'failed' : 'sent' }).eq('id', deliveryId);
      return sendError ? 'failed' : 'sent';
    }));
    sent += results.filter((result) => result === 'sent').length;
    failed += results.filter((result) => result === 'failed').length;
  }

  const { error: cleanupError } = await db.rpc('cleanup_ephemeral_data');
  if (cleanupError) console.error('No se pudieron depurar datos vencidos:', cleanupError.message);
  return NextResponse.json({ date: today, sent, failed, alreadySent: recipients.size - sent - failed });
}
