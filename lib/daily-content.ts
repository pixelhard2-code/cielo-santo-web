export const DAILY_READINGS = [
  { reference: 'Salmo 23:1-3', title: 'Un paso a la vez', reflection: 'La imagen del pastor habla de cuidado, dirección y descanso suficiente para continuar. No necesitas resolver todo hoy; puedes empezar por el paso que sí está a tu alcance.', prayer: 'Dios, acompáñame en lo sencillo de esta jornada. Renueva mis fuerzas y ayúdame a pedir apoyo cuando lo necesite.' },
  { reference: 'Salmo 27:1', title: 'Valentía acompañada', reflection: 'El valor no exige que el temor desaparezca. Podemos avanzar con prudencia mientras buscamos compañía y claridad.', prayer: 'Sé luz en mis dudas. Cuida a quienes amo y muéstrame el siguiente paso posible.' },
  { reference: 'Salmo 34:18', title: 'Cerca en el dolor', reflection: 'El sufrimiento merece escucha y compañía, sin juicios ni respuestas apresuradas. Pedir ayuda también puede ser un acto de confianza.', prayer: 'Acompaña a quien atraviesa tristeza. Dame palabras cuidadosas y humildad para pedir ayuda.' },
  { reference: 'Salmo 46:1-2', title: 'Un lugar de refugio', reflection: 'En tiempos inestables, una pausa y una persona confiable pueden ayudarnos a recuperar perspectiva.', prayer: 'Sé refugio para mi familia. Guíame hacia el apoyo seguro y las decisiones responsables.' },
  { reference: 'Salmo 55:22', title: 'No cargar a solas', reflection: 'No tenemos que llevar cada preocupación sin compañía. Compartirla con alguien de confianza puede ser un primer paso.', prayer: 'Ayúdame a aceptar el apoyo que necesito y a ofrecerlo con respeto a quienes me rodean.' },
  { reference: 'Salmo 90:12', title: 'Cuidar lo esencial', reflection: 'Recordar que nuestro tiempo es limitado nos invita a prestar atención a quienes amamos y a lo que da sentido a la vida.', prayer: 'Ayúdame a estar presente hoy y a tratar con cuidado a cada persona que encuentre.' },
  { reference: 'Salmo 121:1-2', title: 'Mirar con esperanza', reflection: 'La esperanza no reemplaza la ayuda concreta; puede impulsarnos a buscarla y a continuar acompañados.', prayer: 'Sostén mi camino y acompaña a quienes están buscando un nuevo comienzo.' },
];

export type DailyReading = (typeof DAILY_READINGS)[number];

export function getChileDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function getDailyReading(date = new Date()) {
  const parts = getChileDateParts(date);
  const day = Math.floor((Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) - Date.UTC(Number(parts.year), 0, 1)) / 86_400_000);
  return DAILY_READINGS[day % DAILY_READINGS.length];
}

export function getChileDateLabel(date = new Date()) {
  return new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date);
}
