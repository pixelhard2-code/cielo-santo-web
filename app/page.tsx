"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CampanaDonacion from '@/components/CampanaDonacion';
import AudioPlayer from '@/components/AudioPlayer';
import ResumenSemanalModal from '@/components/ResumenSemanalModal';

interface Peticion {
  id: string | number;
  nombre: string;
  peticion: string;
  apoyos: number;
  apoyado?: boolean;
  esPrivada?: boolean;
  esAgradecimiento?: boolean;
  reportado?: boolean;
}

const peticionesIniciales: Peticion[] = [
  { id: 1, nombre: "María Elena", peticion: "Pido oración por la salud de mi esposo, que está esperando resultados de exámenes médicos esta semana.", apoyos: 28, apoyado: false },
  { id: 2, nombre: "Juan Carlos", peticion: "Por la reconciliación y paz en mi hogar, y una oportunidad laboral para mi hijo mayor.", apoyos: 19, apoyado: false },
  { id: 3, nombre: "Gloria S.", peticion: "Dando gracias a Dios por sostenerme en medio del cansancio y pidiendo serenidad para cuidar a mi madre.", apoyos: 45, apoyado: false },
];

const agradecimientosIniciales: Peticion[] = [
  { id: 101, nombre: "Elena M.", peticion: "Doy gracias al Señor y a quienes oraron por nosotros; la cirugía de mi esposo concluyó sin complicaciones y ya descansa en casa.", apoyos: 34, apoyado: false, esAgradecimiento: true },
  { id: 102, nombre: "Andrés V.", peticion: "Pude recuperar un sueño tranquilo tras varias semanas de mucha angustia. Gracias a la comunidad por sus palabras y compañía.", apoyos: 22, apoyado: false, esAgradecimiento: true },
  { id: 103, nombre: "Patricia C.", peticion: "Mi hijo comenzó a trabajar hoy. Doy testimonio de la fidelidad de Dios y del consuelo que encuentro cada mañana en las oraciones.", apoyos: 51, apoyado: false, esAgradecimiento: true },
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
  const [emailNotifInput, setEmailNotifInput] = useState("");
  const [quiereNotificacion, setQuiereNotificacion] = useState(false);
  const [tipoPrivacidad, setTipoPrivacidad] = useState<"publica" | "privada">("publica");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mensajeApoyoActivo, setMensajeApoyoActivo] = useState<{ id: string | number; texto: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
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

  const handleApoyo = (id: string | number, esAgr = false) => {
    const idStr = String(id);
    const lista = esAgr ? agradecimientos : peticiones;
    const peticionEncontrada = lista.find(p => String(p.id) === idStr);
    const nuevosApoyos = (peticionEncontrada?.apoyos || 0) + 1;

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

    if (peticionEncontrada) {
      setMensajeApoyoActivo({
        id,
        texto: esAgr 
          ? `Nos unimos al agradecimiento de ${peticionEncontrada.nombre}.`
          : `Te has unido en oración junto a otras ${nuevosApoyos} personas por ${peticionEncontrada.nombre}.`
      });
    }
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
      setErrorMessage("Por favor escribe tu nombre y la intención que deseas compartir.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const esPrivada = tipoPrivacidad === "privada";
    const esAgradecimiento = tabMuro === "agradecimientos";

    const nueva: Peticion = {
      id: Date.now(),
      nombre: nombreInput.trim(),
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
          email: quiereNotificacion ? emailNotifInput.trim() : undefined,
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
    setEmailNotifInput("");
    setQuiereNotificacion(false);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 7000);
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailNewsletter.trim()) return;
    setNewsletterSubscribed(true);
  };

  const urlWhatsappSalmo = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    '"El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar." — Salmo 23:1-2.\n\nQue Dios traiga calma a tu corazón hoy. Si necesitas oración o deseas acompañar a otros hermanos, visita:\nhttps://cielosanto.com'
  )}`;

  return (
    <main className="flex flex-col min-h-screen">
      
      {/* 1. HERO EDITORIAL */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center text-center px-5 bg-stone-900 text-stone-100 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-45">
          <Image 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
            alt="Cordillera al amanecer" 
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/70 to-stone-950/90"></div>
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <p className="text-amber-300 font-serif italic text-base md:text-lg mb-3">
            Comunidad de oración cotidiana
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Un remanso de calma para tu espíritu
          </h1>
          <p className="text-base sm:text-lg text-stone-200 font-normal mb-8 max-w-2xl mx-auto leading-relaxed">
            Compartimos la oración de cada amanecer, encontramos consuelo en los Salmos y sostenemos juntos las cargas de la vida diaria.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <a 
              href="#muro-oracion"
              className="w-full sm:w-auto bg-amber-800 hover:bg-amber-700 text-white font-medium text-base py-3.5 px-7 rounded-lg transition-colors"
            >
              Escribir una petición
            </a>
            <Link 
              href="/productos" 
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-stone-100 font-medium text-base py-3.5 px-7 rounded-lg transition-colors border border-white/25"
            >
              Devocionales de paz
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SALMO DEL DÍA Y REFLEXIÓN */}
      <section className="relative -mt-10 z-20 px-4 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-stone-200 text-center shadow-sm">
          <p className="text-xs text-stone-500 font-medium tracking-wide mb-3">
            Lectura compartida para hoy
          </p>
          
          <blockquote className="text-xl sm:text-2xl font-serif text-stone-900 italic mb-2 leading-relaxed">
            &ldquo;El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar.&rdquo;
          </blockquote>
          <p className="text-stone-500 text-sm mb-6 font-medium">Salmo 23:1-2</p>

          {/* Reflexión y Oración Guiada con contraste riguroso */}
          <div className="text-left bg-stone-50 p-5 sm:p-6 rounded-xl border border-stone-200 mb-6 text-sm text-stone-800 leading-relaxed space-y-3">
            <p>
              <strong className="text-stone-950">Reflexión:</strong> La paz interior no comienza cuando se han resuelto todas las incertidumbres, sino cuando descansamos en la certeza de que Dios cuida de nosotros. No necesitas resolver todo hoy; da el paso que te corresponde con quietud.
            </p>
            <p className="italic text-amber-950 font-serif text-base border-l-2 border-amber-700 pl-3 py-0.5">
              &ldquo;Señor, en tus manos pongo mis preocupaciones de esta jornada. Renueva mis fuerzas y concédeme la templanza para vivir en paz con mi familia y mi prójimo. Amén.&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 items-center border-t border-stone-100 pt-5">
            <button 
              onClick={handleAmen}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                hasClickedAmen 
                  ? 'bg-amber-100 text-amber-950 cursor-default border border-amber-200' 
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-15v6l4 2" />
              </svg>
              <span>{hasClickedAmen ? 'Has unido tu Amén' : 'Unirme con un Amén'} ({amenCount})</span>
            </button>

            <a 
              href={urlWhatsappSalmo}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-stone-200"
            >
              <svg className="w-4 h-4 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2z" />
              </svg>
              <span>Compartir versículo</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. CANAL DE WHATSAPP (Avisos discretos sin ruido) */}
      <section className="px-5 mt-8 max-w-3xl mx-auto w-full">
        <div className="bg-emerald-950 text-white rounded-xl p-5 border border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="font-serif font-bold text-white text-base">Oración matutina por WhatsApp</h2>
            <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
              Recibe cada amanecer a las 7:00 AM el Salmo y la oración en tu teléfono. Es gratuito y nadie puede ver tu número de contacto.
            </p>
          </div>
          <a
            href="https://whatsapp.com/channel/cielosanto"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white hover:bg-emerald-50 text-emerald-950 font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors border border-white"
          >
            Seguir el canal
          </a>
        </div>
      </section>

      {/* 4. CAMPAÑA DE SOSTÉN COMUNITARIO */}
      <CampanaDonacion />

      {/* 5. MURO DE PETICIONES Y AGRADECIMIENTOS */}
      <section id="muro-oracion" className="py-16 px-4 max-w-4xl mx-auto w-full scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
            Muro de la Comunidad
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
            Puedes escribir una intención de salud, familia o trabajo. Los domingos unimos nuestras voces en el video comunitario de YouTube para interceder por las intenciones registradas aquí.
          </p>

          {/* Enlace discreto para preparar guion semanal */}
          <div className="mt-3">
            <button
              onClick={() => setGuionModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 underline transition-colors"
            >
              Preparar lectura dominical (organizar peticiones)
            </button>
          </div>
        </div>

        {/* Pestañas limpias y editoriales */}
        <div className="flex justify-center border-b border-stone-200 mb-8" role="tablist">
          <button
            onClick={() => setTabMuro("peticiones")}
            role="tab"
            aria-selected={tabMuro === "peticiones"}
            className={`pb-3 px-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tabMuro === "peticiones"
                ? "border-stone-900 text-stone-950 font-semibold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Peticiones de oración ({peticiones.length})
          </button>
          <button
            onClick={() => setTabMuro("agradecimientos")}
            role="tab"
            aria-selected={tabMuro === "agradecimientos"}
            className={`pb-3 px-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tabMuro === "agradecimientos"
                ? "border-amber-800 text-amber-950 font-semibold"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            Testimonios y gratitud ({agradecimientos.length})
          </button>
        </div>

        {/* Formulario */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 mb-8 shadow-sm">
          <h3 className="font-serif font-bold text-stone-900 mb-1 text-lg">
            {tabMuro === "peticiones" ? "Comparte una intención de oración" : "Comparte unas palabras de gratitud"}
          </h3>
          <p className="text-xs text-stone-600 mb-4">
            Por respeto y cuidado de la privacidad familiar, evita incluir apellidos completos, números de teléfono o información médica confidencial.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmitPeticion}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="nombre-input" className="block text-xs font-medium text-stone-700 mb-1">
                  Tu nombre de pila o iniciales
                </label>
                <input 
                  id="nombre-input"
                  type="text" 
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Ejemplo: Carmen S. o Roberto" 
                  maxLength={80}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-stone-800 text-stone-900 text-sm bg-white"
                />
              </div>

              {/* Selector de Privacidad */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
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
                      className="text-stone-900 focus:ring-stone-800"
                    />
                    <span className="text-stone-800">Visible en el muro</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="privacidad"
                      value="privada"
                      checked={tipoPrivacidad === "privada"}
                      onChange={() => setTipoPrivacidad("privada")}
                      className="text-stone-900 focus:ring-stone-800"
                    />
                    <span className="text-stone-800">Solo equipo pastoral</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="peticion-textarea" className="block text-xs font-medium text-stone-700 mb-1">
                {tabMuro === "peticiones" ? "Mensaje o motivo de oración" : "Relato o agradecimiento"}
              </label>
              <textarea 
                id="peticion-textarea"
                rows={3} 
                value={peticionInput}
                onChange={(e) => setPeticionInput(e.target.value)}
                placeholder={
                  tabMuro === "peticiones"
                    ? "Escribe con sencillez lo que llevas en el corazón..."
                    : "Cuéntanos cómo Dios te ha acompañado o escribe unas palabras de esperanza..."
                }
                maxLength={500}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-stone-800 text-stone-900 text-sm bg-white"
              ></textarea>
            </div>

            {/* Notificación opcional por correo */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer mb-1.5">
                <input
                  type="checkbox"
                  checked={quiereNotificacion}
                  onChange={(e) => setQuiereNotificacion(e.target.checked)}
                  className="rounded text-stone-900 focus:ring-stone-800"
                />
                <span className="text-stone-800">
                  Deseo recibir un aviso por correo cuando alguien se una en oración por esta intención.
                </span>
              </label>

              {quiereNotificacion && (
                <input
                  type="email"
                  value={emailNotifInput}
                  onChange={(e) => setEmailNotifInput(e.target.value)}
                  placeholder="Ingresa tu correo electrónico..."
                  className="w-full px-3 py-2 mt-1 rounded-md border border-stone-300 text-xs text-stone-900 bg-white"
                />
              )}
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-700 font-medium">{errorMessage}</p>
            )}

            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-lg text-xs leading-relaxed">
                {tipoPrivacidad === "privada"
                  ? "Tu intención confidencial ha sido recibida y se mantendrá en reserva pastoral."
                  : tabMuro === "agradecimientos"
                  ? "Gracias por compartir tu gratitud con la comunidad."
                  : "Tu petición ha sido agregada al muro comunitario."}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm self-end"
            >
              {isSubmitting ? "Enviando..." : tabMuro === "agradecimientos" ? "Publicar testimonio" : "Publicar intención"}
            </button>
          </form>
        </div>

        {/* Lista de Peticiones o Agradecimientos */}
        <div className="space-y-3.5">
          {(tabMuro === "peticiones" ? peticiones : agradecimientos).map((p) => (
            <article key={p.id} className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col gap-2.5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900 text-sm">{p.nombre}</span>
                  <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {tabMuro === "agradecimientos" ? `${p.apoyos} personas unidas en gratitud` : `${p.apoyos} personas orando`}
                  </span>
                </div>
                
                <button
                  onClick={() => handleReportar(p.id, tabMuro === "agradecimientos")}
                  className="text-[11px] text-stone-400 hover:text-rose-700 transition-colors"
                  title="Reportar si vulnera la privacidad"
                >
                  Reportar
                </button>
              </div>

              <p className="text-stone-700 text-sm leading-relaxed">{p.peticion}</p>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-stone-100">
                <button 
                  onClick={() => handleApoyo(p.id, tabMuro === "agradecimientos")}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    p.apoyado 
                      ? 'bg-stone-100 text-stone-900 cursor-default font-semibold' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-amber-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{tabMuro === "agradecimientos" ? "Acompañar en gratitud" : "Unirme en oración"} ({p.apoyos})</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    tabMuro === "agradecimientos"
                      ? `Testimonio compartido en Cielo Santo:\n"${p.peticion}" — ${p.nombre}\n\nhttps://cielosanto.com/#muro-oracion`
                      : `Me uní a la oración por ${p.nombre} en Cielo Santo:\n"${p.peticion}"\n\nPuedes dejar también tu intención o acompañar a otros:\nhttps://cielosanto.com/#muro-oracion`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  Compartir en WhatsApp
                </a>
              </div>

              {mensajeApoyoActivo && mensajeApoyoActivo.id === p.id && (
                <div className="text-xs text-amber-950 bg-amber-50/80 p-2.5 rounded border border-amber-200 mt-1">
                  {mensajeApoyoActivo.texto}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* 6. DEVOCIONAL MATUTINO POR CORREO */}
      <section className="py-14 bg-stone-100 border-y border-stone-200 px-5">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-serif italic text-stone-700 text-sm mb-1.5">Devocional gratuito</p>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-3">
            Una palabra de fe al comenzar la mañana
          </h2>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
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
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white focus:ring-1 focus:ring-stone-800"
              />
              <button
                type="submit"
                className="bg-amber-800 hover:bg-amber-900 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
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

      {/* 7. ENCUENTROS DE ORACIÓN EN YOUTUBE */}
      <section className="py-16 bg-stone-900 text-stone-100 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 font-serif italic text-sm mb-1.5">Acompañamiento audiovisual</p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
            Oraciones guiadas para cada momento del día
          </h2>
          <p className="text-stone-300 text-sm mb-10 max-w-xl mx-auto leading-relaxed">
            Grabamos y publicamos oraciones diarias para acompañarte en tus rutinas, tus noches de desvelo o al bendecir a tu familia.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-10 text-left">
            <div className="bg-stone-800/90 p-5 rounded-xl border border-stone-700">
              <h3 className="font-serif font-semibold text-base mb-1.5 text-white">Oración de la mañana</h3>
              <p className="text-stone-300 text-xs leading-relaxed mb-4">Para iniciar la jornada entregando las cargas y pidiendo discernimiento.</p>
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors"
              >
                Ver en YouTube →
              </a>
            </div>

            <div className="bg-stone-800/90 p-5 rounded-xl border border-stone-700">
              <h3 className="font-serif font-semibold text-base mb-1.5 text-white">Salmo 91 y protección</h3>
              <p className="text-stone-300 text-xs leading-relaxed mb-4">Plegaria de calma y descanso para el hogar ante momentos de prueba.</p>
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors"
              >
                Ver en YouTube →
              </a>
            </div>

            <div className="bg-stone-800/90 p-5 rounded-xl border border-stone-700">
              <h3 className="font-serif font-semibold text-base mb-1.5 text-white">Oración por los hijos</h3>
              <p className="text-stone-300 text-xs leading-relaxed mb-4">Intenciones de bendición para sus estudios, decisiones y protección diaria.</p>
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors"
              >
                Ver en YouTube →
              </a>
            </div>
          </div>

          <a 
            href="https://youtube.com/@cielosanto20" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-stone-100 hover:bg-stone-200 text-stone-900 px-6 py-3 rounded-lg font-medium text-sm transition-colors"
          >
            Visitar canal oficial de YouTube (@cielosanto20)
          </a>
        </div>
      </section>

      {/* Reproductor de Audio Flotante */}
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