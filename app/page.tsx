"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CampanaDonacion from '@/components/CampanaDonacion';

interface Peticion {
  id: string | number;
  nombre: string;
  peticion: string;
  apoyos: number;
  apoyado?: boolean;
  esPrivada?: boolean;
  reportado?: boolean;
}

const peticionesIniciales: Peticion[] = [
  { id: 1, nombre: "María Elena", peticion: "Pido oración por la salud de mi esposo que está en exámenes médicos.", apoyos: 28, apoyado: false },
  { id: 2, nombre: "Juan C.", peticion: "Por la paz en mi hogar y trabajo para mi hijo mayor.", apoyos: 19, apoyado: false },
  { id: 3, nombre: "Gloria S.", peticion: "Agradeciendo por un día más de vida y pidiendo fortaleza espiritual.", apoyos: 45, apoyado: false },
];

export default function Home() {
  // Estado del contador de Amén
  const [amenCount, setAmenCount] = useState(142);
  const [hasClickedAmen, setHasClickedAmen] = useState(false);

  // Estados del Muro de Peticiones
  const [peticiones, setPeticiones] = useState<Peticion[]>(peticionesIniciales);
  const [nombreInput, setNombreInput] = useState("");
  const [peticionInput, setPeticionInput] = useState("");
  const [emailNotifInput, setEmailNotifInput] = useState("");
  const [quiereNotificacion, setQuiereNotificacion] = useState(false);
  const [tipoPrivacidad, setTipoPrivacidad] = useState<"publica" | "privada">("publica");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mensajeApoyoActivo, setMensajeApoyoActivo] = useState<{ id: string | number; texto: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Estado del Newsletter gratuito
  const [emailNewsletter, setEmailNewsletter] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Cargar estado persistente de forma asíncrona para respetar ciclo de vida React 19
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
          setPeticiones(parsed.filter(p => !p.esPrivada).map(p => ({
            ...p,
            apoyado: apoyadasGuardadas.includes(String(p.id))
          })));
        } else {
          fetch('/api/peticiones')
            .then(res => res.json())
            .then((data: Peticion[]) => {
              if (isMounted && Array.isArray(data) && data.length > 0) {
                const formateadas = data.map((item) => ({
                  id: item.id,
                  nombre: item.nombre,
                  peticion: item.peticion,
                  apoyos: item.apoyos || 1,
                  apoyado: apoyadasGuardadas.includes(String(item.id))
                }));
                setPeticiones(formateadas);
              }
            })
            .catch(() => {});
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

  const handleApoyo = (id: string | number) => {
    const idStr = String(id);
    const peticionEncontrada = peticiones.find(p => String(p.id) === idStr);
    const nuevosApoyos = (peticionEncontrada?.apoyos || 0) + 1;

    setPeticiones(prev => {
      const actualizadas = prev.map(item => {
        if (String(item.id) === idStr && !item.apoyado) {
          return { ...item, apoyos: item.apoyos + 1, apoyado: true };
        }
        return item;
      });

      try {
        const apoyadasGuardadas: string[] = JSON.parse(localStorage.getItem('cielosanto_apoyadas') || '[]');
        if (!apoyadasGuardadas.includes(idStr)) {
          localStorage.setItem('cielosanto_apoyadas', JSON.stringify([...apoyadasGuardadas, idStr]));
        }
        localStorage.setItem('cielosanto_peticiones_locales', JSON.stringify(actualizadas));
      } catch {}

      return actualizadas;
    });

    if (peticionEncontrada) {
      setMensajeApoyoActivo({
        id,
        texto: `🤍 Gracias. Hoy estás orando junto a otras ${nuevosApoyos} personas por ${peticionEncontrada.nombre}.`
      });
    }
  };

  const handleReportar = (id: string | number) => {
    const confirmar = window.confirm("¿Deseas reportar esta intención para revisión del equipo de moderación?");
    if (confirmar) {
      setPeticiones(prev => prev.filter(p => p.id !== id));
      alert("La intención ha sido reportada y enviada a moderación. Gracias por cuidar nuestro santuario.");
    }
  };

  const handleSubmitPeticion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInput.trim() || !peticionInput.trim()) {
      setErrorMessage("Por favor ingresa tu nombre y tu petición de oración.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const esPrivada = tipoPrivacidad === "privada";

    const nueva: Peticion = {
      id: Date.now(),
      nombre: nombreInput.trim(),
      peticion: peticionInput.trim(),
      apoyos: 1,
      apoyado: true,
      esPrivada,
    };

    if (!esPrivada) {
      const actualizadas = [nueva, ...peticiones];
      setPeticiones(actualizadas);
      try {
        localStorage.setItem('cielosanto_peticiones_locales', JSON.stringify(actualizadas));
      } catch {}
    }

    try {
      await fetch('/api/peticiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nueva.nombre, 
          peticion: nueva.peticion,
          email: quiereNotificacion ? emailNotifInput.trim() : undefined,
          esPrivada
        }),
      });
    } catch {
      // Fallback seguro
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setNombreInput("");
    setPeticionInput("");
    setEmailNotifInput("");
    setQuiereNotificacion(false);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 8000);
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailNewsletter.trim()) return;
    setNewsletterSubscribed(true);
  };

  const urlWhatsappSalmo = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    '🕊️ "El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar." — Salmo 23:1-2.\n\nQue Dios bendiga tu día con paz. Únete a nuestra oración comunitaria o deja tu petición aquí:\nhttps://cielosanto.com'
  )}`;

  return (
    <main className="flex flex-col min-h-screen bg-stone-50 overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] md:h-[70vh] flex items-center justify-center text-center px-5">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
            alt="Amanecer Cielo Santo" 
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto text-white">
          <span className="bg-amber-500/20 backdrop-blur-md text-amber-200 border border-amber-400/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
            Comunidad Unida en Fe
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-5 drop-shadow-lg leading-tight">
            Un refugio de paz para tu espíritu
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md opacity-90">
            Unimos corazones a través de la oración diaria, los Salmos de calma y el acompañamiento mutuo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#muro-oracion"
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-all shadow-xl active:scale-95"
            >
              Dejar Petición de Oración
            </a>
            <Link 
              href="/productos" 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-all border border-white/30 active:scale-95"
            >
              Recursos de Crecimiento
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOY EN CIELO SANTO: SALMO, REFLEXIÓN Y ORACIÓN */}
      <section className="relative -mt-10 z-20 px-4 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-100 text-center">
          <span className="text-amber-700 font-bold uppercase text-xs tracking-widest mb-2 block">
            Hoy en Cielo Santo • Salmo del Día
          </span>
          
          <blockquote className="text-xl md:text-2xl font-serif text-slate-800 italic mb-3 leading-relaxed">
            &ldquo;El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar.&rdquo;
          </blockquote>
          <p className="text-slate-500 text-sm mb-6 font-medium">— Salmo 23:1-2</p>

          {/* Reflexión y Oración Guiada */}
          <div className="text-left bg-amber-50/50 p-5 rounded-2xl border border-amber-100/80 mb-6 text-sm text-slate-700 leading-relaxed space-y-2">
            <p>
              <strong>Reflexión de hoy:</strong> El verdadero descanso no empieza cuando desaparecen todas las dificultades, sino cuando reconocemos que nuestras cargas están en manos de un pastor fiel. Hoy no necesitas resolver todo; da un paso a la vez con serenidad.
            </p>
            <p className="italic text-amber-950 font-serif">
              <strong>Oración guiada:</strong> &ldquo;Señor, pongo en tus manos mis afanes. Renueva mis fuerzas, cuida de mi familia y concédeme la calma para vivir este día en paz. Amén.&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 items-center border-t border-stone-100 pt-6">
            <button 
              onClick={handleAmen}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                hasClickedAmen 
                  ? 'bg-amber-100 text-amber-800 cursor-default' 
                  : 'bg-amber-700 hover:bg-amber-800 text-white shadow-md active:scale-95'
              }`}
            >
              🙏 {hasClickedAmen ? '¡Amén registrado!' : 'Decir Amén'} ({amenCount})
            </button>

            <a 
              href={urlWhatsappSalmo}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-md active:scale-95"
            >
              💬 Compartir en WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* 3. CAMPAÑA DE SOSTÉN */}
      <CampanaDonacion />

      {/* 4. MURO DE PETICIONES */}
      <section id="muro-oracion" className="py-20 px-4 max-w-4xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">Muro de Intenciones</h2>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Tu petición puede formar parte de nuestra oración comunitaria semanal. Todos los domingos oramos juntos en YouTube por las intenciones anotadas en este santuario.
          </p>
        </div>

        {/* Formulario para agregar intención con opciones de privacidad */}
        <div className="bg-amber-50/60 p-6 md:p-8 rounded-3xl border border-amber-200/60 mb-10 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">¿Tienes una petición personal?</h3>
          
          {/* Advertencia de privacidad y datos sensibles */}
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 mb-4 flex items-start gap-2">
            <span className="text-base leading-none">🛡️</span>
            <span>
              <strong>Cuidado de privacidad:</strong> Evita incluir información médica detallada, direcciones, teléfonos o nombres completos de terceros.
            </span>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmitPeticion}>
            <div className="grid sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
                placeholder="Tu nombre de pila o iniciales (Ej. María E.)..." 
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 text-sm bg-white"
              />

              {/* Selector de Privacidad */}
              <div className="flex items-center gap-4 px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="privacidad"
                    value="publica"
                    checked={tipoPrivacidad === "publica"}
                    onChange={() => setTipoPrivacidad("publica")}
                    className="text-amber-700 focus:ring-amber-500"
                  />
                  <span className="font-medium text-slate-700">Pública en muro</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="privacidad"
                    value="privada"
                    checked={tipoPrivacidad === "privada"}
                    onChange={() => setTipoPrivacidad("privada")}
                    className="text-amber-700 focus:ring-amber-500"
                  />
                  <span className="font-medium text-slate-700">Solo para el equipo</span>
                </label>
              </div>
            </div>

            <textarea 
              rows={3} 
              value={peticionInput}
              onChange={(e) => setPeticionInput(e.target.value)}
              placeholder="Escribe tu petición con sencillez aquí para que oremos por ti..." 
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 text-sm bg-white"
            ></textarea>

            {/* Captura de correo con consentimiento (opcional) */}
            <div className="bg-white/60 p-3 rounded-xl border border-stone-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={quiereNotificacion}
                  onChange={(e) => setQuiereNotificacion(e.target.checked)}
                  className="rounded text-amber-700 focus:ring-amber-500"
                />
                <span className="text-slate-700 font-medium">
                  Deseo que me avisen por correo cuando otros hermanos se unan en oración por mí.
                </span>
              </label>

              {quiereNotificacion && (
                <input
                  type="email"
                  value={emailNotifInput}
                  onChange={(e) => setEmailNotifInput(e.target.value)}
                  placeholder="Ingresa tu correo electrónico..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-slate-800 bg-white"
                />
              )}
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
            )}

            {submitSuccess && (
              <div className="bg-amber-100/90 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <span>🕊️</span>
                <span>
                  {tipoPrivacidad === "privada"
                    ? "¡Tu intención privada ha sido recibida con respeto! Será orada confidencialmente."
                    : "¡Tu petición ha sido recibida con amor! Nos unimos en fe contigo."}
                </span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-all text-sm self-end"
            >
              {isSubmitting ? "Publicando..." : "Publicar Intención"}
            </button>
          </form>
        </div>

        {/* Lista de Peticiones Públicas */}
        <div className="space-y-4">
          {peticiones.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-3 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{p.nombre}</span>
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                    {p.apoyos} personas orando
                  </span>
                </div>
                
                {/* Botón reportar intención */}
                <button
                  onClick={() => handleReportar(p.id)}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                  title="Reportar si contiene datos personales o contenido indebido"
                >
                  Reportar
                </button>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">{p.peticion}</p>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-stone-100">
                <button 
                  onClick={() => handleApoyo(p.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                    p.apoyado 
                      ? 'bg-amber-100 text-amber-800 cursor-default' 
                      : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                  }`}
                >
                  🤍 {p.apoyado ? 'Orando contigo' : 'Unirme en Oración'} ({p.apoyos})
                </button>

                {/* Viralidad reflexiva de WhatsApp para la petición */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `🙏 Hoy me uní a una oración comunitaria por ${p.nombre} en Cielo Santo:\n"${p.peticion}"\n\nQuizás esta palabra también pueda acompañarte hoy:\nhttps://cielosanto.com/#muro-oracion`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>📲 Invitar a orar por esta intención</span>
                </a>
              </div>

              {mensajeApoyoActivo && mensajeApoyoActivo.id === p.id && (
                <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {mensajeApoyoActivo.texto}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEWSLETTER GRATUITO: "UNA PALABRA DE ESPERANZA CADA MAÑANA" */}
      <section className="py-14 bg-amber-50/70 border-y border-amber-200/60 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-amber-800 text-xs font-bold uppercase tracking-wider block mb-2">Comunidad Gratuita</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">
            Una palabra de esperanza cada mañana
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Recibe gratis en tu correo el versículo del día, una breve oración matutina y el video devocional antes de iniciar tu jornada.
          </p>

          {!newsletterSubscribed ? (
            <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={emailNewsletter}
                onChange={(e) => setEmailNewsletter(e.target.value)}
                placeholder="Tu correo electrónico..."
                className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 text-sm"
              >
                Recibir Gratis
              </button>
            </form>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-amber-300 text-amber-900 text-sm font-medium">
              🕊️ ¡Bienvenido! Te hemos anotado para recibir la palabra de mañana.
            </div>
          )}
        </div>
      </section>

      {/* 6. ORACIONES EN YOUTUBE (3 CONTENIDOS DESTACADOS) */}
      <section className="py-16 bg-slate-900 text-white px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-3">Oraciones para acompañarte hoy</h2>
          <p className="text-slate-300 text-sm md:text-base mb-10 max-w-xl mx-auto">
            Te compartimos tres oraciones guiadas para encontrar paz en momentos específicos de tu día:
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">Al Despertar</span>
              <h4 className="font-serif font-bold text-lg mb-2 text-white">Oración de la Mañana</h4>
              <p className="text-slate-300 text-xs mb-4">Comienza tu jornada entregando la ansiedad y dando gracias por la vida.</p>
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
              >
                ▶ Escuchar (YouTube)
              </a>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">Protección</span>
              <h4 className="font-serif font-bold text-lg mb-2 text-white">Salmo 91 y Fortaleza</h4>
              <p className="text-slate-300 text-xs mb-4">Un manto de amparo para proteger el hogar ante enfermedades y pruebas.</p>
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
              >
                ▶ Escuchar (YouTube)
              </a>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">Familia</span>
              <h4 className="font-serif font-bold text-lg mb-2 text-white">Oración por los Hijos</h4>
              <p className="text-slate-300 text-xs mb-4">Bendición y guía para los hijos en sus estudios, trabajo y caminos.</p>
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
              >
                ▶ Escuchar (YouTube)
              </a>
            </div>
          </div>

          <a 
            href="https://youtube.com/@cielosanto20" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg gap-3 active:scale-95"
          >
            ▶ Ver todas las oraciones en YouTube (@cielosanto20)
          </a>
        </div>
      </section>

    </main>
  );
}