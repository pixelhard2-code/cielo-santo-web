'use client';

import { useState } from 'react';

export default function AmenButton({ initialCount }: { initialCount: number | null }) {
  const [count, setCount] = useState(initialCount);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState('');

  async function recordAmen() {
    if (clicked || count === null) return;
    setError('');
    try {
      const response = await fetch('/api/amen', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos registrar tu Amén.');
      setCount(data.count);
      setClicked(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No pudimos registrar tu Amén.');
    }
  }

  return <div className="flex flex-col items-center gap-1">
    <button
      onClick={recordAmen}
      disabled={clicked || count === null}
      aria-label={count === null ? 'Contador comunitario no disponible' : `Decir Amén. ${count} personas hoy`}
      className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-60 ${clicked ? 'bg-stone-200 text-stone-900' : 'bg-[#1c1917] hover:bg-stone-800 text-white shadow-sm'}`}
    >
      <svg aria-hidden="true" className="w-3.5 h-3.5 text-amber-300 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
      <span>{count === null ? 'Amén' : `Decir Amén (${count})`}</span>
    </button>
    {error && <span role="alert" className="text-[11px] text-rose-800">{error}</span>}
  </div>;
}
