import { createHash, randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getChileDateParts } from '@/lib/daily-content';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isRateLimited } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function today() {
  const parts = getChileDateParts();
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export async function GET() {
  if (!isSupabaseConfigured || !supabase) return NextResponse.json({ count: null, available: false });
  const { data, error } = await supabase.from('daily_amens').select('count').eq('delivery_date', today()).maybeSingle();
  if (error) return NextResponse.json({ count: null, available: false });
  return NextResponse.json({ count: data?.count ?? 0, available: true }, { headers: { 'Cache-Control': 'no-store' } });
}

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
  if (!isSupabaseConfigured || !supabase) return NextResponse.json({ error: 'El contador no está disponible.' }, { status: 503 });
  if (await isRateLimited(request, 'daily-amen', 30, 86400)) {
    return NextResponse.json({ error: 'Has llegado al límite diario de intentos.' }, { status: 429 });
  }
  const cookieStore = await cookies();
  let clientId = cookieStore.get('cielo_amen_id')?.value;
  const isNew = !clientId || !/^[0-9a-f-]{36}$/i.test(clientId);
  if (isNew) clientId = randomUUID();

  const clientHash = createHash('sha256').update(clientId!).digest('hex');
  const { data, error } = await supabase.rpc('record_daily_amen', { p_day: today(), p_client_hash: clientHash });
  if (error || typeof data !== 'number') return NextResponse.json({ error: 'No pudimos registrar el Amén.' }, { status: 503 });

  const response = NextResponse.json({ count: data });
  if (isNew) response.cookies.set('cielo_amen_id', clientId!, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    path: '/', maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
