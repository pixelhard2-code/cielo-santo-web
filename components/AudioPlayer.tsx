"use client";
import React, { useState, useRef, useEffect } from "react";

interface AudioTrack {
  id: string;
  title: string;
  duration: string;
  description: string;
  category: "despertar" | "noche" | "calma";
  // Usamos fuentes de audio relajante libres de derechos o sintetizador de armónicos de paz
  audioSrc?: string;
}

const tracks: AudioTrack[] = [
  {
    id: "salmo-23-paz",
    title: "Salmo 23 • Descanso en Pastos Delicados",
    duration: "3:30",
    description: "Música suave de cuerdas y arpa con meditación guiada de serenidad.",
    category: "despertar",
    // Audio royalty-free de piano relajante
    audioSrc: "https://actions.google.com/sounds/v1/ambiences/outdoor_water_gentle.ogg",
  },
  {
    id: "oracion-noche-insomnio",
    title: "Oración Nocturna • Soltar las Cargas y Dormir",
    duration: "8:15",
    description: "Tonos armónicos para calmar la mente y conciliar el sueño en paz.",
    category: "noche",
    audioSrc: "https://actions.google.com/sounds/v1/weather/light_rain.ogg",
  },
  {
    id: "salmo-91-amparo",
    title: "Salmo 91 • El Manto del Altísimo",
    duration: "4:20",
    description: "Oración de fortaleza y amparo familiar para iniciar la jornada.",
    category: "calma",
    audioSrc: "https://actions.google.com/sounds/v1/ambiences/daybreak.ogg",
  },
];

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full px-4 sm:px-0">
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Tarjeta Expandida */}
      {isExpanded && (
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-5 shadow-2xl border border-amber-500/30 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🎧</span>
              <span>Audio de Paz y Meditación</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              aria-label="Minimizar reproductor"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Lista de pistas */}
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => selectTrack(idx)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 ${
                  currentTrackIndex === idx
                    ? "bg-amber-700/40 border border-amber-500/40 text-amber-200"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <span className="text-sm mt-0.5">
                  {currentTrackIndex === idx && isPlaying ? "🔊" : "▶"}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold leading-tight">{t.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.duration} • {t.description}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 text-center italic">
            Sonidos ambientales para acompañar tu momento de oración o conciliar el sueño.
          </p>
        </div>
      )}

      {/* Barra Compacta Flotante */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-amber-500/40 flex items-center justify-between gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-md transition-all"
          aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-amber-400">
              {isPlaying ? "Reproduciendo" : "Pausa"}
            </span>
            <span className="text-slate-400 text-[10px]">• Toca para lista</span>
          </div>
          <p className="text-xs font-medium truncate text-slate-200">
            {currentTrack.title}
          </p>
          {/* Barra de progreso */}
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Ver pistas"
        >
          <svg className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

    </div>
  );
}
