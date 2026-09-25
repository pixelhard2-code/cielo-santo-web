'use client';

import { useState, type ReactNode } from 'react';
import CheckoutModal, { type ModalItem } from '@/components/CheckoutModal';

export default function CheckoutButton({ item, children, className }: {
  item: ModalItem;
  children: ReactNode;
  className: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setIsOpen(true)} className={className}>{children}</button>
    <CheckoutModal isOpen={isOpen} onClose={() => setIsOpen(false)} item={item} />
  </>;
}
