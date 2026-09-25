import Image from 'next/image';
import CheckoutButton from '@/components/CheckoutButton';
import CustomDonationForm from '@/components/CustomDonationForm';

export const metadata = {
  title: 'Sostén y misión',
  description: 'Conoce cómo sostener Cielo Santo y cómo se separan los recursos digitales de la ayuda solidaria.',
};

export default function Donaciones() {
  return (
    <main className="min-h-screen pb-20">
      
      {/* 1. ENCABEZADO */}
      <section className="bg-stone-900 text-stone-100 pt-20 pb-28 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/hero-bg-alt1.png" 
            alt="Luz de amanecer sobre montañas" 
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-stone-950/80"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-serif italic text-amber-300 text-base mb-2">Sostenimiento voluntario</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">
            Cómo se mantiene este espacio de oración
          </h1>
          <p className="text-base text-stone-200 font-normal max-w-2xl mx-auto leading-relaxed">
            Cielo Santo es un ministerio independiente que no recibe subvenciones ni cobra por orar. Se sostiene gracias al aporte libre de personas que desean que esta palabra siga llegando a miles de hogares cada amanecer.
          </p>
        </div>
      </section>

      {/* 2. VIDEO / MENSAJE DEL EQUIPO */}
      <section className="max-w-4xl mx-auto px-5 -mt-16 relative z-20 mb-16">
        <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm">
          <a href="https://youtube.com/@cielosanto20" target="_blank" rel="noopener noreferrer"
            className="relative rounded-xl overflow-hidden aspect-video bg-stone-800 flex items-center justify-center group">
            <Image 
              src="/solidarity-community.webp" 
              alt="Comunidad reunida y ayuda solidaria" 
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/25 transition-colors"></div>
            
            <div className="relative z-10 w-16 h-16 bg-amber-800/90 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-amber-700 transition-colors">
              <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            
            <div className="absolute bottom-5 left-5 right-5 text-left">
              <p className="text-white font-serif font-bold text-lg sm:text-xl">Conoce el canal de Cielo Santo</p>
              <p className="text-stone-300 text-xs mt-0.5">Ver oraciones y reflexiones en YouTube</p>
            </div>
          </a>
        </div>
      </section>

      {/* 3. DOS DESTINOS CLAROS */}
      <section className="max-w-5xl mx-auto px-5 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
            El destino de cada colaboración
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
            Separamos de forma responsable los fondos requeridos para operar la infraestructura técnica de aquellos destinados a la ayuda comunitaria en terreno.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="relative h-44 w-full">
              <Image 
                src="/bible-bg.webp" 
                alt="Producción devocional y estudio bíblico" 
                fill 
                sizes="(max-width: 768px) 100vw, 500px" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                  Infraestructura digital
                </span>
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">Infraestructura y producción</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Permite costear los servidores web, el software de distribución de correos diarios, el almacenamiento en la nube y el equipo de audio y edición para mantener las oraciones libres de anuncios invasivos.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3 text-xs text-stone-600">
                Servidores · Envío de devocionales · Producción de audio diario
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="relative h-44 w-full">
              <Image 
                src="/solidarity-community.webp" 
                alt="Ayuda solidaria y comedores" 
                fill 
                sizes="(max-width: 768px) 100vw, 500px" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded">
                  Labor comunitaria
                </span>
              </div>
            </div>
            <div className="p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">Apoyo a comedores y abrigo</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Un porcentaje de los fondos recaudados se canaliza a la compra directa de alimentos no perecibles, víveres básicos y abrigo para familias en coordinación con comedores comunitarios de Santiago y regiones.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3 text-xs text-stone-600">
                Víveres no perecibles · Cajas familiares · Apoyo directo a comedores
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRANSPARENCIA Y RENDICIÓN */}
      <section className="max-w-4xl mx-auto px-5 mb-16">
        <div className="bg-stone-100 rounded-xl p-6 sm:p-8 border border-stone-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-stone-200">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">Criterio de transparencia</h3>
              <p className="text-stone-600 text-xs">Rendición periódica y uso honesto de los recursos</p>
            </div>
            <a 
              href="mailto:contacto@cielosanto.com?subject=Consulta%20sobre%20rendicion%20de%20fondos" 
              className="text-xs text-amber-900 hover:text-amber-950 font-semibold underline"
            >
              Solicitar informe de gastos por correo
            </a>
          </div>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-4">
            Cada aporte se administra con rigor ético. Si en cualquier momento deseas conocer el detalle del balance de gastos de servidores, herramientas de correo o entregas solidarias realizadas durante el año, puedes escribirnos y con gusto te compartiremos los comprobantes correspondientes.
          </p>

          <p className="text-stone-500 text-xs italic">
            Nota legal: En Chile, estos aportes constituyen colaboraciones voluntarias para la mantención del proyecto digital y no dan derecho a certificados de donación con rebaja tributaria.
          </p>
        </div>
      </section>

      {/* 5. TARJETAS DE APORTE VOLUNTARIO SOBRIAS */}
      <section className="max-w-5xl mx-auto px-5 mb-20">
        <div className="flex justify-center mb-6">
          <Image 
            src="/divider-cross.png" 
            alt="Divisor con cruz" 
            width={240} 
            height={28} 
            className="h-5 w-auto object-contain opacity-75"
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
            Aportes voluntarios sugeridos
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
            El valor del aporte es libre y voluntario. Ningún monto condiciona la fe ni otorga privilegios; todos oramos con el mismo corazón.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* APORTE 1 */}
          <div className="bg-white rounded-xl p-7 border border-stone-200 shadow-sm flex flex-col text-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Aporte de sostenimiento</h3>
              <p className="text-stone-600 text-xs mb-5">
                Colabora con el costo de servidores y distribución de reflexiones diarias.
              </p>
              <div className="text-3xl font-serif font-bold text-stone-900 mb-0.5">$3.000 <span className="text-xs font-sans text-stone-500 font-normal">CLP</span></div>
            </div>
            <CheckoutButton item={{ id: 'aporte_operativo', title: 'Aporte de sostenimiento', subtitle: 'Sostenimiento de la plataforma y sus contenidos', priceDisplay: '$3.000 CLP', type: 'donacion', amount: 3000, currency: 'CLP' }} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 rounded-lg transition-colors text-sm">
              Aportar $3.000
            </CheckoutButton>
          </div>

          {/* APORTE 2 */}
          <div className="bg-white rounded-xl p-7 border-2 border-stone-800 shadow-sm flex flex-col text-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Aporte solidario</h3>
              <p className="text-stone-600 text-xs mb-5">
                Ayuda a financiar los devocionales y la entrega de alimentos no perecibles.
              </p>
              <div className="text-3xl font-serif font-bold text-stone-900 mb-0.5">$10.000 <span className="text-xs font-sans text-stone-500 font-normal">CLP</span></div>
            </div>
            <CheckoutButton item={{ id: 'aporte_solidario', title: 'Aporte solidario', subtitle: 'Apoyo para el trabajo comunitario', priceDisplay: '$10.000 CLP', type: 'donacion', amount: 10000, currency: 'CLP' }} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 rounded-lg transition-colors text-sm">
              Aportar $10.000
            </CheckoutButton>
          </div>

          {/* APORTE 3 */}
          <div className="bg-white rounded-xl p-7 border border-stone-200 shadow-sm flex flex-col text-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Aporte de continuidad</h3>
              <p className="text-stone-600 text-xs mb-5">
                Contribuye a la producción continua de oraciones y materiales de apoyo familiar.
              </p>
              <div className="text-3xl font-serif font-bold text-stone-900 mb-0.5">$25.000 <span className="text-xs font-sans text-stone-500 font-normal">CLP</span></div>
            </div>
            <CheckoutButton item={{ id: 'aporte_continuidad', title: 'Aporte de continuidad', subtitle: 'Continuidad de oraciones y proyectos comunitarios', priceDisplay: '$25.000 CLP', type: 'donacion', amount: 25000, currency: 'CLP' }} className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 rounded-lg transition-colors text-sm">
              Aportar $25.000
            </CheckoutButton>
          </div>

        </div>

        {/* Formulario de Aporte con Monto Personalizado */}
        <div className="max-w-md mx-auto bg-white p-5 rounded-xl border border-stone-200 text-center">
          <p className="font-medium text-stone-800 text-xs mb-3">Si deseas colaborar con un monto diferente:</p>
          <CustomDonationForm />
        </div>
      </section>

    </main>
  );
}
