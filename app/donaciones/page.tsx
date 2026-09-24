import React from 'react';

export default function Donaciones() {
  return (
    <main className="min-h-screen bg-stone-50 pb-20 font-sans">
      
      {/* 1. ENCABEZADO EMOCIONAL */}
      <section className="bg-slate-900 text-white pt-24 pb-32 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1443527216320-7e744084f5a7?q=80&w=2070&auto=format&fit=crop" 
            alt="Luz de esperanza" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-amber-500 font-bold uppercase text-xs tracking-widest mb-4 block">Ministerio Cielo Santo</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            Sé la respuesta a la <br className="hidden md:block" /> oración de alguien más
          </h1>
          <p className="text-lg text-slate-300 font-light max-w-2xl mx-auto mb-8 leading-relaxed">
            Cada día recibimos mensajes de personas que han perdido la esperanza, familias sin alimento y corazones quebrantados. Tu ofrenda es el abrazo de Dios para ellos.
          </p>
        </div>
      </section>

      {/* 2. VIDEO DESTACADO (Documentación Audiovisual) */}
      <section className="max-w-4xl mx-auto px-5 -mt-20 relative z-20 mb-20">
        <div className="bg-white p-2 rounded-3xl shadow-2xl">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 flex items-center justify-center group cursor-pointer">
            {/* Imagen de miniatura del video */}
            <img 
              src="https://images.unsplash.com/photo-1593113589914-075568e09166?q=80&w=2070&auto=format&fit=crop" 
              alt="Ayuda comunitaria" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors"></div>
            
            {/* Botón de Play gigante */}
            <div className="relative z-10 w-20 h-20 bg-amber-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:bg-amber-500 transition-colors">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <h3 className="text-white font-serif font-bold text-xl md:text-2xl drop-shadow-md">Mira el impacto de tu siembra</h3>
              <p className="text-slate-200 text-sm drop-shadow-md">Un mensaje de nuestro equipo (3:15)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIOS (Apelación a los sentimientos) */}
      <section className="max-w-5xl mx-auto px-5 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Vidas que hemos tocado juntos</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Detrás de cada aporte hay un rostro, una familia y un corazón agradecido.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100 relative">
            <span className="text-6xl text-amber-200 absolute top-4 left-4 font-serif">"</span>
            <div className="relative z-10">
              <p className="text-slate-700 italic mb-6 leading-relaxed">
                "Estábamos pasando por un momento muy oscuro, mi esposo perdió el trabajo y no teníamos para la cena. La caja de alimentos que nos hizo llegar la fundación de Cielo Santo fue literalmente una respuesta a mis oraciones de esa madrugada."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop" alt="Testimonio" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">María Fernanda</h4>
                  <p className="text-slate-500 text-xs">Madre de 3 hijos</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-100/50 p-8 rounded-3xl border border-stone-200 relative">
            <span className="text-6xl text-stone-200 absolute top-4 left-4 font-serif">"</span>
            <div className="relative z-10">
              <p className="text-slate-700 italic mb-6 leading-relaxed">
                "Las oraciones diarias salvaron mi vida. Estaba sumido en una depresión profunda y escuchar los videos de Cielo Santo me dio fuerzas. Hoy aporto mensualmente para que este ministerio nunca se apague y ayude a otros como me ayudó a mí."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop" alt="Testimonio" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Roberto C.</h4>
                  <p className="text-slate-500 text-xs">Miembro de la comunidad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TARJETAS DE OFRENDA */}
      <section className="max-w-5xl mx-auto px-5 mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 flex flex-col text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Semilla de Fe</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1 italic">
              Para que nuestra oración siga llegando a miles de hermanos cada mañana.
            </p>
            <div className="text-3xl font-bold text-slate-900 mb-6">$5 <span className="text-sm font-normal text-slate-500">USD</span></div>
            <button className="w-full bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold py-4 rounded-xl transition-colors">
              Ofrendar Ahora
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-amber-500 flex flex-col text-center relative hover:-translate-y-1 transition-transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
              MAYOR IMPACTO
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Luz de Esperanza</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1 italic">
              Apoya la expansión de la congregación y nos permite llevar alimento a familias este mes.
            </p>
            <div className="text-3xl font-bold text-slate-900 mb-6">$15 <span className="text-sm font-normal text-slate-500">USD</span></div>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md">
              Ofrendar Ahora
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 flex flex-col text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Pilar del Ministerio</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1 italic">
              Sostiene nuestra obra a largo plazo y asegura nuestras misiones en comedores solidarios.
            </p>
            <div className="text-3xl font-bold text-slate-900 mb-6">$30 <span className="text-sm font-normal text-slate-500">USD</span></div>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors">
              Ofrendar Ahora
            </button>
          </div>

        </div>
      </section>

      {/* 5. GALERÍA VISUAL: ¿A DÓNDE VA TU AYUDA? */}
      <section className="max-w-5xl mx-auto px-5">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-10 text-center">La obra en acción</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Obra 1: Alimentos */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-100 group">
            <div className="h-64 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
                alt="Entrega de alimentos" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                Pan y Abrigo
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h4 className="font-bold text-slate-900 text-xl mb-3">Alimento para los más vulnerables</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                Trabajamos de la mano con fundaciones locales para convertir tus ofrendas en raciones de comida caliente, cajas de despensa y ropa para familias que están atravesando el desierto de la necesidad. Tú eres las manos que entregan este alimento.
              </p>
            </div>
          </div>
          
          {/* Obra 2: Ministerio y Fe */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-stone-100 group">
            <div className="h-64 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop" 
                alt="Oración comunitaria" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                Luz y Palabra
              </div>
            </div>
            <div className="p-6 md:p-8">
              <h4 className="font-bold text-slate-900 text-xl mb-3">Sosteniendo la esperanza digital</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                En un mundo lleno de ruido y ansiedad, mantenemos nuestros canales abiertos. Tu ayuda financia la producción de los videos diarios, el mantenimiento del muro de peticiones y asegura que el mensaje de Dios siga siendo gratuito para todos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CIERRE DE CONFIANZA */}
      <section className="max-w-3xl mx-auto px-5 mt-20 text-center opacity-70">
        <p className="text-xs text-slate-500">
          Tus ofrendas son procesadas de manera segura y encriptada. Tu banco realizará la conversión a la moneda de tu país al momento del pago.
        </p>
      </section>

    </main>
  );
}