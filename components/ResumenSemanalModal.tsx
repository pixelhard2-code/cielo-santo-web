"use client";
import React, { useState } from "react";

interface PeticionResumen {
  id: string | number;
  nombre: string;
  peticion: string;
  apoyos: number;
}

interface ResumenSemanalModalProps {
  isOpen: boolean;
  onClose: () => void;
  peticiones: PeticionResumen[];
}

export default function ResumenSemanalModal({ isOpen, onClose, peticiones }: ResumenSemanalModalProps) {
  const [copiado, setCopiado] = useState(false);

  if (!isOpen) return null;

  // Filtrar y ordenar las más apoyadas de forma anonimizada
  const topPeticiones = [...peticiones]
    .sort((a, b) => b.apoyos - a.apoyos)
    .slice(0, 5);

  const guionGenerado = `🕊️ GUION PARA EL VIDEO COMUNITARIO DE DOMINGO — CIELO SANTO
===================================================================
(Voz cálida y pausada, música sacra de fondo)

"Hermanos queridos, hoy domingo nos detenemos a poner en las manos de Dios
las oraciones que nuestra comunidad ha dejado en el Muro de Cielo Santo 
a lo largo de esta semana.

Nos unimos en fe de manera especial por:
${topPeticiones.map((p, i) => `${i + 1}. Por ${p.nombre.slice(0, 15)}: "${p.peticion}" (Acompañado por ${p.apoyos} hermanos en oración)`).join('\n')}

Señor, tú conoces cada corazón, cada necesidad de salud y cada hogar aquí representado.
Oramos para que tu paz, que sobrepasa todo entendimiento, guarde hoy a cada familia.
En el nombre de Jesús, Amén."
===================================================================
(Recordatorio al público en video):
"Recuerda que si necesitas oración, puedes dejar tu intención en cielosanto.com
y nuestro equipo y comunidad estaremos orando por ti."`;

  const handleCopiar = () => {
    navigator.clipboard.writeText(guionGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-4 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Guion de Oración Comunitaria</h3>
              <p className="text-slate-500 text-xs">Para el video del domingo o transmisión en YouTube</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-stone-100"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-slate-600 text-xs mb-4 leading-relaxed">
          Este guion extrae automáticamente las peticiones con mayor respaldo en la web para que Carlos o el equipo las lean con respeto y autoría humana en el video de YouTube:
        </p>

        <div className="bg-stone-900 text-amber-100 p-4 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap mb-5 max-h-72 overflow-y-auto border border-stone-800 shadow-inner">
          {guionGenerado}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleCopiar}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <span>{copiado ? "✓ ¡Copiado al portapapeles!" : "📋 Copiar Guion Completo"}</span>
          </button>
          <button
            onClick={onClose}
            className="bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium py-3 px-5 rounded-xl transition-colors text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
