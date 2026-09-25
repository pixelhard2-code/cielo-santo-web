"use client";
import React from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle?: string;
}

export default function VideoModal({ isOpen, onClose, videoTitle = "La Obra en Acción — Cielo Santo" }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Cabecera y botón cerrar */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">🕊️ Cielo Santo</span>
            <span className="text-slate-400 text-xs">• {videoTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Cerrar video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Reproductor de video de YouTube */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=1&rel=0"
            title="Video Cielo Santo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-4 text-center">
          <p className="text-slate-300 text-xs md:text-sm">
            Cada ofrenda se convierte en alimento y luz para quienes más lo necesitan. Gracias por tu generosidad.
          </p>
        </div>
      </div>
    </div>
  );
}
