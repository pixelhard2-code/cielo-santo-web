
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import ResumenSemanalModal from '@/components/ResumenSemanalModal';

const prayerWallDateFormatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Santiago',
});

type Peticion = {
  id: string;
  nombre: string;
  tiempo: string;
  avatar: string;
  peticion: string;
  apoyos: number;
  apoyado?: boolean;
};

type InitialPeticion = Omit<Peticion, 'tiempo' | 'avatar' | 'apoyado'> & { created_at: string };

export default function PrayerWall({ initialPeticiones, initialAgradecimientos, available }: {
  initialPeticiones: InitialPeticion[];
  initialAgradecimientos: InitialPeticion[];
  available: boolean;
}) {
  const normalize = (rows: InitialPeticion[]): Peticion[] => rows.map((row) => ({
    ...row,
    avatar: '/avatar-placeholder.png',
    tiempo: prayerWallDateFormatter.format(new Date(row.created_at)),
  }));
  const [tabMuro, setTabMuro] = useState<'peticiones' | 'agradecimientos'>('peticiones');
  const [peticiones, setPeticiones] = useState<Peticion[]>(() => normalize(initialPeticiones));
  const [agradecimientos, setAgradecimientos] = useState<Peticion[]>(() => normalize(initialAgradecimientos));
  const [nombreInput, setNombreInput] = useState('');
  const [peticionInput, setPeticionInput] = useState('');
  const [tipoPrivacidad, setTipoPrivacidad] = useState<'publica' | 'privada'>('publica');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [guionModalOpen, setGuionModalOpen] = useState(false);
  const [supportedIds, setSupportedIds] = useState<string[]>([]);
  const [reportedIds, setReportedIds] = useState<string[]>([]);

  const handleSubmitPeticion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!available) return;
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitMessage('');
    const form = event.currentTarget;
    const website = new FormData(form).get('website');
    try {
      const response = await fetch('/api/peticiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreInput, peticion: peticionInput, esPrivada: tipoPrivacidad === 'privada', tipo: tabMuro === 'agradecimientos' ? 'agradecimiento' : 'peticion', website }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos recibir tu mensaje.');
      setSubmitSuccess(true);
      setSubmitMessage(tipoPrivacidad === 'privada'
        ? 'Tu intención privada fue recibida y quedó pendiente de revisión pastoral.'
        : 'Tu mensaje fue recibido y quedó pendiente de revisión antes de publicarse.');
      setNombreInput('');
      setPeticionInput('');
      form.reset();
      setTipoPrivacidad('publica');
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'No pudimos recibir tu mensaje.');
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportar = async (id: string) => {
    if (!window.confirm('¿Deseas enviar esta publicación al equipo de moderación?')) return;
    try {
      const response = await fetch('/api/peticiones', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'report', id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos enviar el reporte.');
      setReportedIds((current) => [...current, id]);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No pudimos enviar el reporte.');
    }
  };

  const handleApoyo = async (id: string, isThanks = false) => {
    if (supportedIds.includes(id)) return;
    try {
      const response = await fetch('/api/peticiones', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'support', id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos registrar tu apoyo.');
      const update = (rows: Peticion[]) => rows.map((row) => String(row.id) === id ? { ...row, apoyos: data.apoyos, apoyado: true } : row);
      if (isThanks) setAgradecimientos(update); else setPeticiones(update);
      if (!data.alreadySupported) setSupportedIds((current) => [...current, id]);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No pudimos registrar tu apoyo.');
    }
  };

  return (
    <div>
      <section id="muro-oracion" className="py-20 px-4 max-w-5xl mx-auto w-full scroll-mt-20">
        
        {/* Encabezado del Muro con Icono Comunitario */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#b77922]" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20M4.5 10.5a2.5 2.5 0 0 0 0 5m15-5a2.5 2.5 0 0 1 0 5M2.5 20v-1a4 4 0 0 1 2-3.5m17 4.5v-1a4 4 0 0 0-2-3.5"/></svg>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Muro de la Comunidad
            </h2>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Puedes compartir una intención o agradecimiento. Las publicaciones públicas se revisan antes de aparecer; las privadas solo se guardan para el equipo pastoral autorizado.
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
            Peticiones de oración
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
            Testimonios y gratitud
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
            <label className="hidden" aria-hidden="true">No rellenar<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Tu nombre o sólo la inicial
                </label>
                <input 
                  type="text" 
                  required
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
                required
                value={peticionInput}
                onChange={(e) => setPeticionInput(e.target.value)}
                placeholder="Escribe con sencillez lo que llevas en el corazón..."
                maxLength={500}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310]"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <p className="max-w-lg text-[11px] text-stone-500">No incluyas datos médicos sensibles ni información de otras personas sin su permiso.</p>

              <button 
                type="submit"
                disabled={isSubmitting || !available}
                className="bg-[#9e4a06] hover:bg-[#853e05] disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors shrink-0 shadow-sm"
              >
                {isSubmitting ? "Enviando..." : tabMuro === "agradecimientos" ? "Enviar agradecimiento" : "Enviar intención"}
              </button>
            </div>

            {submitMessage && (
              <div role={submitSuccess ? 'status' : 'alert'} className={`${submitSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'} border px-4 py-2.5 rounded-lg text-xs mt-2`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        {/* Lista de Peticiones con Avatares */}
        <div className="space-y-3.5">
          {!available && <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-950">El muro está pausado mientras se configura su base de datos segura. No hemos recibido ni guardado nuevas intenciones.</p>}
          {available && (tabMuro === "peticiones" ? peticiones : agradecimientos).length === 0 && <p className="text-center text-sm text-stone-500 py-8">Todavía no hay publicaciones públicas. Puedes enviar una intención para revisión.</p>}
          {(available ? (tabMuro === "peticiones" ? peticiones : agradecimientos) : []).map((p) => (
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
                  onClick={() => void handleReportar(p.id)}
                  disabled={reportedIds.includes(String(p.id))}
                  aria-label={`Reportar publicación de ${p.nombre}`}
                  className="text-[11px] text-stone-600 hover:text-rose-600 transition-colors"
                >
                  {reportedIds.includes(String(p.id)) ? "Reportado" : "Reportar"}
                </button>
              </div>

              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed pl-12">
                {p.peticion}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 pl-12 text-xs">
                <button 
                  onClick={() => void handleApoyo(p.id, tabMuro === "agradecimientos")}
                  disabled={p.apoyado || !available}
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
                    `Intención de oración en Cielo Santo por ${p.nombre}:\n"${p.peticion}"\n\nhttps://cielosanto.com/#muro-oracion`
                  )}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-emerald-800 transition-colors inline-flex items-center gap-1.5 text-xs"
                >
                  <Image 
                    src="/whatsapp.svg"
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

        <p className="text-center mt-6 text-[11px] text-stone-500">Mostramos las publicaciones públicas más recientes.</p>

      </section>



      <ResumenSemanalModal isOpen={guionModalOpen} onClose={() => setGuionModalOpen(false)} peticiones={peticiones} />
    </div>
  );
}
