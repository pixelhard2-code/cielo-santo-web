import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidad y datos personales',
  description: 'Cómo Cielo Santo recibe, protege y conserva las peticiones de oración y los datos de suscripciones.',
};

export default function PrivacidadPage() {
  return <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-stone-700">
    <p className="text-xs uppercase tracking-[.18em] text-amber-800 mb-3">Cielo Santo</p>
    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-8">Privacidad y datos personales</h1>
    <div className="space-y-7 text-sm leading-relaxed">
      <section>
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Peticiones de oración</h2>
        <p>Guardamos el nombre que escribes y tu mensaje para moderarlo y acompañar la comunidad. Las peticiones públicas solo aparecen después de revisión. Las privadas no se incluyen en el muro público y permanecen pendientes de revisión pastoral. No envíes números de identificación, teléfonos ni detalles médicos que no sean necesarios.</p>
        <p className="mt-2">Las peticiones privadas y las publicaciones públicas aún pendientes de revisión se eliminan automáticamente después de 90 días. Las publicaciones públicas aprobadas permanecen visibles hasta que las retiremos o recibamos una solicitud de eliminación.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Correo diario</h2>
        <p>Si marcas la casilla de suscripción, guardamos tu correo y la fecha de consentimiento. Te enviaremos un mensaje de confirmación antes de activar el envío diario. Puedes darte de baja desde cada correo; al hacerlo, se detienen los envíos.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Libro gratuito</h2>
        <p>Si solicitas el libro de siete Salmos, usamos tu correo para enviarte el enlace privado de descarga. Esta solicitud no te suscribe al correo diario. Conservamos la dirección hasta 90 días para atender el envío y luego la eliminamos automáticamente.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Pagos y descargas</h2>
        <p>Los pagos se procesan en Stripe o Mercado Pago. No recibimos ni almacenamos los datos de tu tarjeta. Guardamos los datos mínimos de la operación —correo, monto, moneda, categoría y referencia del proveedor— para confirmar el pago y entregar el recurso o registrar el aporte. El archivo comprado se guarda en un bucket privado; los enlaces de descarga vencen a las 72 horas.</p>
      </section>
      <section>
        <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Protección y solicitudes</h2>
        <p>Los datos operativos están en Supabase y el correo transaccional se envía con Resend. Las solicitudes a los formularios se limitan para reducir spam; para esa protección se conserva durante un máximo aproximado de dos días un hash criptográfico del origen, no la dirección IP en texto claro. Los reportes de moderación se almacenan junto a la publicación.</p>
        <p className="mt-2">Para solicitar acceso, corrección o eliminación de una petición, escribe a <a className="underline" href="mailto:contacto@cielosanto.com">contacto@cielosanto.com</a>. No incluyas la petición completa en el asunto del correo.</p>
      </section>
      <p className="text-xs text-stone-500">Esta página describe el funcionamiento técnico actual de la plataforma. No sustituye asesoría legal ni define los plazos de conservación contable exigidos a la entidad que recibe los aportes.</p>
    </div>
  </main>;
}
