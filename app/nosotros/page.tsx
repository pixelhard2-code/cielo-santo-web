import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Sobre Nosotros | Cielo Santo",
  description: "Conoce el origen, el propósito y los compromisos éticos que guían a la comunidad de Cielo Santo.",
};

export default function Nosotros() {
  return (
    <main className="min-h-screen pb-20">
      
      {/* 1. ENCABEZADO */}
      <section className="bg-stone-900 text-stone-100 py-24 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/hero-bg.png" 
            alt="Amanecer en las montañas" 
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/80"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-serif italic text-amber-300 text-base mb-2">Comunidad y vocación</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">
            Quiénes somos y qué nos mueve
          </h1>
          <p className="text-base text-stone-200 font-normal max-w-2xl mx-auto leading-relaxed">
            Cielo Santo nació con una vocación simple y clara: ofrecer un espacio de oración sincera y sosiego para quienes necesitan renovar su fe en medio de las pruebas de la vida cotidiana.
          </p>
        </div>
      </section>

      {/* 2. NUESTRA HISTORIA */}
      <section className="max-w-5xl mx-auto px-5 -mt-10 relative z-20 mb-16">
        <div className="bg-white rounded-2xl p-7 sm:p-10 border border-stone-200 shadow-sm grid md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-7 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-4">
              El origen de este espacio de oración
            </h2>
            <p>
              En momentos de enfermedad, cansancio laboral o dificultades familiares, unos minutos de lectura bíblica y oración tranquila pueden transformar el rumbo del día. Cielo Santo comenzó compartiendo oraciones breves y lecturas de los Salmos en YouTube, donde personas de diversas ciudades comenzaron a congregarse cada amanecer antes de salir de casa.
            </p>
            <p>
              Creemos firmemente en el valor de la <strong>calidez y la autoría humana</strong>. Detrás de cada video publicado, de cada texto escrito y de cada oración en el muro, hay personas reales que dedican su tiempo, su fe y su voz para acompañar las peticiones de los hermanos con cariño y respeto.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 shadow-md">
              <Image 
                src="/nosotros-study.jpg" 
                alt="Biblia de estudio, té matutino y lectura reflexiva" 
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
            <p className="text-[11px] text-stone-500 italic mt-2 text-center">
              Cada reflexión se prepara con estudio bíblico sereno y dedicación personal.
            </p>
          </div>

        </div>
      </section>

      {/* 3. PRINCIPIOS ÉTICOS */}
      <section className="max-w-4xl mx-auto px-5 mb-16">
        <div className="flex justify-center mb-6">
          <Image 
            src="/divider-cross.png" 
            alt="Divisor sagrado con cruz" 
            width={240} 
            height={28} 
            className="h-5 w-auto object-contain opacity-75"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-8 text-center">
          Nuestros compromisos éticos
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 mb-3 opacity-80">
                <Image 
                  src="/cross.png" 
                  alt="Cruz" 
                  width={24} 
                  height={30} 
                  className="h-6 w-auto object-contain" 
                />
              </div>
              <h3 className="font-serif font-bold text-stone-900 mb-2 text-base">
                Independencia espiritual
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                La bendición de Dios no se condiciona ni se compra. Los aportes monetarios son completamente voluntarios y jamás otorgan favores espirituales especiales.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 mb-3 opacity-80">
                <Image 
                  src="/icon-book.png" 
                  alt="Palabra" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6 object-contain" 
                />
              </div>
              <h3 className="font-serif font-bold text-stone-900 mb-2 text-base">
                Transparencia en los recursos
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Diferenciamos con honestidad los fondos requeridos para mantener la plataforma digital de aquellos canalizados a la ayuda comunitaria en terreno.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 mb-3 opacity-80">
                <Image 
                  src="/dove.png" 
                  alt="Paz y reserva" 
                  width={28} 
                  height={24} 
                  className="w-7 h-auto object-contain" 
                />
              </div>
              <h3 className="font-serif font-bold text-stone-900 mb-2 text-base">
                Respeto a la intimidad
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Cuidamos la confidencialidad de cada persona que escribe en el muro. Toda intención marcada como privada se mantiene bajo estricta reserva pastoral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINO DE LOS RECURSOS */}
      <section className="max-w-4xl mx-auto px-5 mb-16">
        <div className="bg-stone-100 p-7 sm:p-9 rounded-2xl border border-stone-200">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2 text-center">
            Cómo se distribuyen los aportes
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm text-center max-w-lg mx-auto mb-6">
            Dos áreas de trabajo para sostener la misión y apoyar al prójimo:
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-36 w-full">
                <Image 
                  src="/oraciones-alba.jpg" 
                  alt="Acompañamiento devocional digital" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px" 
                  className="object-cover" 
                />
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-serif font-bold text-stone-900 text-base mb-1.5">Área digital y audiovisual</h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Costea la infraestructura en la nube, el sistema de correos matutinos, los servidores de audio y la grabación diaria para que las oraciones continúen abiertas y gratuitas para todos.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-36 w-full">
                <Image 
                  src="/solidarity-community.jpg" 
                  alt="Acción solidaria y comedores" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px" 
                  className="object-cover" 
                />
              </div>
              <div className="p-5 flex-1">
                <h3 className="font-serif font-bold text-stone-900 text-base mb-1.5">Área solidaria en terreno</h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Canaliza víveres, canastas familiares y abrigo para personas vulnerables en colaboración con iniciativas solidarias y comedores locales en Chile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACTO */}
      <section className="max-w-xl mx-auto px-5 text-center">
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Contacto directo</h3>
        <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed">
          Si deseas compartir una inquietud, testimoniar una bendición o solicitar información sobre los balances del proyecto, escríbenos directamente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <a 
            href="mailto:contacto@cielosanto.com"
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-xs"
          >
            contacto@cielosanto.com
          </a>
          <Link 
            href="/donaciones"
            className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2.5 px-5 rounded-lg transition-colors text-xs border border-stone-300"
          >
            Información de sostenimiento
          </Link>
        </div>
      </section>

    </main>
  );
}
