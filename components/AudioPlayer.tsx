"use client";
import React, { useState, useRef, useEffect } from "react";

interface AudioTrack {
  id: string;
  title: string;
  duration: string;
  description: string;
  category: "despertar" | "noche" | "calma";
  audioSrc?: string;
}

const tracks: AudioTrack[] = [
  {
    id: "salmo-23-paz",
    title: "Salmo 23 · Pastos de reposo",
    duration: "3:30",
    description: "Cuerdas suaves y meditación matutina para serenar el pensamiento.",
    category: "despertar",
    audioSrc: "https://actions.google.com/sounds/v1/ambiences/outdoor_water_gentle.ogg",
  },
  {
    id: "oracion-noche-insomnio",
    title: "Oración de la noche · Soltar el afán",
    duration: "8:15",
    description: "Sonido de lluvia serena y tonos suaves para conciliar el sueño.",
    category: "noche",
    audioSrc: "https://actions.google.com/sounds/v1/weather/light_rain.ogg",
  },
  {
    id: "salmo-91-amparo",
    title: "Salmo 91 · Al abrigo del Altísimo",
    duration: "4:20",
    description: "Plegaria de calma y amparo para momentos de inquietud.",
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
    <aside 
      className="fixed bottom-4 right-4 z-40 max-w-sm w-full px-3 sm:px-0"
      aria-label="Reproductor de música ambiental para la oración"
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Panel Expandido */}
      {isExpanded && (
        <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 rounded-xl p-4 shadow-xl border border-stone-800 mb-2">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-800">
            <div>
              <p className="font-serif text-sm font-semibold text-stone-100">Música para la oración</p>
              <p className="text-[11px] text-stone-400">Sonido instrumental continuo para el silencio</p>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-stone-400 hover:text-stone-200 p-1 rounded-md hover:bg-stone-800 transition-colors"
              aria-label="Cerrar panel de pistas"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Lista de pistas con tipografía sobria */}
          <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
            {tracks.map((t, idx) => {
              const active = currentTrackIndex === idx;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTrack(idx)}
                  className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 ${
                    active
                      ? "bg-amber-950/70 border border-amber-800/60 text-amber-200"
                      : "hover:bg-stone-800 text-stone-300 border border-transparent"
                  }`}
                >
                  <span className="text-xs mt-0.5 text-stone-400 shrink-0">
                    {active && isPlaying ? (
                      <svg className="w-3.5 h-3.5 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v18M6 8v8M18 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-stone-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{t.title}</p>
                    <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{t.duration} · {t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-stone-500 text-center italic">
            El audio continuará sonando mientras recorres el sitio.
          </p>
        </div>
      )}

      {/* Barra Compacta Flotante */}
      <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 rounded-xl p-2.5 shadow-xl border border-stone-800 flex items-center justify-between gap-3">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-lg bg-amber-800 hover:bg-amber-700 active:scale-95 text-white flex items-center justify-center shrink-0 transition-colors"
          aria-label={isPlaying ? "Pausar música ambiental" : "Reproducir música ambiental"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 cursor-pointer min-w-0"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-stone-200 truncate">
              {currentTrack.title}
            </p>
            <span className="text-[10px] text-stone-400 shrink-0">
              {isPlaying ? "En reproducción" : "Pausado"}
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-stone-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-amber-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-stone-400 hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-800 transition-colors shrink-0"
          aria-label={isExpanded ? "Ocultar lista de audios" : "Ver lista de audios"}
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
