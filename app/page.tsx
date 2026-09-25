"use client";
import CampanaDonacion from '@/components/CampanaDonacion';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  // Estados para simular la interacción comunitaria en tiempo real
  const [amenCount, setAmenCount] = useState(142);
  const [hasClickedAmen, setHasClickedAmen] = useState(false);

  // Ejemplo de peticiones reales para el muro
  const [peticiones, setPeticiones] = useState([
    { id: 1, nombre: "María Elena", peticion: "Pido oración por la salud de mi esposo que está en exámenes médicos.", apoyos: 28, apoyado: false },
    { id: 2, nombre: "Juan c.", peticion: "Por la paz en mi hogar y trabajo para mi hijo mayor.", apoyos: 19, apoyado: false },
    { id: 3, nombre: "Gloria S.", peticion: "Agradeciendo por un día más de vida y pidiendo fortaleza espiritual.", apoyos: 45, apoyado: false },
  ]);

  const handleAmen = () => {
    if (!hasClickedAmen) {
      setAmenCount(prev => prev + 1);
      setHasClickedAmen(true);
    }
  };

  const handleApoyo = (id: number) => {
    setPeticiones(peticiones.map(item => {
      if (item.id === id && !item.apoyado) {
        return { ...item, apoyos: item.apoyos + 1, apoyado: true };
      }
      return item;
    }));
  };

  return (
    <main className="flex flex-col min-h-screen bg-stone-50 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] md:h-[70vh] flex items-center justify-center text-center px-5">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
            alt="Amanecer Cielo Santo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto text-white">
          <span className="bg-amber-500/20 backdrop-blur-md text-amber-200 border border-amber-400/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
            Comunidad Unida en Fe
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-5 drop-shadow-lg leading-tight">
            Un refugio de paz para tu espíritu
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md opacity-90">
            Unimos corazones a través de la oración diaria, los Salmos y el apoyo mutuo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#muro-oracion"
              className="bg-amber-700 hover:bg-amber-800 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-all shadow-xl"
            >
              Dejar Petición de Oración
            </a>
            <Link 
              href="/productos" 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-all border border-white/30"
            >
              Ver Material Espiritual
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VERSÍCULO DEL DÍA (Interactividad) */}
      <section className="relative -mt-10 z-20 px-4 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-100 text-center">
          <span className="text-amber-700 font-bold uppercase text-xs tracking-widest mb-2 block">
            Salmo del Día
          </span>
          <blockquote className="text-xl md:text-2xl font-serif text-slate-800 italic mb-4 leading-relaxed">
            "El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar."
          </blockquote>
          <p className="text-slate-500 text-sm mb-6 font-medium">— Salmo 23:1-2</p>

          <div className="flex flex-wrap justify-center gap-4 items-center border-t border-stone-100 pt-6">
            <button 
              onClick={handleAmen}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                hasClickedAmen 
                  ? 'bg-amber-100 text-amber-800 cursor-default' 
                  : 'bg-amber-700 hover:bg-amber-800 text-white shadow-md'
              }`}
            >
              🙏 {hasClickedAmen ? '¡Amén registrado!' : 'Decir Amén'} ({amenCount})
            </button>

            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('"El Señor es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar." - Salmo 23:1-2. Compartido desde Cielo Santo.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-md"
            >
              💬 Compartir en WhatsApp
            </a>
          </div>
        </div>
      </section>

            {/* ========================================== */}
      {/* 4. AQUÍ PONES EL COMPONENTE DE DONACIONES */}
      {/* ========================================== */}
      <CampanaDonacion />

      {/* 3. MURO DE PETICIONES (Sombra de Comunidad Viva) */}
      <section id="muro-oracion" className="py-20 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">Muro de Intenciones</h2>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            Deja tu intención de oración o apoya las peticiones de otros miembros de la comunidad.
          </p>
        </div>

        {/* Formulario rápido para agregar intención */}
        <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/60 mb-10">
          <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">¿Tienes una petición personal?</h3>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Tu nombre o iniciales..." 
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
            />
            <textarea 
              rows={3} 
              placeholder="Escribe tu petición aquí para que oremos por ti..." 
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm"
            ></textarea>
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-colors text-sm self-end">
              Publicar Petición
            </button>
          </form>
        </div>

        {/* Lista de Peticiones de la Comunidad */}
        <div className="space-y-4">
          {peticiones.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="font-bold text-slate-900 text-sm block mb-1">{p.nombre}</span>
                <p className="text-slate-600 text-sm">{p.peticion}</p>
              </div>
              <button 
                onClick={() => handleApoyo(p.id)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  p.apoyado 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                🤍 {p.apoyado ? 'Orando' : 'Unirme en Oración'} ({p.apoyos})
              </button>
            </div>
          ))}
        </div>
      </section>



      {/* 4. SECCIÓN REDES Y VINCULACIÓN A YOUTUBE */}
      <section className="py-16 bg-slate-900 text-white px-5 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-4">Acompáñanos en los videos de YouTube</h2>
          <p className="text-slate-300 text-sm md:text-base mb-8">
            En nuestros Shorts compartimos la oración de la mañana y oramos colectivamente por las intenciones de este muro.
          </p>
          <a 
            href="https://youtube.com/@cielosanto20" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg gap-3"
          >
            ▶ Ir al Canal Cielo Santo
          </a>
        </div>
      </section>

    </main>
  );
}