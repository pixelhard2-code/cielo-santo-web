'use client';

import { useState, type FormEvent } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website: new FormData(event.currentTarget).get('website') }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No pudimos iniciar la suscripción.');
      setSuccess(true);
      setMessage('Te enviamos un correo para confirmar tu dirección. Revisa también la carpeta de correo no deseado.');
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : 'No pudimos iniciar la suscripción.');
    } finally {
      setLoading(false);
    }
  }

  if (success) return <p role="status" className="bg-white p-3.5 rounded-lg border border-stone-300 text-stone-800 text-xs max-w-md mx-auto">{message}</p>;

  return <form onSubmit={subscribe} className="flex flex-col gap-3 max-w-md mx-auto">
      <label className="hidden" aria-hidden="true">No rellenar<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="sr-only" htmlFor="daily-email">Tu correo electrónico</label>
    <input
      id="daily-email"
      type="email"
      required
      maxLength={254}
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      placeholder="Tu correo electrónico..."
      className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#b25310] shadow-sm"
    />
    <label className="flex items-start gap-2 text-left text-[11px] leading-relaxed text-stone-600">
      <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5" />
      <span>Acepto recibir por correo una oración y reflexión diaria de Cielo Santo. Puedo darme de baja desde cualquier correo.</span>
    </label>
    <button type="submit" disabled={loading} className="bg-[#9e4a06] hover:bg-[#853e05] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-60">
      {loading ? 'Enviando confirmación…' : 'Confirmar mi correo diario'}
    </button>
    {message && <p role="alert" className="text-xs text-rose-800">{message}</p>}
  </form>;
}
