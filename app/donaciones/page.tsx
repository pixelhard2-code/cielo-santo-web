"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import CheckoutModal, { ModalItem } from '@/components/CheckoutModal';
import VideoModal from '@/components/VideoModal';

export default function Donaciones() {
  const [checkoutItem, setCheckoutItem] = useState<ModalItem | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [montoPersonalizado, setMontoPersonalizado] = useState("");

  const handleOpenAporte = (monto: number, titulo: string, subtitulo: string) => {
    setCheckoutItem({
      id: `aporte_${monto}`,
      title: titulo,
      subtitle: subtitulo,
      priceDisplay: `$${monto.toLocaleString('es-CL')} CLP (aprox. $${(monto / 950).toFixed(1)} USD)`,
      type: 'donacion',
      amount: monto,
      currency: 'CLP',
    });
    setCheckoutOpen(true);
  };

  const handleCustomAporte = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(montoPersonalizado);
    if (!val || val < 1000) {
      alert("Por favor ingresa un monto mínimo de $1.000 CLP.");
      return;
    }
    handleOpenAporte(val, "Aporte Voluntario a Cielo Santo", "Aporte para sostener la plataforma y obras");
  };

  return (
    <main className="min-h-screen bg-stone-50 pb-20 font-sans">
      
      {/* 1. ENCABEZADO */}
      <section className="bg-slate-900 text-white pt-24 pb-32 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="https://images.unsplash.com/photo-1443527216320-7e744084f5a7?q=80&w=2070&auto=format&fit=crop" 
            alt="Luz de esperanza" 
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-4 block">Sostener la Misión</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            Ayúdanos a sostener este <br className="hidden md:block" /> espacio de oración
          </h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Cielo Santo se mantiene gracias a los aportes voluntarios de personas que valoran este refugio de paz. Cada aporte nos permite costear servidores, edición audiovisual y apoyar obras benéficas de alimentación.
          </p>
        </div>
      </section>

      {/* 2. VIDEO DESTACADO (Documentación Audiovisual) */}
      <section className="max-w-4xl mx-auto px-5 -mt-20 relative z-20 mb-20">
        <div className="bg-white p-2 rounded-3xl shadow-2xl">
          <div 
            onClick={() => setVideoOpen(true)}
            className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 flex items-center justify-center group cursor-pointer"
          >
            <Image 
              src="https://images.unsplash.com/photo-1593113589914-075568e09166?q=80&w=2070&auto=format&fit=crop" 
              alt="Ayuda comunitaria" 
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors"></div>
            
            <div className="relative z-10 w-20 h-20 bg-amber-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:bg-amber-500 transition-colors">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <h3 className="text-white font-serif font-bold text-xl md:text-2xl drop-shadow-md">Mira el impacto de tu apoyo</h3>
              <p className="text-slate-200 text-sm drop-shadow-md">Haz clic para ver un mensaje de nuestro equipo (3:15)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOS FONDOS CLAROS Y DIFERENCIADOS */}
      <section className="max-w-5xl mx-auto px-5 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">Transparencia Radical: Dos Destinos Separados</h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            Para cuidar la confianza de nuestra comunidad, separamos de forma estricta el sostenimiento operativo de la plataforma de las campañas solidarias directas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Fondo 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-100 flex flex-col">
            <span className="text-amber-800 text-xs font-bold uppercase tracking-wider block mb-2">1. Operación y Plataforma</span>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Sostener Cielo Santo</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1">
              Financia los servidores web en la nube, las herramientas de distribución por correo, el software de audio y la producción de oraciones diarias para que sigan siendo 100% gratuitas y sin publicidad invasiva.
            </p>
            <div className="bg-stone-50 p-4 rounded-xl text-xs text-slate-600 border border-stone-200">
              ✓ Servidores y CDN • ✓ Envío de devocionales • ✓ Edición audiovisual
            </div>
          </div>

          {/* Fondo 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-100 flex flex-col">
            <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider block mb-2">2. Acción Solidaria</span>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Campañas Solidarias</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1">
              Fondos que van destinados a la compra directa de cajas de despensa, alimentos no perecibles y frazadas de invierno a través de comedores solidarios y fundaciones aliadas verificadas.
            </p>
            <div className="bg-emerald-50 p-4 rounded-xl text-xs text-emerald-900 border border-emerald-200">
              ✓ Cajas de alimentos • ✓ Pan y abrigo • ✓ Rendición de cuentas periódica
            </div>
          </div>
        </div>
      </section>

      {/* 4. TARJETAS DE APORTE VOLUNTARIO NEUTRAS (SIN PROMESAS ESPIRITUALES) */}
      <section className="max-w-5xl mx-auto px-5 mb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Aporte Voluntario</h2>
          <p className="text-slate-500 text-sm italic max-w-xl mx-auto">
            &ldquo;Todos los aportes tienen el mismo valor para nuestra comunidad. El monto no determina ningún beneficio espiritual ni cercanía divina.&rdquo;
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* APORTE 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 flex flex-col text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Aporte Inicial</h3>
            <p className="text-slate-500 text-xs mb-6 flex-1">
              Ayuda a cubrir costos de alojamiento y envío de oraciones matutinas.
            </p>
            <div className="text-3xl font-bold text-slate-900 mb-1">$3.000 <span className="text-sm font-normal text-slate-500">CLP</span></div>
            <div className="text-xs text-slate-400 mb-6">(aprox. $3 USD)</div>
            <button 
              onClick={() => handleOpenAporte(3000, "Aporte Voluntario $3.000 CLP", "Sostén operativo de Cielo Santo")}
              className="w-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-slate-800 font-bold py-3.5 rounded-xl transition-all"
            >
              Aportar $3.000
            </button>
          </div>

          {/* APORTE 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-amber-500 flex flex-col text-center relative hover:-translate-y-1 transition-transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
              MÁS POPULAR
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Aporte Solidario</h3>
            <p className="text-slate-500 text-xs mb-6 flex-1">
              Colabora con el fondo de producción y entrega de raciones de alimentos.
            </p>
            <div className="text-3xl font-bold text-slate-900 mb-1">$10.000 <span className="text-sm font-normal text-slate-500">CLP</span></div>
            <div className="text-xs text-amber-700/80 font-medium mb-6">(aprox. $10.5 USD)</div>
            <button 
              onClick={() => handleOpenAporte(10000, "Aporte Solidario $10.000 CLP", "Sostén de plataforma y ayuda social")}
              className="w-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              Aportar $10.000
            </button>
          </div>

          {/* APORTE 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 flex flex-col text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Sostén Mensual</h3>
            <p className="text-slate-500 text-xs mb-6 flex-1">
              Aporte mensual para asegurar la continuidad de las misiones y videos diarios.
            </p>
            <div className="text-3xl font-bold text-slate-900 mb-1">$25.000 <span className="text-sm font-normal text-slate-500">CLP</span></div>
            <div className="text-xs text-slate-400 mb-6">(aprox. $26 USD)</div>
            <button 
              onClick={() => handleOpenAporte(25000, "Sostén Mensual $25.000 CLP", "Aporte mensual para la obra Cielo Santo")}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all"
            >
              Aportar $25.000
            </button>
          </div>

        </div>

        {/* Formulario de Aporte con Monto Personalizado */}
        <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-center">
          <h4 className="font-bold text-slate-900 text-sm mb-2">¿Prefieres aportar otro monto?</h4>
          <form onSubmit={handleCustomAporte} className="flex gap-3 justify-center">
            <input
              type="number"
              min="1000"
              step="500"
              value={montoPersonalizado}
              onChange={(e) => setMontoPersonalizado(e.target.value)}
              placeholder="Ingresa monto en CLP (ej. 5000)..."
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-slate-800 w-64 focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              Aportar
            </button>
          </form>
        </div>
      </section>

      {/* CIERRE DE TRANSPARENCIA Y CONTACTO */}
      <section className="max-w-3xl mx-auto px-5 text-center opacity-80">
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          Aceptamos pagos a través de Mercado Pago y Webpay (tarjetas de débito, crédito y prepago). Tu transacción se procesa con encriptación bancaria de alta seguridad.
        </p>
        <p className="text-xs text-slate-400">
          Para consultas sobre el destino de los fondos o comprobantes, escríbenos a <span className="underline">contacto@cielosanto.com</span>.
        </p>
      </section>

      {/* Modales */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        item={checkoutItem}
      />

      <VideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoTitle="La Obra de Cielo Santo y Pan y Abrigo"
      />

    </main>
  );
}