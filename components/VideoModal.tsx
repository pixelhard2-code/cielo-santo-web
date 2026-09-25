"use client";
import React from "react";
import Image from "next/image";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle?: string;
}

export default function VideoModal({ isOpen, onClose, videoTitle = "La Obra en Acción — Cielo Santo" }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 rounded-2xl p-4 md:p-6 shadow-2xl border border-stone-800 overflow-hidden">
        
        {/* Cabecera y botón cerrar */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2.5">
            <Image 
              src="/dove.png" 
              alt="Cielo Santo" 
              width={20} 
              height={18} 
              className="h-4 w-auto object-contain opacity-90"
            />
            <span className="font-serif font-bold text-amber-200 text-sm">Cielo Santo</span>
            <span className="text-stone-400 text-xs">· {videoTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-full hover:bg-stone-800 transition-colors"
            aria-label="Cerrar video"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Reproductor de video de YouTube */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
          <iframe
            className="w-full h-full"
            src="https://www.youtube-nocookie.com/embed/5qap5aO4i9A?autoplay=1&rel=0"
            title="Video Cielo Santo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-4 text-center">
          <p className="text-stone-300 text-xs md:text-sm">
            Cada ofrenda se convierte en alimento y consuelo para quienes más lo necesitan. Gracias por tu generosidad.
          </p>
        </div>
      </div>
    </div>
  );
}
