import React from 'react';
import Link from 'next/link';

export default function CampanaDonacion() {
  return (
    <section className="py-16 px-5 max-w-4xl mx-auto w-full">
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex-1 relative z-10 text-center md:text-left">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
            Campaña del Mes
          </span>
          <h2 className="text-3xl font-serif font-bold text-white mb-3">
            Sembrando Esperanza
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
            Este mes, nuestro objetivo es mejorar los equipos de audio para las oraciones matutinas y destinar un porcentaje a causas benéficas de nuestra fundación aliada. Ayúdanos a seguir llevando paz a más personas.
          </p>
          
          <Link 
            href="/donaciones"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
          >
            Conoce cómo apoyar
          </Link>
        </div>

        {/* Elemento visual de apoyo (Icono/Ilustración) */}
        <div className="hidden md:flex shrink-0 w-48 h-48 bg-slate-800 rounded-full border-4 border-slate-700 items-center justify-center relative z-10 shadow-inner">
          <svg className="w-20 h-20 text-amber-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </div>

      </div>
    </section>
  );
}