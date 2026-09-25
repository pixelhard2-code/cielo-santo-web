'use client';

import { useState, type FormEvent } from 'react';
import CheckoutModal, { type ModalItem } from '@/components/CheckoutModal';

export default function CustomDonationForm() {
  const [amountInput, setAmountInput] = useState('');
  const [item, setItem] = useState<ModalItem | null>(null);
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(amountInput);
    if (!Number.isInteger(amount) || amount < 1000 || amount > 2_000_000) {
      setError('Ingresa un aporte entre $1.000 y $2.000.000 CLP.');
      return;
    }
    setError('');
    setItem({
      id: 'aporte', title: 'Aporte voluntario a Cielo Santo',
      subtitle: 'Colaboración para sostener el espacio de oración',
      priceDisplay: `$${amount.toLocaleString('es-CL')} CLP`,
      type: 'donacion', amount, currency: 'CLP',
    });
  }

  return <>
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 justify-center">
      <label htmlFor="custom-donation" className="sr-only">Monto del aporte en pesos chilenos</label>
      <input id="custom-donation" type="number" min="1000" max="2000000" step="1" required value={amountInput}
        onChange={(event) => setAmountInput(event.target.value)} placeholder="Monto en CLP (ej. 5000)"
        className="px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 w-full sm:w-52 focus:ring-1 focus:ring-stone-800" />
      <button type="submit" className="bg-stone-900 hover:bg-stone-800 text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors">Continuar</button>
    </form>
    {error && <p role="alert" className="mt-2 text-xs text-rose-800">{error}</p>}
    <CheckoutModal isOpen={Boolean(item)} onClose={() => setItem(null)} item={item} />
  </>;
}
