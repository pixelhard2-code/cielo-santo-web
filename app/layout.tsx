import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cielo Santo | Oración y Fe",
  description: "Un espacio de fe, oración y esperanza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">
        {/* Barra de navegación global */}
        <nav className="bg-white border-b border-amber-100 shadow-sm py-4 px-6 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-amber-800 tracking-wide">
              CIELO SANTO
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-amber-700 transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
                Catálogo Digital
              </Link>
              <Link href="/donaciones" className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
                Donaciones
              </Link>
            </div>
          </div>
        </nav>

        {/* Contenido de cada página */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Pie de página global */}
        <footer className="bg-white text-center py-6 text-xs text-slate-400 border-t border-amber-100 mt-auto">
          <p>© Cielo Santo — Pagos 100% Encriptados y Seguros</p>
        </footer>
      </body>
    </html>
  );
}