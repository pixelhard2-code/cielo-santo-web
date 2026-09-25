"use client";
import React, { useState } from 'react';
import CheckoutModal, { ModalItem } from '@/components/CheckoutModal';

export default function Productos() {
  const [selectedItem, setSelectedItem] = useState<ModalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [freeGuideEmail, setFreeGuideEmail] = useState("");
  const [freeGuideDownloaded, setFreeGuideDownloaded] = useState(false);

  const handleOpenCheckout = (item: ModalItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDownloadFreeGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeGuideEmail.trim()) return;

    const guiaTexto = `🕊️ CIELO SANTO — GUÍA DE BOLSILLO: 7 SALMOS PARA LA ANSIEDAD Y EL INSOMNIO
========================================================================
¡Paz y bien! Esta guía fue preparada para acompañarte en tus noches de desvelo
y en esos momentos donde la mente se llena de preocupación.

SALMO 1: "EL SEÑOR ES MI LUZ Y MI SALVACIÓN" (Salmo 27:1)
¿De quién temeré? Cuando el miedo toque a tu puerta, recuerda quién cuida de ti.

SALMO 2: "EN PAZ ME ACOSTARÉ Y ASIMISMO DORMIRÉ" (Salmo 4:8)
Porque solo tú, Señor, me haces vivir confiado. Suelta la necesidad de controlar todo.

SALMO 3: "EL SEÑOR ES MI PASTOR; NADA ME FALTARÁ" (Salmo 23:1-2)
En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.

SALMO 4: "DIOS ES NUESTRO AMPARO Y FORTALEZA" (Salmo 46:1)
Nuestro pronto auxilio en las tribulaciones. Quédate quieto y conoce que Él es Dios.

SALMO 5: "EL QUE HABITA AL ABRIGO DEL ALTÍSIMO" (Salmo 91:1-2)
Morará bajo la sombra del Omnipotente. Ninguna plaga tocará tu morada.

SALMO 6: "MI SOCORRO VIENE DEL SEÑOR" (Salmo 121:1-3)
No dará tu pie al resbaladero, ni se dormirá el que te guarda.

SALMO 7: "ECHA SOBRE EL SEÑOR TU CARGA" (Salmo 55:Respira y entrega)
Y Él te sustentará; no dejará para siempre caído al justo.
========================================================================
Cielo Santo • www.cielosanto.com • Canal oficial de YouTube: @cielosanto20`;

    const blob = new Blob([guiaTexto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "7-Salmos-Ansiedad-CieloSanto.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFreeGuideDownloaded(true);
  };

  return (
    <main className="min-h-screen bg-stone-50 pb-20 font-sans">
      
      {/* 1. ENCABEZADO DE RECURSOS */}
      <section className="bg-slate-900 text-white py-20 px-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-4 block">Materiales de Crecimiento</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Recursos para tu camino de fe</h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Herramientas y guías preparadas con dedicación para acompañarte en tu rutina diaria. 
            Al adquirir este material, no solo enriqueces tu vida espiritual, sino que ayudas a sostener la producción gratuita de Cielo Santo.
          </p>
        </div>
      </section>

      {/* 2. LEAD MAGNET GRATUITO: GUÍA DE 7 SALMOS */}
      <section className="max-w-4xl mx-auto px-5 -mt-10 relative z-20 mb-14">
        <div className="bg-amber-100/90 rounded-3xl p-6 md:p-8 border border-amber-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-amber-800 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              Recurso Gratuito de Bienvenida
            </span>
            <h3 className="text-2xl font-serif font-bold text-amber-950 mb-2">
              7 Salmos para la Ansiedad y el Insomnio
            </h3>
            <p className="text-slate-700 text-xs md:text-sm leading-relaxed">
              Una guía de bolsillo en formato digital diseñada para leer en la cama o en momentos de angustia. Descárgala sin costo.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!freeGuideDownloaded ? (
              <form onSubmit={handleDownloadFreeGuide} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={freeGuideEmail}
                  onChange={(e) => setFreeGuideEmail(e.target.value)}
                  placeholder="Tu correo electrónico..."
                  className="px-4 py-3 rounded-xl border border-amber-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all shadow-md active:scale-95 shrink-0"
                >
                  📥 Descargar Gratis
                </button>
              </form>
            ) : (
              <div className="bg-white text-emerald-800 px-5 py-3 rounded-xl border border-emerald-300 text-xs font-bold text-center">
                ✓ ¡Descarga iniciada! Esperamos que sea de bendición para tu descanso.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. TARJETAS DE RECURSOS */}
      <section className="max-w-5xl mx-auto px-5 relative z-20">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* PRODUCTO 1: Suscripción */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-stone-100 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="text-amber-700 font-bold uppercase text-xs tracking-wider mb-2">Acompañamiento Diario</div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">Oraciones del Alba</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              Empieza cada día con propósito. Recibe inspiración y calma directamente en tu bandeja de entrada antes de que comience el ruido de la jornada.
            </p>
            
            <div className="flex items-baseline gap-2 mb-8 flex-wrap">
              <span className="text-4xl font-bold text-slate-900">$2.990</span>
              <span className="text-sm font-medium text-slate-500">CLP / mes</span>
              <span className="text-xs text-slate-400 font-normal ml-1">(aprox. $3.15 USD)</span>
            </div>

            {/* Lista de Beneficios */}
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Un Salmo, reflexión original y oración guiada a las 7:00 AM.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Inclusión de tus intenciones en nuestras oraciones comunitarias semanales.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Cancela en cualquier momento con un solo clic, sin contratos.
              </li>
            </ul>

            <button 
              onClick={() => handleOpenCheckout({
                id: 'suscripcion_alba',
                title: 'Oraciones del Alba',
                subtitle: 'Suscripción devocional diaria a las 7:00 AM',
                priceDisplay: '$2.990 CLP / mes',
                type: 'suscripcion',
                amount: 2990,
                currency: 'CLP',
              })}
              className="w-full bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-md"
            >
              Suscribirme Ahora
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Cobro mensual transparente. Mercado Pago y Webpay.</p>
          </div>

          {/* PRODUCTO 2: Libro Digital */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-stone-100 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
              DEVOCIONAL COMPLETO
            </div>
            <div className="text-slate-900 font-bold uppercase text-xs tracking-wider mb-2">Libro Digital (PDF)</div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">30 días con los Salmos</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              Un devocional para comenzar cada mañana con calma, reflexión y oración. Diseñado para leerse en 10 minutos al día y encontrar fortaleza en los momentos difíciles.
            </p>
            
            <div className="flex items-baseline gap-2 mb-8 flex-wrap">
              <span className="text-4xl font-bold text-slate-900">$4.990</span>
              <span className="text-sm font-medium text-slate-500">CLP / pago único</span>
              <span className="text-xs text-slate-400 font-normal ml-1">(aprox. $5.25 USD)</span>
            </div>

            {/* Lista de Beneficios */}
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Descarga inmediata a tu celular, tablet o computadora.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                30 lecturas bíblicas, 30 reflexiones originales y 30 oraciones guiadas.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Diagramación limpia y cómoda para lectura en pantallas.
              </li>
            </ul>

            <button 
              onClick={() => handleOpenCheckout({
                id: 'devocional_30d',
                title: '30 días con los Salmos',
                subtitle: 'Devocional digital en PDF con 30 reflexiones de paz',
                priceDisplay: '$4.990 CLP único pago',
                type: 'devocional',
                amount: 4990,
                currency: 'CLP',
              })}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-md"
            >
              Comprar y Descargar
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Recibirás el acceso en tu correo de inmediato.</p>
          </div>

        </div>
      </section>

      {/* 4. SEÑALES DE CONFIANZA */}
      <section className="max-w-4xl mx-auto px-5 mt-16 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-8 border-y border-stone-200">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Pago 100% Seguro</p>
              <p className="text-xs text-slate-500">Transacciones encriptadas vía Mercado Pago y Webpay</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-10 bg-stone-200"></div>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Entrega Inmediata</p>
              <p className="text-xs text-slate-500">Descarga directa y respaldo a tu correo</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES */}
      <section className="max-w-3xl mx-auto px-5 mt-20">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">¿Cómo recibo el devocional?</h4>
            <p className="text-slate-600 text-sm">Al confirmar el pago podrás descargarlo de inmediato en tu pantalla y además te enviaremos una copia a tu correo para que lo tengas guardado para siempre.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">¿Qué medios de pago aceptan?</h4>
            <p className="text-slate-600 text-sm">Aceptamos tarjetas de débito (Redcompra / CuentaRUT), tarjetas de crédito nacionales e internacionales a través de Mercado Pago y Webpay.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">¿Puedo cancelar la suscripción mensual?</h4>
            <p className="text-slate-600 text-sm">Sí, sin compromisos. Cada correo que recibes incluye un botón para cancelar o pausar el envío en cualquier momento con un solo clic.</p>
          </div>
        </div>
      </section>

      {/* Modal interactivo de checkout */}
      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
      />

    </main>
  );
}