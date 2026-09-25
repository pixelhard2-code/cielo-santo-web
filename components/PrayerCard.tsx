'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PrayerEntry } from '@/components/PrayerWall';

export default function PrayerCard({ entry, onUpdate }: {
  entry: PrayerEntry;
  onUpdate: (entry: PrayerEntry) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [reported, setReported] = useState(false);

  async function report() {
    if (!window.confirm('¿Deseas enviar esta publicación al equipo de moderación?')) return;
    try {
      const result = await updateWall({ action: 'report', id: entry.id });
      if (!result.ok) throw new Error(result.error || 'No pudimos enviar el reporte.');
      setReported(true);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No pudimos enviar el reporte.');
    }
  }

  async function support() {
    if (supported) return;
    try {
      const result = await updateWall({ action: 'support', id: entry.id });
      if (!result.ok) throw new Error(result.error || 'No pudimos registrar tu apoyo.');
      onUpdate({ ...entry, apoyos: result.apoyos ?? entry.apoyos });
      setSupported(true);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No pudimos registrar tu apoyo.');
    }
  }

  return <article className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-sm flex flex-col gap-2.5">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 relative bg-stone-100 border border-stone-200">
          <Image src="/avatar-placeholder.png" alt="" width={36} height={36} className="w-full h-full object-cover" />
        </div>
        <div><span className="font-bold text-stone-900 text-xs sm:text-sm">{entry.nombre}</span><span className="text-[11px] text-stone-600 ml-2">· {entry.tiempo}</span></div>
      </div>
      <button onClick={() => void report()} disabled={reported} aria-label={`Reportar publicación de ${entry.nombre}`} className="text-[11px] text-stone-600 hover:text-rose-600 transition-colors">{reported ? 'Reportado' : 'Reportar'}</button>
    </div>
    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed pl-12">{entry.peticion}</p>
    <div className="flex items-center justify-between pt-2 border-t border-stone-100 pl-12 text-xs">
      <button onClick={() => void support()} disabled={supported} aria-pressed={supported} className={`inline-flex items-center gap-1.5 transition-colors ${supported ? 'text-[#b25310] font-semibold' : 'text-stone-600 hover:text-stone-900'}`}>
        <svg aria-hidden="true" className={`w-3.5 h-3.5 ${supported ? 'fill-current text-[#b25310]' : 'text-stone-400'}`} fill={supported ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        <span>Unirme en oración ({entry.apoyos})</span>
      </button>
      <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Intención de oración en Cielo Santo por ${entry.nombre}:\n"${entry.peticion}"\n\nhttps://cielosanto.com/#muro-oracion`)}`} target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-emerald-800 transition-colors inline-flex items-center gap-1.5 text-xs">
        <Image src="/whatsapp.svg" alt="" width={14} height={14} className="w-3.5 h-3.5 object-contain" /><span>Compartir en WhatsApp</span>
      </a>
    </div>
  </article>;
}

async function updateWall(body: { action: 'report' | 'support'; id: string }): Promise<{ ok: boolean; error?: string; apoyos?: number }> {
  const response = await fetch('/api/peticiones', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json() as { error?: string; apoyos?: number; alreadySupported?: boolean };
  return { ok: response.ok, error: data.error, apoyos: data.apoyos };
}
