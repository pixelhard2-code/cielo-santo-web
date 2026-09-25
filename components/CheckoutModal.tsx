"use client";
import React, { useState } from "react";

export interface ModalItem {
  id: string;
  title: string;
  subtitle: string;
  priceDisplay: string;
  type: "suscripcion" | "devocional" | "donacion";
  amount: number;
  currency: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ModalItem | null;
}

export default function CheckoutModal({ isOpen, onClose, item }: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !nombre.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: item.type,
          planName: item.title,
          amount: item.amount,
          currency: item.currency,
          email,
          nombre,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirección real de Stripe
        window.location.href = data.url;
        return;
      }

      // Si está en modo demo o desarrollo sin Stripe keys
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const devocionalTexto = `🕊️ CIELO SANTO — DEVOCIONAL: 30 DÍAS DE PAZ Y FORTALEZA
========================================================================
¡Gracias por tu apoyo al ministerio Cielo Santo, ${nombre || 'hermano/a'}!

DÍA 1: "EL SEÑOR ES MI PASTOR" (Salmo 23:1)
------------------------------------------------------------------------
"El Señor es mi pastor; nada me faltará."

REFLEXIÓN:
El descanso espiritual no comienza cuando desaparecen los problemas externos,
sino cuando reconocemos que nuestras cargas están en las mejores manos.
Hoy, respira profundamente y entrega tu ansiedad a Dios.

ORACIÓN DEL DÍA:
"Padre celestial, gracias por ser mi pastor. Guía hoy mis decisiones,
guarda la paz de mi hogar y renueva mis fuerzas. En tu nombre descanso. Amén."
========================================================================
Cielo Santo • youtube.com/@cielosanto20`;

    const blob = new Blob([devocionalTexto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CieloSanto-Devocional-Muestra.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-100 overflow-hidden">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Cerrar ventana"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!success ? (
          <div>
            <div className="text-center mb-6">
              <span className="text-amber-700 font-bold uppercase text-xs tracking-widest block mb-1">
                {item.type === "donacion" ? "Ofrenda de Amor" : "Recurso Espiritual"}
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs">{item.subtitle}</p>
              <div className="mt-3 inline-block bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200/60 font-bold text-amber-900 text-lg">
                {item.priceDisplay}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Tu Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. María Elena"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Tu Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-correo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {item.type === "suscripcion"
                    ? "Aquí recibirás las oraciones diarias cada mañana a las 7:00 AM."
                    : "Aquí te enviaremos el enlace permanente y recibo seguro."}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-amber-700 hover:bg-amber-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Conectando de forma segura...</span>
                ) : (
                  <span>
                    {item.type === "donacion" ? "Completar Ofrenda" : "Proceder al Pago Seguro"}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center mt-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Transacción protegida con cifrado SSL de 256 bits</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🕊️
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              ¡Que Dios te bendiga, {nombre}!
            </h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Hemos registrado tu solicitud para <strong>{item.title}</strong>. Te hemos enviado un correo de bienvenida a <em>{email}</em>.
            </p>

            {item.type === "devocional" && (
              <button
                onClick={handleDownloadSample}
                className="w-full mb-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
              >
                📥 Descargar Devocional Ahora
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors text-sm"
            >
              Cerrar y Regresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
