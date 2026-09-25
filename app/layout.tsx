import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Cielo Santo | Oración, Fe y Esperanza",
    template: "%s | Cielo Santo",
  },
  description: "Un espacio de fe, oración y esperanza. Unimos corazones a través de la oración diaria, los Salmos de paz y el apoyo mutuo.",
  openGraph: {
    title: "Cielo Santo | Un refugio de paz para tu espíritu",
    description: "Únete a nuestra comunidad de oración diaria, deja tus intenciones y comparte la paz de Dios.",
    url: "https://cielosanto.com",
    siteName: "Cielo Santo",
    locale: "es_LA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cielo Santo | Oración y Fe",
    description: "Un espacio de fe, oración y esperanza.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {/* Barra de navegación global responsiva con active state */}
        <Navbar />

        {/* Contenido de cada página */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Pie de página global */}
        <footer className="bg-white text-center py-6 text-xs text-slate-400 border-t border-amber-100 mt-auto">
          <p>© {new Date().getFullYear()} Cielo Santo — Pagos 100% Encriptados y Seguros</p>
          <p className="mt-1 text-[11px] text-slate-400">Canal oficial de YouTube: @cielosanto20</p>
        </footer>
      </body>
    </html>
  );
}