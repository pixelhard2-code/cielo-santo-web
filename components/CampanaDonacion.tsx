import React from 'react';
import Link from 'next/link';

export default function CampanaDonacion() {
  return (
    <section className="py-12 px-5 max-w-4xl mx-auto w-full">
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-7 md:p-10 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-amber-400 font-serif text-sm italic mb-1.5">
            Sostenimiento independiente
          </p>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
            Un espacio libre de publicidad para la oración diaria
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed mb-6 max-w-xl">
            Cielo Santo no vende espacios publicitarios ni cobra por orar. Los servidores, las herramientas de envío y la producción de audio se sostienen gracias al aporte voluntario de quienes encuentran aquí un momento de paz cada día.
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link 
              href="/donaciones"
              className="bg-amber-800 hover:bg-amber-700 active:scale-95 text-white font-medium py-3 px-6 rounded-lg transition-colors text-sm"
            >
              Cómo colaborar con el sostenimiento
            </Link>
            <Link 
              href="/nosotros"
              className="text-stone-400 hover:text-stone-200 text-sm font-medium transition-colors"
            >
              Conocer nuestros compromisos éticos →
            </Link>
          </div>
        </div>

        {/* Cita breve y sobria */}
        <div className="w-full md:w-64 bg-stone-950/70 p-5 rounded-xl border border-stone-800/80 text-left shrink-0">
          <p className="text-xs text-stone-300 italic leading-relaxed font-serif">
            &ldquo;Cada cual dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.&rdquo;
          </p>
          <p className="text-[11px] text-amber-400/90 font-medium mt-2">
            2 Corintios 9:7
          </p>
        </div>

      </div>
    </section>
  );
}