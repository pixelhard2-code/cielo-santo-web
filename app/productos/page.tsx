import Image from 'next/image';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata = {
  title: 'Devocionales y lecturas',
  description: 'Descarga lecturas gratuitas y encuentra recursos cristianos de oración y reflexión.',
};

export default async function Productos({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const params = await searchParams;
  return (
    <main className="min-h-screen pb-20">
      
      {/* 1. ENCABEZADO */}
      <section className="bg-stone-900 text-stone-100 py-24 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/hero-bg-alt1.png" 
            alt="Amanecer sobre montañas y lago" 
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/80"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-serif italic text-amber-300 text-base mb-2">Lectura y meditación</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">
            Devocionales para acompañar tu día
          </h1>
          <p className="text-base text-stone-200 max-w-2xl mx-auto leading-relaxed">
            Textos y oraciones preparadas con dedicación para ordenar el pensamiento antes de iniciar la jornada o al terminar la noche.
          </p>
        </div>
      </section>

      {params.checkout === 'cancelado' && <p role="status" className="max-w-5xl mx-auto mt-6 px-5 text-sm text-stone-600">El proceso de pago se canceló; no se realizó ningún cobro.</p>}

      {/* 2. GUÍA DE BOLSILLO SIN COSTO */}
      <section className="max-w-4xl mx-auto px-5 -mt-10 relative z-20 mb-14">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="w-full md:w-44 h-36 md:h-40 relative rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-sm">
            <Image
              src="/siete-salmos-cover.webp"
              alt="Guía de 7 Salmos para el descanso"
              fill
              sizes="(max-width: 768px) 100vw, 176px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block mb-2.5">
              Material descargable sin costo
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-2">
              Siete Salmos para la inquietud y el descanso
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xl">
              Una recopilación breve para leer en el teléfono durante noches de desvelo o momentos de agobio. Puedes descargarla ingresando tu correo.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 text-center">
            <a
              href="/resources/siete-salmos-para-el-descanso.pdf"
              download
              className="inline-flex justify-center bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-5 rounded-lg text-sm transition-colors"
            >
              Descargar PDF gratuito
            </a>
            <p className="text-[11px] text-stone-500 mt-2">No necesitas compartir tu correo.</p>
          </div>
        </div>
      </section>

      {/* 3. MATERIALES DE ACOMPAÑAMIENTO */}
      <section className="max-w-5xl mx-auto px-5">
        <div className="flex justify-center mb-8">
          <Image 
            src="/divider-cross.png" 
            alt="Divisor sagrado con cruz" 
            width={240} 
            height={28} 
            className="h-5 w-auto object-contain opacity-75"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          
          {/* PRODUCTO 1: Suscripción Devocional */}
          <div className="bg-white rounded-xl border border-stone-200 flex flex-col justify-between shadow-sm overflow-hidden">
            <div className="relative h-48 w-full">
              <Image 
                src="/oraciones-alba.webp" 
                alt="Amanecer Oraciones del Alba" 
                fill 
                sizes="(max-width: 768px) 100vw, 500px" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                  Acompañamiento matutino por correo
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Oraciones del Alba</h3>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                  Recibirás una lectura, reflexión original y oración en tu correo cada mañana.
                </p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-serif font-bold text-stone-900">$2.990</span>
                  <span className="text-xs text-stone-500">CLP / mes</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-800 font-bold">·</span>
                    <span>Lectura del día y meditación breve directamente en tu correo.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-800 font-bold">·</span>
                    <span>Enlace privado para administrar o cancelar tu suscripción.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-800 font-bold">·</span>
                    <span>Suscripción voluntaria; puedes cancelar en cualquier momento con un clic.</span>
                  </li>
                </ul>
              </div>

              <div>
                <CheckoutButton
                  item={{
                    id: 'suscripcion_alba',
                    title: 'Oraciones del Alba',
                    subtitle: 'Suscripción devocional diaria a las 7:00 AM',
                    priceDisplay: '$2.990 CLP / mes',
                    type: 'suscripcion',
                    amount: 2990,
                    currency: 'CLP',
                  }}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 px-5 rounded-lg transition-colors text-sm"
                >
                  Suscribirme al envío diario
                </CheckoutButton>
                <p className="text-center text-[11px] text-stone-600 mt-2.5">El medio de pago disponible se mostrará al continuar.</p>
              </div>
            </div>
          </div>

          {/* PRODUCTO 2: Libro Digital de Salmos */}
          <div className="bg-white rounded-xl border border-stone-200 flex flex-col justify-between shadow-sm overflow-hidden">
            <div className="relative h-44 w-full">
              <Image 
                src="/bible-bg.webp" 
                alt="30 días con los Salmos" 
                fill 
                sizes="(max-width: 768px) 100vw, 500px" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                  Edición digital en formato PDF
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">30 días con los Salmos</h3>
                <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                  Treinta referencias bíblicas, reflexiones originales y oraciones breves para acompañarte en la mañana o al terminar el día.
                </p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-serif font-bold text-stone-900">$4.990</span>
                  <span className="text-xs text-stone-500">CLP / pago único</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span>Descarga inmediata tras el pago y envío de respaldo a tu correo.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span>Treinta lecturas ordenadas para leer desde el teléfono o imprimir.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span>Tipografía amplia y descanso visual para leer en la cama.</span>
                  </li>
                </ul>
              </div>

              <div>
                <CheckoutButton
                  item={{
                    id: 'devocional_30d',
                    title: '30 días con los Salmos',
                    subtitle: 'Devocional digital en PDF con 30 reflexiones de paz',
                    priceDisplay: '$4.990 CLP único pago',
                    type: 'devocional',
                    amount: 4990,
                    currency: 'CLP',
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-5 rounded-lg transition-colors text-sm"
                >
                  Comprar libro digital
                </CheckoutButton>
                <p className="text-center text-[11px] text-stone-600 mt-2.5">Recibirás un enlace de descarga privado después de confirmar el pago.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PREGUNTAS SOBRE EL MATERIAL */}
      <section className="max-w-3xl mx-auto px-5 mt-16">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm mb-1.5">¿Cómo recibo el devocional tras el pago?</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Después de confirmarse el pago, enviaremos a tu correo un enlace privado de descarga, válido durante 72 horas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm mb-1.5">¿Qué medios de pago están disponibles?</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              El medio de pago disponible para tu compra aparecerá antes de salir al proceso de pago. Los precios se cobran en pesos chilenos.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm mb-1.5">¿Cómo se cancela la suscripción mensual si ya no deseo recibirla?</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              El correo de bienvenida incluye acceso al portal seguro para administrar o cancelar la suscripción.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
