"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Recursos" },
    { href: "/donaciones", label: "Sostener y Obras" },
    { href: "/nosotros", label: "Nosotros" },
  ];

  return (
    <nav className="bg-white border-b border-amber-100 shadow-sm py-4 px-6 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Marca / Logo */}
        <Link 
          href="/" 
          className="text-xl font-bold text-amber-800 tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>🕊️</span>
          <span>CIELO SANTO</span>
        </Link>

        {/* Enlaces de escritorio */}
        <div className="hidden sm:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-amber-800 font-bold border-b-2 border-amber-600 pb-0.5"
                    : "text-slate-600 hover:text-amber-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 focus:outline-none"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-amber-100 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-100/60 text-amber-900 font-bold"
                    : "text-slate-600 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
