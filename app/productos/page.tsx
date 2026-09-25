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

    const guiaTexto = `CIELO SANTO · GUÍA DE BOLSILLO: SIETE SALMOS PARA LA INQUIETUD Y EL DESCANSO
========================================================================
Esta pequeña selección de lecturas bíblicas fue preparada para acompañar
tus noches de desvelo y aquellos momentos donde la mente se llena de afán.

1. SALMO 27:1 — "EL SEÑOR ES MI LUZ Y MI SALVACIÓN"
¿De quién temeré? Cuando la incertidumbre toque tu puerta, recuerda quién sostiene tu vida.

2. SALMO 4:8 — "EN PAZ ME ACOSTARÉ Y ASIMISMO DORMIRÉ"
Porque solo tú, Señor, me haces vivir confiado. Suelta la necesidad de controlar todo lo que ocurrirá mañana.

3. SALMO 23:1-2 — "EL SEÑOR ES MI PASTOR; NADA ME FALTARÁ"
En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.

4. SALMO 46:1 — "DIOS ES NUESTRO AMPARO Y FORTALEZA"
Nuestro pronto auxilio en las tribulaciones. Guarda silencio por unos minutos y reconoce su presencia.

5. SALMO 91:1-2 — "EL QUE HABITA AL ABRIGO DEL ALTÍSIMO"
Morará bajo la sombra del Omnipotente. Diré yo del Señor: Esperanza mía y castillo mío; mi Dios, en quien confiaré.

6. SALMO 121:2-3 — "MI SOCORRO VIENE DEL SEÑOR"
No dará tu pie al resbaladero, ni se dormirá el que te guarda. El Señor te guarda de todo mal.

7. SALMO 55:22 — "ECHA SOBRE EL SEÑOR TU CARGA"
Y Él te sustentará; no dejará para siempre caído al justo. Respira profundo y entrega tus pensamientos.
========================================================================
Cielo Santo · www.cielosanto.com · Oraciones y reflexiones diarias en YouTube: @cielosanto20`;

    const blob = new Blob([guiaTexto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Siete-Salmos-Para-El-Descanso-CieloSanto.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFreeGuideDownloaded(true);
  };

  return (
    <main className="min-h-screen pb-20">
      
      {/* 1. ENCABEZADO */}
      <section className="bg-stone-900 text-stone-100 py-20 px-5 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-serif italic text-amber-300 text-base mb-2">Lectura y meditación</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-5 leading-tight">
            Devocionales para acompañar tu día
          </h1>
          <p className="text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Textos y oraciones preparadas con dedicación para ordenar el pensamiento antes de iniciar la jornada o al terminar la noche.
          </p>
        </div>
      </section>

      {/* 2. GUÍA DE BOLSILLO SIN COSTO */}
      <section className="max-w-4xl mx-auto px-5 -mt-8 relative z-20 mb-14">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
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

          <div className="w-full md:w-auto shrink-0">
            {!freeGuideDownloaded ? (
              <form onSubmit={handleDownloadFreeGuide} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={freeGuideEmail}
                  onChange={(e) => setFreeGuideEmail(e.target.value)}
                  placeholder="Tu correo electrónico..."
                  className="px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:ring-1 focus:ring-stone-800"
                />
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-colors shrink-0"
                >
                  Descargar lectura
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 text-emerald-900 px-4 py-2.5 rounded-lg border border-emerald-200 text-xs text-center">
                Descarga iniciada. Esperamos que acompañe tu descanso esta noche.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. MATERIALES DE ACOMPAÑAMIENTO */}
      <section className="max-w-5xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-7">
          
          {/* PRODUCTO 1: Suscripción Devocional */}
          <div className="bg-white rounded-xl p-7 sm:p-9 border border-stone-200 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-stone-500 mb-1">Acompañamiento matutino por correo</p>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">Oraciones del Alba</h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Cada amanecer a las 7:00 AM recibirás una reflexión pausada, el Salmo del día y una oración guiada en tu bandeja de entrada antes de que comience el ruido de la jornada.
              </p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-serif font-bold text-stone-900">$2.990</span>
                <span className="text-xs text-stone-500">CLP / mes</span>
                <span className="text-xs text-stone-400 font-normal ml-1">(aprox. $3 USD)</span>
              </div>

              <ul className="space-y-3 mb-8 text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-800 font-bold">·</span>
                  <span>Lectura del día y meditación breve directamente en tu correo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-800 font-bold">·</span>
                  <span>Inclusión de tus intenciones personales en la oración comunitaria.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-800 font-bold">·</span>
                  <span>Suscripción voluntaria; puedes cancelar en cualquier momento con un clic.</span>
                </li>
              </ul>
            </div>

            <div>
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
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 px-5 rounded-lg transition-colors text-sm"
              >
                Suscribirme al envío diario
              </button>
              <p className="text-center text-[11px] text-stone-600 mt-2.5">Pago procesado mediante Mercado Pago y Webpay.</p>
            </div>
          </div>

          {/* PRODUCTO 2: Libro Digital de Salmos */}
          <div className="bg-white rounded-xl p-7 sm:p-9 border border-stone-200 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-stone-500 mb-1">Edición digital en formato PDF</p>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">30 días con los Salmos</h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Un libro pensado para leer diez minutos cada día. Contiene treinta Salmos seleccionados, explicaciones sencillas de su contexto y oraciones para cerrar el momento de lectura.
              </p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-serif font-bold text-stone-900">$4.990</span>
                <span className="text-xs text-stone-500">CLP / pago único</span>
                <span className="text-xs text-stone-400 font-normal ml-1">(aprox. $5.20 USD)</span>
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
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-5 rounded-lg transition-colors text-sm"
              >
                Comprar libro digital
              </button>
              <p className="text-center text-[11px] text-stone-600 mt-2.5">Disponible inmediatamente tras confirmar el aporte.</p>
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
              Al finalizar el proceso verás un enlace de descarga directa en pantalla. Además, nuestro sistema te enviará automáticamente un correo con el archivo adjunto para que lo conserves siempre.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm mb-1.5">¿Qué medios de pago están disponibles?</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              En Chile puedes pagar con CuentaRUT, tarjetas de débito Redcompra y tarjetas de crédito mediante Mercado Pago y Webpay.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200">
            <h3 className="font-semibold text-stone-900 text-sm mb-1.5">¿Cómo se cancela la suscripción mensual si ya no deseo recibirla?</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Cada correo electrónico incluye un enlace al pie para cancelar la suscripción en un solo paso. También puedes escribirnos a contacto@cielosanto.com y la cancelaremos de inmediato.
            </p>
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