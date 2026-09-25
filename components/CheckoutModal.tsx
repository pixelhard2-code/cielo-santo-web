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
  const [error, setError] = useState("");

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !nombre.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: item.id,
          amount: item.amount,
          email,
          nombre,
        }),
      });

      const data = await res.json();
      if (!res.ok || typeof data.url !== "string") {
        throw new Error(data.error || "No se pudo iniciar el pago. No se ha realizado ningún cobro.");
      }
      window.location.assign(data.url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo iniciar el pago.");
    } finally {
      setLoading(false);
    }
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
                    ? "Recibirás una oración y reflexión diaria. Podrás administrar o cancelar tu suscripción desde el correo de bienvenida."
                    : item.type === "devocional"
                      ? "Te enviaremos un enlace privado de descarga después de confirmar el pago."
                      : "Usaremos tu correo para el recibo de la pasarela de pago."}
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
                    {item.type === "donacion" ? "Continuar al pago seguro" : "Continuar al pago seguro"}
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center mt-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>El pago se procesa en la pasarela segura seleccionada.</span>
              </div>
              {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900">{error}</p>}
            </form>
        </div>
      </div>
    </div>
  );
}
