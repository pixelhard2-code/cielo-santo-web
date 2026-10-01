import Image from 'next/image';
import CheckoutButton from '@/components/CheckoutButton';
import LeadMagnetForm from '@/components/LeadMagnetForm';

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
              Una recopilación breve para leer en el teléfono durante noches de desvelo o momentos de agobio. Enviaremos el enlace privado a tu correo.
            </p>
          </div>

          <LeadMagnetForm />
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

          {/* PRODUCTO 2: Libro Digital Semillas de Riqueza */}
          <div className="bg-white rounded-xl border border-stone-200 flex flex-col justify-between shadow-sm overflow-hidden">
            <div className="relative h-48 w-full bg-stone-950 overflow-hidden">
              <Image 
                src="/semillas-banner.webp" 
                alt="Semillas de Riqueza - Cielo Santo" 
                fill 
                sizes="(max-width: 768px) 100vw, 500px" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                <span className="text-white text-xs font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/20">
                  Edición Digital en PDF + Cuaderno de Oración
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#b25310] bg-[#faf5ee] px-2.5 py-0.5 rounded border border-[#b25310]/20 inline-block">
                    Devocional y Guía de Vida
                  </span>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Pago Internacional
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Semillas de Riqueza</h3>
                <p className="text-stone-600 text-sm mb-5 leading-relaxed">
                  Cultiva una vida de fe, gratitud y propósito en Dios. Seis encuentros con la Palabra y un camino devocional guiado de 30 días.
                </p>
                
                <div className="flex flex-col mb-6 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-stone-900">Disponible para cualquier país</span>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Entrega digital inmediata
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Hotmart detecta tu país y adapta el precio a tu moneda local automáticamente.
                  </p>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span><strong>Guía Devocional (51 páginas)</strong> con reflexiones bíblicas, oraciones y aplicaciones prácticas diarias.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span><strong>Cuaderno de Oración (15 páginas)</strong> complementario para registrar tus meditaciones y motivos de gratitud.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span>Descarga inmediata tras el pago y respaldo privado enviado a tu correo.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-stone-900 font-bold">·</span>
                    <span>Pago seguro para cualquier país con tarjeta de crédito, débito, PayPal o medios locales.</span>
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href="https://hotm.io/wwrOcBS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#b25310] hover:bg-[#9a440a] active:scale-95 text-white font-medium py-3.5 px-5 rounded-lg transition-all text-sm flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <span>Comprar libro digital</span>
                  <span aria-hidden="true" className="text-xs">↗</span>
                </a>
                <p className="text-center text-[11px] text-stone-500 mt-2.5">
                  Se abrirá la pasarela de pago segura de Hotmart con entrega digital inmediata.
                </p>
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
              Inmediatamente tras confirmar el pago, recibirás acceso directo para descargar los libros en PDF (Guía devocional y Cuaderno de oración) y un correo con el enlace privado para volver a descargarlos cuando desees.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm mb-1.5">¿Qué medios de pago están disponibles?</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Para el libro <em>Semillas de Riqueza</em>, la pasarela de Hotmart admite compras desde cualquier país en tu moneda local, aceptando tarjetas de crédito, débito, PayPal y métodos locales (como Pix, Oxxo, Sencillito, etc. según tu país).
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
