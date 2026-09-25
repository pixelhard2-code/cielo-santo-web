import { NextResponse } from 'next/server';
import { verifySignedToken } from '@/lib/signed-token';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  try {
    const verified = verifySignedToken(token, 'download');
    if (!verified || verified.resource !== 'siete_salmos_7d') {
      return NextResponse.json({ error: 'Este enlace venció o no es válido.' }, { status: 410 });
    }
    if (!isSupabaseConfigured || !supabase) return NextResponse.json({ error: 'La descarga no está disponible.' }, { status: 503 });
    const { data, error } = await supabase.storage.from('paid-resources')
      .createSignedUrl('siete-salmos-para-el-descanso.pdf', 24 * 60 * 60, { download: 'Cielo-Santo-Siete-Salmos-para-el-descanso.pdf' });
    if (error || !data?.signedUrl) return NextResponse.json({ error: 'No pudimos preparar la descarga.' }, { status: 503 });
    return NextResponse.redirect(data.signedUrl, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'No pudimos preparar la descarga.' }, { status: 503 });
  }
}
