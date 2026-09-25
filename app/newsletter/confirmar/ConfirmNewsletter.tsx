'use client';

import { useState } from 'react';

export default function ConfirmNewsletter({ token }: { token: string }) {
  const [message, setMessage] = useState('Confirma tu correo para empezar a recibir una oración y reflexión cada mañana.');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No pudimos confirmar el correo.');
      setConfirmed(true);
      setMessage('Tu correo quedó confirmado. Recibirás una oración y reflexión cada mañana.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos confirmar el correo.');
    } finally {
      setLoading(false);
    }
  }

  return <section className="max-w-xl mx-auto my-24 px-6 text-center">
    <h1 className="font-serif text-3xl font-bold text-stone-900 mb-4">{confirmed ? 'Gracias por sumarte' : 'Confirma tu suscripción'}</h1>
    <p className="text-stone-600 mb-7">{message}</p>
    {!confirmed && <button onClick={confirm} disabled={loading || !token} className="bg-stone-900 text-white rounded-lg px-6 py-3 disabled:opacity-50">
      {loading ? 'Confirmando…' : 'Confirmar mi correo'}
    </button>}
  </section>;
}
