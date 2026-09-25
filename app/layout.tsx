import type { Metadata } from "next";
import { Spectral, Source_Sans_3 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
  description: "Un espacio cristiano de oración, meditación en los Salmos y acompañamiento comunitario diario.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Cielo Santo | Un remanso de calma para tu espíritu",
    description: "Únete a nuestra comunidad de oración diaria, comparte tus intenciones y medita en los Salmos de paz.",
    url: "https://cielosanto.com",
    siteName: "Cielo Santo",
    locale: "es_LA",
    type: "website",
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
        {/* Barra de navegación oficial con logo */}
        <Navbar />

        {/* Contenido de cada página */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Pie de página con divisor de cruz y 4 columnas idéntico a la maqueta */}
        <footer className="bg-white border-t border-stone-200/80 pt-10 pb-8 px-5 text-stone-600 text-xs mt-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* Divisor ornamental de cruz */}
            <div className="flex justify-center mb-10">
              <Image 
                src="/divider-cross.png" 
                alt="Divisor" 
                width={360} 
                height={24} 
                className="h-5 w-auto object-contain opacity-75"
              />
            </div>

            {/* 4 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
              {/* Columna 1: Logo y descripción */}
              <div className="md:col-span-1">
                <Image 
                  src="/logo-cielo-santo.png" 
                  alt="Cielo Santo" 
                  width={160} 
                  height={40} 
                  className="h-8 w-auto object-contain mb-3"
                />
                <p className="text-stone-500 text-xs leading-relaxed max-w-xs">
                  Espacio cristiano de oración, meditación en los Salmos y acompañamiento comunitario.
                </p>
              </div>

              {/* Columna 2: Enlaces */}
              <div>
                <p className="font-serif font-bold text-stone-900 text-sm mb-3">Enlaces</p>
                <ul className="space-y-2 text-stone-600">
                  <li>
                    <Link href="/" className="hover:text-stone-900 transition-colors">Inicio</Link>
                  </li>
                  <li>
                    <Link href="/productos" className="hover:text-stone-900 transition-colors">Devocionales</Link>
                  </li>
                  <li>
                    <Link href="/donaciones" className="hover:text-stone-900 transition-colors">Sostén y Misión</Link>
                  </li>
                  <li>
                    <Link href="/nosotros" className="hover:text-stone-900 transition-colors">Sobre Nosotros</Link>
                  </li>
                </ul>
              </div>

              {/* Columna 3: Otros */}
              <div>
                <p className="font-serif font-bold text-stone-900 text-sm mb-3">Otros</p>
                <ul className="space-y-2 text-stone-600">
                  <li>
                    <a 
                      href="https://youtube.com/@cielosanto20" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-stone-900 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Canal de YouTube</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:contacto@cielosanto.com" className="hover:text-stone-900 transition-colors">
                      Contacto: contacto@cielosanto.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Columna 4: Síguenos */}
              <div>
                <p className="font-serif font-bold text-stone-900 text-sm mb-3">Síguenos</p>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://youtube.com/@cielosanto20" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Fila inferior de derechos */}
            <div className="border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
              <p>© {new Date().getFullYear()} Cielo Santo. Todos los derechos reservados con respeto y confidencialidad.</p>
              <div className="hidden sm:block">
                <Image 
                  src="/cross.png" 
                  alt="Cruz" 
                  width={16} 
                  height={20} 
                  className="h-3.5 w-auto object-contain opacity-50"
                />
              </div>
              <p className="italic">Un corazón en oración, una comunidad para la vida.</p>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}