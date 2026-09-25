"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import ResumenSemanalModal from '@/components/ResumenSemanalModal';

interface Peticion {
  id: string | number;
  nombre: string;
  tiempo: string;
  avatar: string;
  peticion: string;
  apoyos: number;
  apoyado?: boolean;
  esPrivada?: boolean;
  esAgradecimiento?: boolean;
}

const peticionesIniciales: Peticion[] = [
  { 
    id: 1, 
    nombre: "María Elena", 
    tiempo: "hace 2 horas",
    avatar: "/avatar-maria.png",
    peticion: "Pido oración por la salud de mi esposo que está en exámenes médicos.", 
    apoyos: 28, 
    apoyado: false 
  },
  { 
    id: 2, 
    nombre: "Juan C.", 
    tiempo: "hace 4 horas",
    avatar: "/avatar-juan.png",
    peticion: "Por la paz en mi hogar y trabajo para mi hijo mayor.", 
    apoyos: 19, 
    apoyado: false 
  },
  { 
    id: 3, 
    nombre: "Gloria S.", 
    tiempo: "hace 6 horas",
    avatar: "/avatar-gloria.png",
    peticion: "Agradeciendo por un día más de vida y pidiendo fortaleza espiritual.", 
    apoyos: 45, 
    apoyado: false 
  },
];

const agradecimientosIniciales: Peticion[] = [
  { 
    id: 101, 
    nombre: "Elena M.", 
    tiempo: "hace 1 día",
    avatar: "/avatar-maria.png",
    peticion: "Doy gracias al Señor y a quienes oraron por nosotros; la cirugía de mi esposo concluyó sin complicaciones y ya descansa en casa.", 
    apoyos: 34, 
    apoyado: false, 
    esAgradecimiento: true 
  },
  { 
    id: 102, 
    nombre: "Andrés V.", 
    tiempo: "hace 2 días",
    avatar: "/avatar-juan.png",
    peticion: "Pude recuperar un sueño tranquilo tras varias semanas de mucha angustia. Gracias a la comunidad por sus palabras y compañía.", 
    apoyos: 22, 
    apoyado: false, 
    esAgradecimiento: true 
  },
  { 
    id: 103, 
    nombre: "Patricia C.", 
    tiempo: "hace 3 días",
    avatar: "/avatar-gloria.png",
    peticion: "Mi hijo comenzó a trabajar hoy tras meses de búsqueda. Doy testimonio de la fidelidad de Dios y del consuelo que encuentro cada mañana en las oraciones.", 
    apoyos: 51, 
    apoyado: false, 
    esAgradecimiento: true 
  },
];

export default function Home() {
  const [amenCount, setAmenCount] = useState(142);
  const [hasClickedAmen, setHasClickedAmen] = useState(false);

  // Estados del Muro
  const [tabMuro, setTabMuro] = useState<"peticiones" | "agradecimientos">("peticiones");
  const [peticiones, setPeticiones] = useState<Peticion[]>(peticionesIniciales);
  const [agradecimientos, setAgradecimientos] = useState<Peticion[]>(agradecimientosIniciales);
  const [nombreInput, setNombreInput] = useState("");
  const [peticionInput, setPeticionInput] = useState("");
  const [quiereNotificacion, setQuiereNotificacion] = useState(false);
  const [tipoPrivacidad, setTipoPrivacidad] = useState<"publica" | "privada">("publica");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [guionModalOpen, setGuionModalOpen] = useState(false);

  // Estado del Newsletter
  const [emailNewsletter, setEmailNewsletter] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (!isMounted) return;

      try {
        const amenGuardado = localStorage.getItem('cielosanto_amen_registrado');
        if (amenGuardado) {
          setHasClickedAmen(true);
          setAmenCount((prev) => prev + 1);
        }

        const guardadas = localStorage.getItem('cielosanto_peticiones_locales');
        const apoyadasGuardadas: string[] = JSON.parse(localStorage.getItem('cielosanto_apoyadas') || '[]');

        if (guardadas) {
          const parsed: Peticion[] = JSON.parse(guardadas);
          setPeticiones(parsed.filter(p => !p.esPrivada && !p.esAgradecimiento).map(p => ({
            ...p,
            avatar: p.avatar || "/avatar-placeholder.png",
            tiempo: p.tiempo || "reciente",
            apoyado: apoyadasGuardadas.includes(String(p.id))
          })));
        }
      } catch {
        // Fallback seguro
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleAmen = () => {
    if (!hasClickedAmen) {
      setAmenCount(prev => prev + 1);
      setHasClickedAmen(true);
      try {
        localStorage.setItem('cielosanto_amen_registrado', 'true');
      } catch {}
    }
  };

  const handleApoyo = (id: string | number, esAgr = false) => {
    const idStr = String(id);
    const actualizar = (prev: Peticion[]) => prev.map(item => {
      if (String(item.id) === idStr && !item.apoyado) {
        return { ...item, apoyos: item.apoyos + 1, apoyado: true };
      }
      return item;
    });

    if (esAgr) {
      setAgradecimientos(actualizar);
    } else {
      setPeticiones(actualizar);
    }

    try {
      const apoyadasGuardadas: string[] = JSON.parse(localStorage.getItem('cielosanto_apoyadas') || '[]');
      if (!apoyadasGuardadas.includes(idStr)) {
        localStorage.setItem('cielosanto_apoyadas', JSON.stringify([...apoyadasGuardadas, idStr]));
      }
    } catch {}
  };

  const handleReportar = (id: string | number, esAgr = false) => {
    const confirmar = window.confirm("¿Deseas reportar este mensaje para que nuestro equipo lo revise?");
    if (confirmar) {
      if (esAgr) {
        setAgradecimientos(prev => prev.filter(p => p.id !== id));
      } else {
        setPeticiones(prev => prev.filter(p => p.id !== id));
      }
      alert("El mensaje ha sido derivado a moderación. Gracias por cuidar este espacio.");
    }
  };

  const handleSubmitPeticion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInput.trim() || !peticionInput.trim()) {
      alert("Por favor escribe tu nombre y la intención que deseas compartir.");
      return;
    }

    setIsSubmitting(true);
    const esPrivada = tipoPrivacidad === "privada";
    const esAgradecimiento = tabMuro === "agradecimientos";

    const nueva: Peticion = {
      id: Date.now(),
      nombre: nombreInput.trim(),
      tiempo: "hace unos momentos",
      avatar: "/avatar-placeholder.png",
      peticion: peticionInput.trim(),
      apoyos: 1,
      apoyado: true,
      esPrivada,
      esAgradecimiento,
    };

    if (!esPrivada) {
      if (esAgradecimiento) {
        setAgradecimientos([nueva, ...agradecimientos]);
      } else {
        const actualizadas = [nueva, ...peticiones];
        setPeticiones(actualizadas);
        try {
          localStorage.setItem('cielosanto_peticiones_locales', JSON.stringify(actualizadas));
        } catch {}
      }
    }

    try {
      await fetch('/api/peticiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nueva.nombre, 
          peticion: nueva.peticion,
          esPrivada,
          esAgradecimiento
        }),
      });
    } catch {
      // Fallback local
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setNombreInput("");
    setPeticionInput("");
    setQuiereNotificacion(false);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailNewsletter.trim()) return;
    setNewsletterSubscribed(true);
  };

  const urlWhatsappSalmo = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    '"El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar." — Salmo 23:1-2.\n\nQue Dios traiga calma a tu corazón hoy:\nhttps://cielosanto.com'
  )}`;

  return (
    <main className="flex flex-col min-h-screen">
      
      {/* ========================================================
          1. HERO SECTION (Idéntico a la imagen con fondo hero-bg.png)
      ======================================================== */}
      <section className="relative w-full min-h-[640px] md:min-h-[700px] flex items-center px-6 sm:px-12 py-20 text-white overflow-hidden">
        {/* Fondo panorámico con montañas y pinos */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="Amanecer en las montañas" 
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Sutil viñeta para asegurar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/70"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          
          {/* Bloque principal izquierdo */}
          <div className="max-w-xl text-left">
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


      {/* ========================================================
          2. TARJETA FLOTANTE: "SALMO DEL DÍA"
      ======================================================== */}
      <section id="salmo-del-dia" className="relative -mt-20 z-20 px-4 max-w-4xl mx-auto w-full">
        
        {/* Hojas decorativas de olivo a la izquierda (exactas a la imagen) */}
        <div className="absolute -left-12 -top-8 w-28 h-auto pointer-events-none hidden lg:block opacity-85">
          <Image 
            src="/leaf-1.png" 
            alt="Rama de olivo decorativa" 
            width={120} 
            height={90}
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#e8e2d4] shadow-xl text-center relative">
          
          {/* Encabezado superior de la tarjeta */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="w-16 hidden sm:block"></div>
            
            <div className="flex items-center justify-center gap-2 mx-auto">
              <Image 
                src="/icon-book.png" 
                alt="Libro" 
                width={22} 
                height={22}
                className="w-5 h-5 object-contain"
              />
              <h2 className="font-serif font-bold text-stone-900 text-lg sm:text-xl tracking-tight">
                Salmo del día
              </h2>
            </div>

            <span className="text-stone-600 text-xs font-medium">
              Viernes, 25 de septiembre de 2026
            </span>
          </div>

          {/* Versículo Principal */}
          <blockquote className="text-xl sm:text-2xl font-serif text-stone-900 italic my-5 leading-relaxed max-w-2xl mx-auto">
            &ldquo;El Señor es mi pastor; nada me faltará.<br className="hidden sm:inline" /> En lugares de delicados pastos me hará descansar.&rdquo;
          </blockquote>
          <p className="text-stone-600 text-xs font-bold tracking-widest uppercase mb-7">
            Salmo 23:1-2
          </p>

          {/* 2 Columnas internas: Reflexión y Oración de hoy */}
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-6">
            
            {/* Columna Reflexión */}
            <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#efe9dd]">
              <div className="flex items-center gap-2 mb-2">
                <Image 
                  src="/icon-book.png" 
                  alt="Reflexión" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 object-contain opacity-80"
                />
                <h3 className="font-serif font-bold text-stone-900 text-sm">Reflexión</h3>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                La paz interior no comienza cuando se han resuelto todas las incertidumbres, sino cuando descansamos en la certeza de que Dios cuida de nosotros. No necesitas resolver todo hoy; da el paso que te corresponde con quietud.
              </p>
            </div>

            {/* Columna Oración de hoy */}
            <div className="bg-[#faf7f2] p-5 rounded-xl border border-[#efe9dd]">
              <div className="flex items-center gap-2 mb-2">
                <Image 
                  src="/icon-pray.png" 
                  alt="Oración" 
                  width={16} 
                  height={16} 
                  className="w-4 h-4 object-contain opacity-80"
                />
                <h3 className="font-serif font-bold text-stone-900 text-sm">Oración de hoy</h3>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
                &ldquo;Señor, en tus manos pongo mis preocupaciones de esta jornada. Renueva mis fuerzas y concédeme la templanza para vivir en paz con mi familia y mi prójimo. Amén.&rdquo;
              </p>
            </div>

          </div>

          {/* Acciones al pie de la tarjeta */}
          <div className="flex flex-wrap justify-center gap-3 items-center pt-2">
            <button 
              onClick={handleAmen}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                hasClickedAmen 
                  ? 'bg-stone-200 text-stone-900 cursor-default' 
                  : 'bg-[#1c1917] hover:bg-stone-800 text-white shadow-sm'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-amber-300 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Decir Amén ({amenCount})</span>
            </button>

            <a 
              href={urlWhatsappSalmo}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white hover:bg-stone-50 text-stone-700 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 border border-stone-300"
            >
              <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Compartir versículo</span>
            </a>
          </div>

        </div>
      </section>


      {/* ========================================================
          3. BANNER OFICIAL DE WHATSAPP (Verde bosque)
      ======================================================== */}
      <section className="px-4 mt-6 max-w-4xl mx-auto w-full">
        <div className="bg-[#0e3f2d] text-white rounded-2xl p-4 sm:p-5 border border-[#19523c] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <Image 
              src="/icon-whatsapp.png" 
              alt="WhatsApp" 
              width={40} 
              height={40}
              className="w-10 h-10 object-contain shrink-0 mx-auto sm:mx-0"
            />
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                Oración matutina por WhatsApp
              </h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed mt-0.5">
                Recibe cada amanecer el Salmo del día y la oración en tu teléfono. Es gratuito y nadie puede ver tu número de contacto.
              </p>
            </div>
          </div>

          <a
            href="https://whatsapp.com/channel/cielosanto"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white hover:bg-stone-100 text-[#0e3f2d] font-bold text-xs py-2.5 px-5 rounded-full transition-colors shadow-sm"
          >
            Seguir el canal →
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
            src="/sosten-bg.jpg" 
            alt="Flores silvestres al atardecer" 
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-stone-950/75"></div>
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


      {/* ========================================================
          5. SECCIÓN: MURO DE LA COMUNIDAD
      ======================================================== */}
      <section id="muro-oracion" className="py-20 px-4 max-w-4xl mx-auto w-full scroll-mt-20">
        
        {/* Encabezado del Muro con Icono Comunitario */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Image 
              src="/icon-community.png" 
              alt="Comunidad" 
              width={26} 
              height={26} 
              className="w-6 h-6 object-contain"
            />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Muro de la Comunidad
            </h2>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Puedes escribir una intención de salud, familia o trabajo. Los domingos unimos nuestras voces en el video comunitario de YouTube para interceder por las intenciones registradas aquí.
          </p>

          <button
            onClick={() => setGuionModalOpen(true)}
            className="text-stone-500 hover:text-stone-800 text-xs underline block mx-auto mt-2 transition-colors"
          >
            Conocer cómo funciona →
          </button>
        </div>

        {/* Pestañas de Navegación del Muro */}
        <div className="flex justify-center border-b border-stone-200 mb-8" role="tablist">
          <button
            onClick={() => setTabMuro("peticiones")}
            role="tab"
            aria-selected={tabMuro === "peticiones"}
            className={`pb-3 px-6 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tabMuro === "peticiones"
                ? "border-[#b25310] text-stone-900"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            Peticiones de oración (3.245)
          </button>
          <button
            onClick={() => setTabMuro("agradecimientos")}
            role="tab"
            aria-selected={tabMuro === "agradecimientos"}
            className={`pb-3 px-6 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tabMuro === "agradecimientos"
                ? "border-[#b25310] text-stone-900"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            Testimonios y gratitud (862)
          </button>
        </div>

        {/* Formulario blanco para compartir intención */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#b25310]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              {tabMuro === "peticiones" ? "Comparte una intención de oración" : "Comparte tu testimonio o gratitud"}
            </h3>
          </div>
          
          <p className="text-stone-500 text-xs mb-5">
            Por respeto y cuidado de la privacidad familiar, evita incluir apellidos completos, números de teléfono o información médica confidencial.
          </p>

          <form onSubmit={handleSubmitPeticion} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Tu nombre o sólo la inicial
                </label>
                <input 
                  type="text" 
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Ejemplo: Carmen S. o Roberto"
                  maxLength={80}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310]"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Visibilidad de tu mensaje
                </label>
                <div className="flex items-center gap-4 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-xs h-[42px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="privacidad" 
                      value="publica" 
                      checked={tipoPrivacidad === "publica"} 
                      onChange={() => setTipoPrivacidad("publica")} 
                      className="text-[#b25310] focus:ring-[#b25310]"
                    />
                    <span className="text-stone-700">Visible en el muro</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="privacidad" 
                      value="privada" 
                      checked={tipoPrivacidad === "privada"} 
                      onChange={() => setTipoPrivacidad("privada")} 
                      className="text-[#b25310] focus:ring-[#b25310]"
                    />
                    <span className="text-stone-700">Solo equipo pastoral</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-600 mb-1">
                {tabMuro === "peticiones" ? "Mensaje o motivo de oración" : "Relato o motivo de gratitud"}
              </label>
              <textarea 
                rows={3}
                value={peticionInput}
                onChange={(e) => setPeticionInput(e.target.value)}
                placeholder="Escribe con sencillez lo que llevas en el corazón..."
                maxLength={500}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310]"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
                <input 
                  type="checkbox" 
                  checked={quiereNotificacion} 
                  onChange={(e) => setQuiereNotificacion(e.target.checked)} 
                  className="rounded text-[#b25310] focus:ring-[#b25310]"
                />
                <span>Deseo recibir un aviso por correo cuando alguien se una en oración por esta intención.</span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#9e4a06] hover:bg-[#853e05] disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors shrink-0 shadow-sm"
              >
                {isSubmitting ? "Publicando..." : tabMuro === "agradecimientos" ? "Publicar agradecimiento" : "Publicar intención"}
              </button>
            </div>

            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-lg text-xs mt-2">
                Tu intención ha sido registrada con respeto en la comunidad.
              </div>
            )}
          </form>
        </div>

        {/* Lista de Peticiones con Avatares */}
        <div className="space-y-3.5">
          {(tabMuro === "peticiones" ? peticiones : agradecimientos).map((p) => (
            <article key={p.id} className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-sm flex flex-col gap-2.5">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 relative bg-stone-100 border border-stone-200">
                    <Image 
                      src={p.avatar} 
                      alt={p.nombre} 
                      width={36} 
                      height={36} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">{p.nombre}</span>
                    <span className="text-[11px] text-stone-600 ml-2">· {p.tiempo}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleReportar(p.id, tabMuro === "agradecimientos")}
                  className="text-[11px] text-stone-600 hover:text-rose-600 transition-colors"
                >
                  Reportar
                </button>
              </div>

              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed pl-12">
                {p.peticion}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 pl-12 text-xs">
                <button 
                  onClick={() => handleApoyo(p.id, tabMuro === "agradecimientos")}
                  className={`inline-flex items-center gap-1.5 transition-colors ${
                    p.apoyado 
                      ? 'text-[#b25310] font-semibold' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <svg className={`w-3.5 h-3.5 ${p.apoyado ? 'fill-current text-[#b25310]' : 'text-stone-400'}`} fill={p.apoyado ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Unirme en oración ({p.apoyos})</span>
                </button>

                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Petición de oración en Cielo Santo por ${p.nombre}:\n"${p.peticion}"\n\nhttps://cielosanto.com/#muro-oracion`
                  )}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-emerald-800 transition-colors inline-flex items-center gap-1.5 text-xs"
                >
                  <Image 
                    src="/icon-whatsapp.png" 
                    alt="WhatsApp" 
                    width={14} 
                    height={14} 
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>Compartir en WhatsApp</span>
                </a>
              </div>

            </article>
          ))}
        </div>

        {/* Botón Ver más peticiones */}
        <div className="text-center mt-6">
          <button 
            type="button"
            className="bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs px-6 py-2.5 rounded-full border border-stone-300 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <span>Ver más peticiones</span>
            <span className="text-xs">→</span>
          </button>
        </div>

      </section>


      {/* ========================================================
          6. SECCIÓN: DEVOCIONAL GRATUITO (Fondo pergamino con pinos)
      ======================================================== */}
      <section className="relative py-20 px-6 text-center overflow-hidden bg-[#f4eee2] border-t border-[#e8dfce]">
        
        {/* Hojas decorativas en los bordes laterales */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-auto pointer-events-none hidden md:block opacity-75">
          <Image 
            src="/leaf-1.png" 
            alt="Follaje" 
            width={120} 
            height={90} 
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-auto pointer-events-none hidden md:block opacity-75">
          <Image 
            src="/leaf-2.png" 
            alt="Follaje" 
            width={120} 
            height={90} 
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Silueta de pinos en la base */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none opacity-20">
          <Image 
            src="/mountains-illustration.png" 
            alt="Silueta de bosque" 
            fill
            sizes="100vw"
            className="object-cover object-bottom"
          />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          
          <div className="w-8 h-8 mx-auto mb-2 opacity-85">
            <Image 
              src="/icon-email.png" 
              alt="Email" 
              width={32} 
              height={32} 
              className="w-full h-full object-contain"
            />
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

          {!newsletterSubscribed ? (
            <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                required
                value={emailNewsletter}
                onChange={(e) => setEmailNewsletter(e.target.value)}
                placeholder="Tu correo electrónico..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310] shadow-sm"
              />
              <button 
                type="submit"
                className="bg-[#9e4a06] hover:bg-[#853e05] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm shrink-0"
              >
                Recibir oraciones
              </button>
            </form>
          ) : (
            <div className="bg-white p-3.5 rounded-lg border border-stone-300 text-stone-800 text-xs">
              Tu dirección ha sido registrada. Comenzarás a recibir la reflexión a partir de mañana.
            </div>
          )}

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
                    src="/yt-thumb-manana.png" 
                    alt="Oración de la mañana" 
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  
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
                    src="/yt-thumb-salmo91.png" 
                    alt="Salmo 91 y protección" 
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

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
                    src="/yt-thumb-hijos.png" 
                    alt="Oración por los hijos" 
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

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


      {/* Reproductor de Audio Flotante Sereno */}
      <AudioPlayer />

      {/* Modal Guion Dominical para el creador */}
      <ResumenSemanalModal
        isOpen={guionModalOpen}
        onClose={() => setGuionModalOpen(false)}
        peticiones={peticiones}
      />

    </main>
  );
}