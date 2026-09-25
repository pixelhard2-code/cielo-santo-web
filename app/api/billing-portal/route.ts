import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifySignedToken } from '@/lib/signed-token';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!stripe || !isSupabaseConfigured || !supabase || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: 'El portal de suscripción no está disponible.' }, { status: 503 });
  }

  const token = new URL(request.url).searchParams.get('token') ?? '';
  try {
    const verified = verifySignedToken(token, 'billing-portal');
    if (!verified) return NextResponse.json({ error: 'Este enlace no es válido.' }, { status: 410 });
    const { data: member } = await supabase.from('subscription_members')
      .select('stripe_customer_id').eq('stripe_subscription_id', verified.resource).maybeSingle();
    if (!member) return NextResponse.json({ error: 'No encontramos esa suscripción.' }, { status: 404 });
    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      return_url: new URL('/productos', process.env.NEXT_PUBLIC_APP_URL).toString(),
    });
    return NextResponse.redirect(session.url);
  } catch {
    return NextResponse.json({ error: 'No pudimos abrir el portal de suscripción.' }, { status: 503 });
  }
}
