'use client';

import { useState, type FormEvent } from 'react';

export default function LeadMagnetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  async function requestBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: new FormData(event.currentTarget).get('website') }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'No pudimos enviar el libro. Inténtalo nuevamente.');
      setSent(true);
      setMessage('Te enviamos el enlace de descarga. Revisa tu correo y también la carpeta de correo no deseado.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos enviar el libro. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) return <p role="status" className="max-w-sm text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">{message}</p>;

  return <form onSubmit={requestBook} className="w-full md:w-64 shrink-0 flex flex-col gap-2.5">
    <label className="sr-only" htmlFor="book-email">Tu correo electrónico</label>
    <input id="book-email" type="email" required maxLength={254} autoComplete="email" value={email}
      onChange={(event) => setEmail(event.target.value)} placeholder="Tu correo electrónico"
      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310]" />
    <label className="hidden" aria-hidden="true">No rellenar<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    <p className="text-[11px] text-stone-500 leading-relaxed">Usaremos tu correo solo para enviarte el libro. No te suscribe a mensajes diarios. Consulta nuestra <a href="/privacidad" className="underline">política de privacidad</a>.</p>
    <button type="submit" disabled={loading} className="inline-flex justify-center bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-medium py-3 px-5 rounded-lg text-sm transition-colors">
      {loading ? 'Enviando…' : 'Enviar libro gratis'}
    </button>
    {message && <p role="alert" className="text-xs text-rose-800">{message}</p>}
  </form>;
}
