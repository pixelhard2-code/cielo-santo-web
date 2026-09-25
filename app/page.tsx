import { getChileDateLabel, getDailyReading } from '@/lib/daily-content';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import PrayerWall from '@/components/PrayerWall';
import NewsletterSignup from '@/components/NewsletterSignup';
import DailyPsalmCard from '@/components/DailyPsalmCard';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function loadPrayerWall() {
  if (!isSupabaseConfigured || !supabase) return { petitions: [], thanks: [], available: false };
  const { data, error } = await supabase.from('peticiones')
    .select('id, nombre, peticion, tipo, apoyos, created_at')
    .eq('estado', 'aprobado').eq('es_privada', false)
    .order('created_at', { ascending: false }).limit(30);
  if (error || !data) return { petitions: [], thanks: [], available: false };
  const normalize = (row: typeof data[number]) => ({
    id: String(row.id), nombre: row.nombre, peticion: row.peticion,
    apoyos: row.apoyos, created_at: row.created_at,
  });
  return {
    petitions: data.filter((row) => row.tipo === 'peticion').map(normalize),
    thanks: data.filter((row) => row.tipo === 'agradecimiento').map(normalize),
    available: true,
  };
}

async function loadAmenCount() {
  if (!isSupabaseConfigured || !supabase) return null;
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const day = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const { data, error } = await supabase.from('daily_amens').select('count')
    .eq('delivery_date', `${day.year}-${day.month}-${day.day}`).maybeSingle();
  return error ? null : data?.count ?? 0;
}

export default async function Home() {
  const [wall, amenCount] = await Promise.all([loadPrayerWall(), loadAmenCount()]);
  const dailyReading = getDailyReading();
  const chileDate = getChileDateLabel();


  return (
    <main className="flex flex-col min-h-screen">
      
      {/* ========================================================
          1. HERO SECTION
      ======================================================== */}
      <section className="relative w-full min-h-[600px] flex items-center px-6 sm:px-12 py-20 text-white overflow-hidden">
        {/* Fondo panorámico con montañas y pinos */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-prayer.webp"
            alt="Amanecer en las montañas" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Sutil viñeta para asegurar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/70"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_25%,rgba(255,196,112,0.3),transparent_24%)]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          
          {/* Bloque principal izquierdo */}
          <div className="max-w-2xl text-left">
            <p className="text-[#e2ab4b] text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Comunidad de oración cotidiana
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-5 leading-[1.12]">
              Un remanso de calma <br className="hidden sm:inline" />
              para tu espíritu
            </h1>

            <p className="text-stone-200 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-light">
              Compartimos la oración de cada amanecer, encontramos consuelo en los Salmos y sostenemos juntos las cargas de la vida diaria.
            </p>

            {/* Fila de botones */}
            <div className="flex flex-wrap items-center gap-3.5">
              <a 
                href="#muro-oracion"
                className="bg-[#b25310] hover:bg-[#9a440a] active:scale-95 text-white font-medium text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Escribir una petición</span>
                <span className="text-xs">→</span>
              </a>

              <a 
                href="#salmo-del-dia"
                className="bg-black/40 hover:bg-black/60 text-white font-medium text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all border border-white/30 backdrop-blur-sm inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Ver la oración de hoy</span>
              </a>
            </div>
          </div>

          {/* Cita flotante derecha sobre el paisaje */}
          <div className="text-left md:text-right max-w-xs self-start md:self-end pb-4">
            <p className="font-serif italic text-white/95 text-lg sm:text-xl leading-snug">
              &ldquo;En su presencia hay plenitud de gozo.&rdquo;
            </p>
            <p className="text-[#e2ab4b] text-[11px] font-semibold tracking-widest mt-2 uppercase">
              Salmo 16:11
            </p>
          </div>

        </div>
      </section>


      <DailyPsalmCard reading={dailyReading} chileDate={chileDate} amenCount={amenCount} />

      <section className="px-4 mt-4 max-w-5xl mx-auto w-full">
        <div className="bg-[#f0f7f1] text-stone-900 rounded-2xl p-4 sm:p-5 border border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <Image src="/whatsapp.svg" alt="" width={40} height={40} className="w-10 h-10 object-contain shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-snug">Únete al canal de WhatsApp</h3>
              <p className="text-xs text-stone-600 leading-relaxed mt-0.5">Recibe las novedades y oraciones de Cielo Santo directamente en WhatsApp.</p>
            </div>
          </div>
          <a href="https://whatsapp.com/channel/0029VbE70lOKWEKjgKs68S16" target="_blank" rel="noopener noreferrer"
            className="shrink-0 bg-[#128c55] hover:bg-[#0e7547] text-white font-bold text-xs py-2.5 px-5 rounded-full transition-colors shadow-sm">
            Unirme al canal ↗
          </a>
        </div>
      </section>

      {/* ========================================================
          4. SECCIÓN SOSTENIMIENTO INDEPENDIENTE (Fondo oscuro)
      ======================================================== */}
      <section className="mt-20 relative w-full py-20 px-6 sm:px-12 text-white overflow-hidden bg-stone-900">
        {/* Imagen de fondo con roca, flores silvestres y atardecer */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/sosten-bg.webp" 
            alt="Flores silvestres al atardecer" 
            fill
            sizes="100vw"
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-stone-950/65"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-center">
          
          {/* Lado izquierdo con texto y botón */}
          <div className="md:col-span-7 text-left">
            <p className="text-[#e2ab4b] text-[11px] font-semibold tracking-widest uppercase mb-2">
              Sostenimiento independiente
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4 leading-tight">
              Un espacio libre de publicidad <br className="hidden sm:inline" />
              para la oración diaria
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed mb-6 font-light max-w-xl">
              Cielo Santo no vende espacios publicitarios ni cobra por orar. Los servidores, las herramientas de envío y la producción de audio se sostienen gracias al aporte voluntario de quienes encuentran aquí un momento de paz cada día.
            </p>

            <Link 
              href="/donaciones"
              className="bg-[#b25310] hover:bg-[#9a440a] active:scale-95 text-white font-medium text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-amber-200 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Cómo colaborar con el sostenimiento</span>
              <span className="text-xs">→</span>
            </Link>

            <Link 
              href="/nosotros"
              className="text-stone-400 hover:text-white text-xs underline block mt-4 transition-colors"
            >
              Conocer nuestros compromisos éticos →
            </Link>
          </div>

          {/* Lado derecho: Tarjeta translúcida con versículo */}
          <div className="md:col-span-5 flex justify-end">
            <div className="w-full max-w-sm bg-black/45 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-white/15 text-left shadow-2xl">
              <div className="w-8 h-8 mb-3 opacity-90">
                <Image 
                  src="/cross.png" 
                  alt="Cruz" 
                  width={24} 
                  height={32}
                  className="h-6 w-auto object-contain"
                />
              </div>

              <blockquote className="font-serif italic text-stone-100 text-sm sm:text-base leading-relaxed mb-3">
                &ldquo;Cada cual dé como propuso en su corazón; no con tristeza ni por necesidad, porque Dios ama al dador alegre.&rdquo;
              </blockquote>

              <p className="text-[#e2ab4b] text-xs font-semibold tracking-wider uppercase">
                2 Corintios 9:7
              </p>
            </div>
          </div>

        </div>
      </section>


      <PrayerWall initialPeticiones={wall.petitions} initialAgradecimientos={wall.thanks} available={wall.available} />

      {/* ========================================================
          6. SECCIÓN: DEVOCIONAL GRATUITO (Fondo pergamino con pinos)
      ======================================================== */}
      <section id="oraciones-correo" className="relative py-20 px-6 text-center overflow-hidden bg-[#f4eee2] border-t border-[#e8dfce]">
        
        {/* Rama de olivo decorativa */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-auto pointer-events-none hidden md:block opacity-80">
          <Image 
            src="/leaf-decoration.svg"
            alt="Follaje" 
            width={400}
            height={220}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Silueta de pinos y horizonte en la base, fundiéndose suavemente hacia la sección oscura */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 pointer-events-none overflow-hidden">
          <Image 
            src="/hero-prayer.webp"
            alt="Pinos y horizonte al amanecer" 
            fill
            sizes="100vw"
            className="object-cover object-[center_68%] opacity-35"
          />
          {/* Fusión suave desde el fondo pergamino superior hacia la base oscura */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#f4eee2]/50 to-[#f4eee2]"></div>
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          
          <div className="w-8 h-8 mx-auto mb-2 text-[#b77922]">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>
          </div>

          <p className="text-[#a86518] text-[11px] font-semibold tracking-widest uppercase mb-1.5">
            Devocional gratuito
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2 leading-tight">
            Una palabra de fe al comenzar la mañana
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed">
            Recibe en tu correo el versículo del día, una breve meditación y la oración guiada antes de salir al trabajo o iniciar tus tareas.
          </p>
          <NewsletterSignup />

        </div>
      </section>


      {/* ========================================================
          7. SECCIÓN: ORACIONES GUIADAS EN YOUTUBE (Fondo oscuro)
      ======================================================== */}
      <section className="bg-[#121110] text-white py-20 px-6 sm:px-12 text-center">
        <div className="max-w-6xl mx-auto">
          
          <p className="text-[#e2ab4b] text-[11px] font-semibold tracking-widest uppercase mb-1.5">
            Acompañamiento audiovisual
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight">
            Oraciones guiadas para cada momento del día
          </h2>

          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Grabamos y publicamos oraciones diarias para acompañarte en tus rutinas, tus noches de desvelo o al bendecir a tu familia.
          </p>

          {/* 3 Tarjetas de Videos de YouTube */}
          <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
            
            {/* Video 1: Mañana */}
            <div className="bg-stone-900/90 rounded-xl overflow-hidden border border-stone-800 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full overflow-hidden group">
                  <Image 
                    src="/hero-prayer.webp"
                    alt="Oración de la mañana" 
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors"></div>
                  
                  {/* Botón de reproducción circular en el centro */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    8:12
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-bold text-white text-sm sm:text-base mb-1">
                    Oración de la mañana
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Para iniciar la jornada entregando tus cargas y pidiendo discernimiento.
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <a 
                  href="https://youtube.com/@cielosanto20" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#e2ab4b] hover:text-[#f3c675] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Ver en YouTube</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Video 2: Salmo 91 */}
            <div className="bg-stone-900/90 rounded-xl overflow-hidden border border-stone-800 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full overflow-hidden group">
                  <Image 
                    src="/images/yt-thumb-salmo91.jpg" 
                    alt="Salmo 91 y protección" 
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    6:45
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-bold text-white text-sm sm:text-base mb-1">
                    Salmo 91 y protección
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Plegaria de calma y descanso para el hogar ante momentos de prueba.
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <a 
                  href="https://youtube.com/@cielosanto20" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#e2ab4b] hover:text-[#f3c675] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Ver en YouTube</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Video 3: Hijos */}
            <div className="bg-stone-900/90 rounded-xl overflow-hidden border border-stone-800 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video w-full overflow-hidden group">
                  <Image 
                    src="/yt-thumb-hijos-real.webp" 
                    alt="Oración por los hijos" 
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    7:28
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-bold text-white text-sm sm:text-base mb-1">
                    Oración por los hijos
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Intercesiones de bendición para sus estudios, decisiones y protección diaria.
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1">
                <a 
                  href="https://youtube.com/@cielosanto20" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#e2ab4b] hover:text-[#f3c675] text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Ver en YouTube</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

          {/* Botón oficial de YouTube centrado */}
          <div className="text-center">
            <a 
              href="https://youtube.com/@cielosanto20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold px-6 py-3 rounded-full transition-all inline-flex items-center gap-2 shadow-md"
            >
              <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Visitar canal oficial de YouTube (@cielosanto20)</span>
              <span className="text-[11px] text-stone-500">↗</span>
            </a>
          </div>

        </div>
      </section>


    </main>
  );
}
