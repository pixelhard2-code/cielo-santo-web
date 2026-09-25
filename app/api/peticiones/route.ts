import { NextResponse } from 'next/server';
import { createHash, randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isRateLimited } from '@/lib/rate-limit';
import { readJsonRecord } from '@/lib/request-body';

export const runtime = 'nodejs';

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function responseUnavailable() {
  return NextResponse.json(
    { error: 'El muro no está disponible temporalmente. Tu mensaje no se ha enviado; inténtalo más tarde.' },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured || !supabase) return responseUnavailable();

  const tipo = new URL(request.url).searchParams.get('tipo');
  const query = supabase
    .from('peticiones')
    .select('id, nombre, peticion, tipo, apoyos, created_at')
    .eq('estado', 'aprobado')
    .eq('es_privada', false)
    .order('created_at', { ascending: false })
    .limit(30);

  const { data, error } = tipo === 'agradecimiento'
    ? await query.eq('tipo', 'agradecimiento')
    : tipo === 'peticion'
      ? await query.eq('tipo', 'peticion')
      : await query;

  if (error) return responseUnavailable();
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 });
  if (!isSupabaseConfigured || !supabase) return responseUnavailable();
  if (await isRateLimited(request, 'peticiones-create', 5, 600)) {
    return NextResponse.json({ error: 'Espera unos minutos antes de enviar otro mensaje.' }, { status: 429 });
  }

  try {
    const parsed = await readJsonRecord(request, 8_000);
    if ('error' in parsed) return NextResponse.json({ error: parsed.error === 'too_large' ? 'El mensaje es demasiado grande.' : 'El formulario no es válido.' }, { status: parsed.error === 'too_large' ? 413 : 400 });
    const body = parsed.value;
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 80) : '';
    const peticion = typeof body.peticion === 'string' ? body.peticion.trim().slice(0, 500) : '';
    const tipo = body.tipo === 'agradecimiento' ? 'agradecimiento' : 'peticion';
    const esPrivada = body.esPrivada === true;
    const honeypot = typeof body.website === 'string' ? body.website : '';

    if (honeypot) return NextResponse.json({ success: true });
    if (!nombre || !peticion) return NextResponse.json({ error: 'Escribe tu nombre y mensaje.' }, { status: 400 });

    const { error } = await supabase.from('peticiones').insert({
      nombre,
      peticion,
      tipo,
      es_privada: esPrivada,
      estado: 'pendiente',
      apoyos: 0,
    });

    if (error) {
      console.error('No se pudo guardar la petición:', error.message);
      return responseUnavailable();
    }

    return NextResponse.json({ success: true, status: 'pending' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'No pudimos procesar el mensaje.' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 403 });
  if (!isSupabaseConfigured || !supabase) return responseUnavailable();
  if (await isRateLimited(request, 'peticiones-action', 25, 600)) {
    return NextResponse.json({ error: 'Espera unos minutos antes de volver a intentarlo.' }, { status: 429 });
  }

  try {
    const parsed = await readJsonRecord(request, 2_000);
    if ('error' in parsed) return NextResponse.json({ error: 'Solicitud no válida.' }, { status: parsed.error === 'too_large' ? 413 : 400 });
    const body = parsed.value;
    const id = typeof body.id === 'string' ? body.id : '';
    const action = body.action;
    if (!/^[0-9a-f-]{36}$/i.test(id) || (action !== 'report' && action !== 'support')) {
      return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 400 });
    }

    if (action === 'report') {
      const { error } = await supabase.from('reportes_peticiones').insert({ peticion_id: id });
      if (error) return responseUnavailable();
      return NextResponse.json({ success: true });
    }

    const cookieStore = await cookies();
    let clientId = cookieStore.get('cielo_support_id')?.value;
    const isNewClient = !clientId || !/^[0-9a-f-]{36}$/i.test(clientId);
    if (isNewClient) clientId = randomUUID();
    const clientHash = createHash('sha256').update(clientId!).digest('hex');
    const { data, error } = await supabase.rpc('record_petition_support', { petition_uuid: id, p_client_hash: clientHash });

    if (error || !data || typeof data.apoyos !== 'number') return responseUnavailable();
    const response = NextResponse.json({ success: true, apoyos: data.apoyos, alreadySupported: data.already_supported });
    if (isNewClient) response.cookies.set('cielo_support_id', clientId!, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      path: '/', maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'No pudimos procesar el reporte.' }, { status: 400 });
  }
}
