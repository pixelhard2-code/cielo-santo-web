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

  // Filtrar y ordenar las intenciones más respaldadas
  const topPeticiones = [...peticiones]
    .sort((a, b) => b.apoyos - a.apoyos)
    .slice(0, 5);

  const guionGenerado = `GUION DE ORACIÓN COMUNITARIA · CIELO SANTO
Domingo de Intercesión

(Tono sereno, pausado, con fondo instrumental suave)

"Hermanos, hoy nos detenemos a poner en las manos del Señor las oraciones y necesidades que nuestra comunidad ha compartido esta semana en el Muro de Cielo Santo.

De manera especial, unimos nuestra fe por:
${topPeticiones.map((p, i) => `${i + 1}. ${p.nombre.trim()}: "${p.peticion}" (${p.apoyos} personas orando por esta intención)`).join('\n')}

Señor, tú conoces el silencio de cada familia, las pruebas de salud y las cargas que cada corazón lleva consigo. Que tu paz, que sobrepasa todo entendimiento, guarde hoy sus vidas. En el nombre de Jesús, amén."

---
(Cierre al público):
"Si tienes una necesidad o deseas dar gracias, puedes escribir tu intención en cualquier momento en cielosanto.com. Estamos para acompañarnos."`;

  const handleCopiar = () => {
    navigator.clipboard.writeText(guionGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-guion-titulo"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-stone-200">
          <div>
            <h3 id="modal-guion-titulo" className="font-serif font-bold text-stone-900 text-lg sm:text-xl">
              Lectura Comunitaria Dominical
            </h3>
            <p className="text-stone-600 text-xs mt-0.5">
              Guion preparado para la intercesión semanal en YouTube con las intenciones compartidas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Cerrar ventana"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-stone-700 text-xs mb-3 leading-relaxed">
          Las intenciones se ordenan por apoyo comunitario y se anonimizan para respetar la intimidad de las familias:
        </p>

        <div className="bg-stone-950 text-stone-100 p-4 rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap mb-5 max-h-72 overflow-y-auto border border-stone-800">
          {guionGenerado}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            onClick={handleCopiar}
            className="bg-amber-800 hover:bg-amber-900 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-xs flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{copiado ? "Texto copiado al portapapeles" : "Copiar texto del guion"}</span>
          </button>
          <button
            onClick={onClose}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-xs"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
