import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Peticiones de respaldo si no hay base de datos configurada aún
const peticionesFallback = [
  { id: '1', nombre: "María Elena", peticion: "Pido oración por la salud de mi esposo que está en exámenes médicos.", apoyos: 28, created_at: new Date().toISOString() },
  { id: '2', nombre: "Juan C.", peticion: "Por la paz en mi hogar y trabajo para mi hijo mayor.", apoyos: 19, created_at: new Date().toISOString() },
  { id: '3', nombre: "Gloria S.", peticion: "Agradeciendo por un día más de vida y pidiendo fortaleza espiritual.", apoyos: 45, created_at: new Date().toISOString() },
];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('peticiones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    }
    return NextResponse.json(peticionesFallback);
  } catch {
    return NextResponse.json(peticionesFallback);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, peticion } = body;

    if (!nombre || !peticion || typeof nombre !== 'string' || typeof peticion !== 'string') {
      return NextResponse.json({ error: 'Nombre y petición son requeridos' }, { status: 400 });
    }

    const sanitizedNombre = nombre.trim().slice(0, 80);
    const sanitizedPeticion = peticion.trim().slice(0, 500);

    const nuevaPeticion = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      nombre: sanitizedNombre,
      peticion: sanitizedPeticion,
      apoyos: 1,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('peticiones')
        .insert([{
          nombre: sanitizedNombre,
          peticion: sanitizedPeticion,
          apoyos: 1,
          estado: 'aprobado'
        }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, peticion: data });
      }
    }

    return NextResponse.json({ success: true, peticion: nuevaPeticion });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al procesar petición';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
