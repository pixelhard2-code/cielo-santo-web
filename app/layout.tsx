import type { Metadata } from "next";
import { Spectral, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

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
      <body className={`${spectral.variable} ${sourceSans.variable} font-sans antialiased min-h-screen flex flex-col bg-[#fcfaf7] text-stone-900 selection:bg-amber-200 selection:text-amber-950`}>
        {/* Barra de navegación global */}
        <Navbar />

        {/* Contenido de cada página */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Pie de página sobrio y humano */}
        <footer className="bg-white border-t border-stone-200 py-10 px-5 text-center text-stone-600 text-xs mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-serif font-semibold text-stone-900 text-sm">Cielo Santo</p>
              <p className="text-stone-700 mt-0.5">Espacio cristiano de oración, meditación en los Salmos y acompañamiento comunitario.</p>
            </div>
            <div className="flex items-center gap-4 text-stone-700">
              <a 
                href="https://youtube.com/@cielosanto20" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-stone-900 transition-colors"
              >
                Canal de YouTube
              </a>
              <span className="text-stone-400">·</span>
              <a 
                href="mailto:contacto@cielosanto.com" 
                className="hover:text-stone-900 transition-colors"
              >
                contacto@cielosanto.com
              </a>
            </div>
          </div>
          <div className="border-t border-stone-100 mt-6 pt-6 text-[11px] text-stone-600">
            © {new Date().getFullYear()} Cielo Santo. Todas las oraciones compartidas son leídas con respeto y confidencialidad.
          </div>
        </footer>
      </body>
    </html>
  );
}