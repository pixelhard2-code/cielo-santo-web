"use client";

import { useState } from 'react';
import PrayerRequestForm from '@/components/PrayerRequestForm';
import PrayerCard from '@/components/PrayerCard';

const prayerWallDateFormatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Santiago',
});

export type PrayerEntry = {
  id: string;
  nombre: string;
  tiempo: string;
  peticion: string;
  apoyos: number;
};

type InitialPrayerEntry = Omit<PrayerEntry, 'tiempo'> & { created_at: string };
type WallTab = 'peticiones' | 'agradecimientos';

export default function PrayerWall({ initialPeticiones, initialAgradecimientos, available }: {
  initialPeticiones: InitialPrayerEntry[];
  initialAgradecimientos: InitialPrayerEntry[];
  available: boolean;
}) {
  const [tab, setTab] = useState<WallTab>('peticiones');
  const [peticiones, setPeticiones] = useState(() => normalize(initialPeticiones));
  const [agradecimientos, setAgradecimientos] = useState(() => normalize(initialAgradecimientos));
  const entries = tab === 'peticiones' ? peticiones : agradecimientos;
  const setEntries = tab === 'peticiones' ? setPeticiones : setAgradecimientos;

  return <section id="muro-oracion" className="py-20 px-4 max-w-5xl mx-auto w-full scroll-mt-20">
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-[#b77922]" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3"/><path d="M5.5 20v-1.5a6.5 6.5 0 0 1 13 0V20M4.5 10.5a2.5 2.5 0 0 0 0 5m15-5a2.5 2.5 0 0 1 0 5M2.5 20v-1a4 4 0 0 1 2-3.5m17 4.5v-1a4 4 0 0 0-2-3.5"/></svg>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Muro de la Comunidad</h2>
      </div>
      <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">Puedes compartir una intención o agradecimiento. Las publicaciones públicas se revisan antes de aparecer; las privadas solo se guardan para el equipo pastoral autorizado.</p>
    </header>

    <div className="flex justify-center border-b border-stone-200 mb-8" role="tablist" aria-label="Publicaciones del muro">
      <TabButton active={tab === 'peticiones'} onClick={() => setTab('peticiones')}>Peticiones de oración</TabButton>
      <TabButton active={tab === 'agradecimientos'} onClick={() => setTab('agradecimientos')}>Testimonios y gratitud</TabButton>
    </div>

    <PrayerRequestForm key={tab} tipo={tab} available={available} />
    <div className="space-y-3.5">
      {!available && <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-950">El muro está pausado mientras se configura su base de datos segura. No hemos recibido ni guardado nuevas intenciones.</p>}
      {available && entries.length === 0 && <p className="text-center text-sm text-stone-500 py-8">Todavía no hay publicaciones públicas. Puedes enviar una intención para revisión.</p>}
      {available && entries.map((entry) => <PrayerCard key={entry.id} entry={entry} onUpdate={(updated) => setEntries((current) => current.map((item) => item.id === updated.id ? updated : item))} />)}
    </div>
    <p className="text-center mt-6 text-[11px] text-stone-500">Mostramos las publicaciones públicas más recientes.</p>
  </section>;
}

function normalize(rows: InitialPrayerEntry[]): PrayerEntry[] {
  return rows.map(({ created_at, ...row }) => ({ ...row, tiempo: prayerWallDateFormatter.format(new Date(created_at)) }));
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} role="tab" aria-selected={active} className={`pb-3 px-6 text-xs sm:text-sm font-semibold transition-colors border-b-2 -mb-px ${active ? 'border-[#b25310] text-stone-900' : 'border-transparent text-stone-600 hover:text-stone-900'}`}>{children}</button>;
}
