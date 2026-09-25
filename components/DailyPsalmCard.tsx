import Image from 'next/image';
import AmenButton from '@/components/AmenButton';
import type { DailyReading } from '@/lib/daily-content';

export default function DailyPsalmCard({ reading, chileDate, amenCount }: {
  reading: DailyReading;
  chileDate: string;
  amenCount: number | null;
}) {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${reading.reference} · ${reading.title}\n\n${reading.reflection}\n\nhttps://cielosanto.com`
  )}`;
  return (
      <section id="salmo-del-dia" className="relative -mt-20 z-20 px-4 max-w-5xl mx-auto w-full">
        
        {/* Hojas decorativas de olivo a la izquierda (exactas a la imagen) */}
        <div className="absolute -left-12 -top-8 w-28 h-auto pointer-events-none hidden lg:block opacity-85">
          <Image 
            src="/leaf-decoration.svg"
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
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#b77922]" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14m0-14C10.7 6 9 5.5 7 5.5c-1.7 0-3 .4-4 1.1v13c1-.7 2.3-1.1 4-1.1 2 0 3.7.5 5 1.5m0-13c1.3-1 3-1.5 5-1.5 1.7 0 3 .4 4 1.1v13c-1-.7-2.3-1.1-4-1.1-2 0-3.7.5-5 1.5"/></svg>
              <h2 className="font-serif font-bold text-stone-900 text-lg sm:text-xl tracking-tight">
                Salmo del día
              </h2>
            </div>

            <span className="text-stone-600 text-xs font-medium">
              {chileDate}
            </span>
          </div>

          {/* Versículo Principal */}
          <blockquote className="text-xl sm:text-2xl font-serif text-stone-900 italic my-5 leading-relaxed max-w-2xl mx-auto">
            {reading.title}
          </blockquote>
          <p className="text-stone-600 text-xs font-bold tracking-widest uppercase mb-7">
            {reading.reference}
          </p>

          {/* 2 Columnas internas: Reflexión y Oración de hoy */}
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-6">
            
            {/* Columna Reflexión */}
            <div className="bg-[#f1f5ef] p-5 rounded-xl border border-[#e4eadf]">
              <div className="flex items-center gap-2 mb-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#55705b]" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7v14m0-14C10.7 6 9 5.5 7 5.5c-1.7 0-3 .4-4 1.1v13c1-.7 2.3-1.1 4-1.1 2 0 3.7.5 5 1.5m0-13c1.3-1 3-1.5 5-1.5 1.7 0 3 .4 4 1.1v13c-1-.7-2.3-1.1-4-1.1-2 0-3.7.5-5 1.5"/></svg>
                <h3 className="font-serif font-bold text-stone-900 text-sm">Reflexión</h3>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                {reading.reflection}
              </p>
            </div>

            {/* Columna Oración de hoy */}
            <div className="bg-[#faf5eb] p-5 rounded-xl border border-[#efe6d5]">
              <div className="flex items-center gap-2 mb-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[#b77922]" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V9m0 0c-1-2-2.3-3-4-3-1.3 0-2.3.7-2.8 1.8L4 10l4 4m4-5c1-2 2.3-3 4-3 1.3 0 2.3.7 2.8 1.8L20 10l-4 4m-4-5L9 4m3 5 3-5m-7 9 3 3m6-3-3 3"/></svg>
                <h3 className="font-serif font-bold text-stone-900 text-sm">Oración de hoy</h3>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic">
                &ldquo;{reading.prayer}&rdquo;
              </p>
            </div>

          </div>

          {/* Acciones al pie de la tarjeta */}
          <div className="flex flex-wrap justify-center gap-3 items-center pt-2">
            <AmenButton initialCount={amenCount} />

            <a 
              href={whatsappUrl}
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


  );
}
