'use client';

import { useState, type FormEvent } from 'react';

export default function PrayerRequestForm({ tipo, available }: {
  tipo: 'peticiones' | 'agradecimientos';
  available: boolean;
}) {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [privacidad, setPrivacidad] = useState<'publica' | 'privada'>('publica');
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || enviando) return;
    const form = event.currentTarget;
    const website = new FormData(form).get('website');
    setEnviando(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/peticiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, peticion: mensaje, esPrivada: privacidad === 'privada',
          tipo: tipo === 'agradecimientos' ? 'agradecimiento' : 'peticion', website,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No pudimos recibir tu mensaje.');
      setFeedback({
        success: true,
        text: privacidad === 'privada'
          ? 'Tu intención privada fue recibida y quedó pendiente de revisión pastoral.'
          : 'Tu mensaje fue recibido y quedó pendiente de revisión antes de publicarse.',
      });
      setNombre('');
      setMensaje('');
      setPrivacidad('publica');
      form.reset();
    } catch (error) {
      setFeedback({ success: false, text: error instanceof Error ? error.message : 'No pudimos recibir tu mensaje.' });
    } finally {
      setEnviando(false);
    }
  }

  return <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 mb-8 shadow-sm">
    <div className="flex items-center gap-2 mb-1">
      <svg aria-hidden="true" className="w-4 h-4 text-[#b25310]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      <h3 className="font-semibold text-stone-900 text-sm sm:text-base">{tipo === 'peticiones' ? 'Comparte una intención de oración' : 'Comparte tu testimonio o gratitud'}</h3>
    </div>
    <p className="text-stone-500 text-xs mb-5">Las intenciones privadas no aparecen en el muro y se eliminan después de 90 días. Evita incluir información médica sensible o datos de otras personas.</p>

    <form onSubmit={submit} className="space-y-4">
      <label className="hidden" aria-hidden="true">No rellenar<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="prayer-name" className="block text-xs text-stone-600 mb-1">Tu nombre o solo la inicial</label>
          <input id="prayer-name" type="text" required value={nombre} onChange={(event) => setNombre(event.target.value)}
            placeholder="Ejemplo: Carmen S. o Roberto" maxLength={80} disabled={!available}
            className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310] disabled:bg-stone-100" />
        </div>
        <fieldset disabled={!available}>
          <legend className="block text-xs text-stone-600 mb-1">Visibilidad de tu mensaje</legend>
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-xs min-h-[42px]">
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="privacy" value="publica" checked={privacidad === 'publica'} onChange={() => setPrivacidad('publica')} /><span>Visible tras revisión</span></label>
            <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="privacy" value="privada" checked={privacidad === 'privada'} onChange={() => setPrivacidad('privada')} /><span>Solo equipo pastoral</span></label>
          </div>
        </fieldset>
      </div>
      <div>
        <label htmlFor="prayer-message" className="block text-xs text-stone-600 mb-1">{tipo === 'peticiones' ? 'Mensaje o motivo de oración' : 'Relato o motivo de gratitud'}</label>
        <textarea id="prayer-message" rows={3} required value={mensaje} onChange={(event) => setMensaje(event.target.value)}
          placeholder="Escribe con sencillez lo que llevas en el corazón..." maxLength={500} disabled={!available}
          className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310] disabled:bg-stone-100" />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <p className="max-w-lg text-[11px] text-stone-500">Los mensajes públicos se revisan antes de aparecer en el muro.</p>
        <button type="submit" disabled={enviando || !available} className="bg-[#9e4a06] hover:bg-[#853e05] disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors shrink-0 shadow-sm">
          {enviando ? 'Enviando…' : tipo === 'agradecimientos' ? 'Enviar agradecimiento' : 'Enviar intención'}
        </button>
      </div>
      {feedback && <p role={feedback.success ? 'status' : 'alert'} className={`${feedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'} border px-4 py-2.5 rounded-lg text-xs`}>{feedback.text}</p>}
    </form>
  </div>;
}
