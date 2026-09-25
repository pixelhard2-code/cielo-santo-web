"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Devocionales" },
    { href: "/donaciones", label: "Sostén y Misión" },
    { href: "/nosotros", label: "Sobre Nosotros" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-5xl mx-auto px-5 h-16 flex justify-between items-center">
        {/* Marca / Logo sobrio y elegante */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-stone-900 group"
        >
          <svg 
            className="w-5 h-5 text-amber-800 transition-transform duration-300 group-hover:scale-105" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Paloma / Símbolo de paz y fe estilizado */}
            <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V11c-3.3 0-6 2.7-6 6v1h16v-1c0-3.3-2.7-6-6-6V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4z" />
            <path d="M12 11v6" />
          </svg>
          <span className="font-serif tracking-widest text-base font-semibold text-stone-900 uppercase">
            Cielo Santo
          </span>
        </Link>

        {/* Enlaces de escritorio */}
        <nav className="hidden sm:flex gap-7 items-center" aria-label="Navegación principal">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors py-1 ${
                  isActive
                    ? "text-amber-900 font-semibold border-b-2 border-amber-800"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Botón menú móvil accesible */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-white px-5 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-stone-100 text-amber-950 font-semibold"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
