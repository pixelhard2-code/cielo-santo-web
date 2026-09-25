"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <header className="bg-white border-b border-stone-200/90 sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-5 h-18 flex justify-between items-center">
        
        {/* Marca / Logo oficial de Cielo Santo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 text-stone-900 group shrink-0"
        >
          <Image 
            src="/logo-cielo-santo.png" 
            alt="Cielo Santo" 
            width={180} 
            height={44}
            priority
            className="h-8 md:h-9 w-auto object-contain"
          />
        </Link>

        {/* Enlaces centrales de escritorio */}
        <nav className="hidden md:flex gap-8 items-center" aria-label="Navegación principal">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors py-1 relative ${
                  isActive
                    ? "text-[#b25310] font-semibold"
                    : "text-stone-600 hover:text-stone-900 font-normal"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b25310] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Lado derecho: Buscador + Botón Unirme */}
        <div className="hidden sm:flex items-center gap-4">
          <button 
            type="button"
            className="text-stone-500 hover:text-stone-800 p-2 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Buscar oración o versículo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <Link
            href="/#muro-oracion"
            className="bg-[#b25310] hover:bg-[#99440a] active:scale-95 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
          >
            Unirme
          </Link>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
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
        <div className="md:hidden border-t border-stone-200 bg-white px-5 py-4 flex flex-col gap-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#faf5ee] text-[#b25310] font-semibold"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <Link
              href="/#muro-oracion"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#b25310] text-white text-xs font-semibold py-2.5 rounded-lg"
            >
              Unirme a la oración
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
