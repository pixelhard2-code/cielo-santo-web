import React from 'react';
import Link from 'next/link';

export default function Productos() {
  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      
      {/* 1. ENCABEZADO DEL CATÁLOGO */}
      <section className="bg-slate-900 text-white py-20 px-5 text-center relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-4 block">Material Exclusivo</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Recursos para fortalecer tu fe</h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto">
            Herramientas diseñadas cuidadosamente para acompañarte en tu rutina diaria. 
            Al adquirir este material, no solo inviertes en tu paz mental, sino que apoyas directamente el crecimiento de Cielo Santo.
          </p>
        </div>
      </section>

      {/* 2. TARJETAS DE PRODUCTOS (Optimizadas para conversión) */}
      <section className="max-w-5xl mx-auto px-5 -mt-10 relative z-20">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* PRODUCTO 1: Suscripción */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-stone-100 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="text-amber-700 font-bold uppercase text-xs tracking-wider mb-2">Suscripción Mensual</div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">Oraciones del Alba</h3>
            <p className="text-slate-600 mb-6 text-sm">
              Empieza cada día con propósito. Recibe inspiración directamente en tu bandeja de entrada antes de que comience el ruido del mundo.
            </p>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-slate-900">$2.990</span>
              <span className="text-sm font-medium text-slate-500">CLP / mes</span>
            </div>

            {/* Lista de Beneficios */}
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Un Salmo y una reflexión profunda todos los días a las 7:00 AM.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Inclusión de tu nombre en nuestras oraciones comunitarias semanales.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Cancela en cualquier momento con un solo clic.
              </li>
            </ul>

            <button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-lg py-4 px-6 rounded-xl transition-colors shadow-md">
              Suscribirme Ahora
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Cobro automático mensual. Seguro y encriptado.</p>
          </div>

          {/* PRODUCTO 2: Libro Digital */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-stone-100 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
              MÁS VENDIDO
            </div>
            <div className="text-slate-900 font-bold uppercase text-xs tracking-wider mb-2">Libro Digital (PDF)</div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">Devocional: 30 Días</h3>
            <p className="text-slate-600 mb-6 text-sm">
              Una guía completa para transformar tu mentalidad. Diseñada para leerse en 10 minutos al día y encontrar fortaleza en los momentos difíciles.
            </p>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-slate-900">$4.990</span>
              <span className="text-sm font-medium text-slate-500">CLP / único pago</span>
            </div>

            {/* Lista de Beneficios */}
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Descarga inmediata a tu celular, tablet o computadora.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                30 reflexiones guiadas basadas en los Salmos más poderosos.
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Formato especial optimizado para lectura cómoda en pantallas.
              </li>
            </ul>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 px-6 rounded-xl transition-colors shadow-md">
              Comprar y Descargar
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Recibirás el acceso en tu correo al instante.</p>
          </div>

        </div>
      </section>

      {/* 3. SEÑALES DE CONFIANZA */}
      <section className="max-w-4xl mx-auto px-5 mt-16 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-8 border-y border-stone-200">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Pago 100% Seguro</p>
              <p className="text-xs text-slate-500">Transacciones encriptadas</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-10 bg-stone-200"></div>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <div className="text-left">
              <p className="font-bold text-slate-900 text-sm">Entrega Inmediata</p>
              <p className="text-xs text-slate-500">Directo a tu correo</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREGUNTAS FRECUENTES (Resuelve dudas y aumenta ventas) */}
      <section className="max-w-3xl mx-auto px-5 mt-20">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">¿Cómo recibo el Libro Digital?</h4>
            <p className="text-slate-600 text-sm">Una vez completado el pago, serás redirigido a la página de descarga y además te enviaremos un correo electrónico con el archivo PDF para que lo guardes para siempre.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">¿Es seguro ingresar mi tarjeta?</h4>
            <p className="text-slate-600 text-sm">Totalmente. Utilizamos pasarelas de pago globales que encriptan tus datos bancarios. Nosotros nunca vemos ni guardamos los números de tu tarjeta.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">¿Puedo cancelar la suscripción mensual?</h4>
            <p className="text-slate-600 text-sm">Sí, sin compromisos ni contratos. Cada correo que recibes incluye un enlace directo al final para pausar o cancelar tu suscripción con un solo clic.</p>
          </div>
        </div>
      </section>

    </main>
  );
}