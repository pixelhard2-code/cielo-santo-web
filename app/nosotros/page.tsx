import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Sobre Nosotros | Cielo Santo",
  description: "Conoce el equipo, la misión y los principios de transparencia que guían el ministerio Cielo Santo.",
};

export default function Nosotros() {
  return (
    <main className="min-h-screen bg-stone-50 pb-20 font-sans">
      
      {/* 1. ENCABEZADO */}
      <section className="bg-slate-900 text-white py-20 px-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-4 block">Identidad y Misión</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Quiénes Somos y Qué Nos Mueve</h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Cielo Santo nació con un anhelo simple y profundo: ser un remanso de paz y oración constante para cualquier persona que necesite renovar su esperanza en medio del ruido del mundo.
          </p>
        </div>
      </section>

      {/* 2. NUESTRA HISTORIA Y AUTORÍA HUMANA */}
      <section className="max-w-4xl mx-auto px-5 -mt-10 relative z-20 mb-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-stone-100">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-6">
            El nacimiento de un refugio espiritual
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>
              En tiempos de angustia, enfermedad o incertidumbre económica, encontrar un espacio de silencio y oración sincera puede transformar el día de una familia. 
              Cielo Santo comenzó compartiendo pequeñas oraciones matutinas y Salmos en video a través de YouTube, donde miles de personas comenzaron a congregarse virtualmente cada amanecer para empezar su día con Dios.
            </p>
            <p>
              Creemos firmemente en el poder de la <strong>autoría y la calidez humana</strong>. Detrás de cada video, cada reflexión escrita y cada respuesta a las intenciones del muro, hay personas reales que dedican su tiempo, su fe y su voz a acompañar a los hermanos en oración.
            </p>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS PRINCIPIOS NO NEGOCIABLES */}
      <section className="max-w-4xl mx-auto px-5 mb-16">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">Nuestros Compromisos Éticos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              🕊️
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base font-serif">Separación Espiritual y Financiera</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              La bendición de Dios no se compra ni se vende. Ningún aporte monetario otorga favores divinos especiales; todos los creyentes tienen el mismo valor en nuestra comunidad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              🔍
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base font-serif">Transparencia Radical</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Diferenciamos con claridad los aportes para sostener la plataforma digital de los fondos destinados a causas benéficas de alimentación y abrigo.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              🤝
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-base font-serif">Acompañamiento Sin Juicios</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Acogemos a toda persona que busque a Dios en momentos difíciles. El Muro de Oraciones es un santuario libre, gratuito y confidencial.
            </p>
          </div>
        </div>
      </section>

      {/* 4. DESTINO TRANSPARENTE DE LOS FONDOS */}
      <section className="max-w-4xl mx-auto px-5 mb-16">
        <div className="bg-amber-50/60 p-8 rounded-3xl border border-amber-200/60">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4 text-center">
            ¿Cómo se sostienen nuestras obras?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-2xl border border-amber-100">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider block mb-2">Fondo Operativo</span>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Sostener Cielo Santo</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Destinado a costear servidores en la nube, infraestructura web, herramientas de edición de audio y producción de video diaria para que el contenido siga siendo 100% gratuito.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-100">
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider block mb-2">Fondo Solidario</span>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Campañas Benéficas Aliadas</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Canalizado hacia compras de despensas, cajas de alimentos no perecibles y abrigo para familias vulnerables en comedores solidarios verificados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACTO Y ENLACES */}
      <section className="max-w-2xl mx-auto px-5 text-center">
        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">¿Tienes alguna duda o testimonio?</h3>
        <p className="text-slate-600 text-sm mb-6">
          Nos encantaría escucharte. Puedes escribirnos para compartir un agradecimiento o consultar sobre el uso de recursos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="mailto:contacto@cielosanto.com"
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-all text-sm"
          >
            ✉️ contacto@cielosanto.com
          </a>
          <Link 
            href="/donaciones"
            className="bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-6 rounded-xl transition-all text-sm"
          >
            Conoce cómo apoyar la misión
          </Link>
        </div>
      </section>

    </main>
  );
}
