<div align="center">

# 🕊️ CIELO SANTO
### *Un refugio de paz para tu espíritu*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Chile_&_LATAM-009ee3?style=for-the-badge&logo=mercadopago&logoColor=white)](https://www.mercadopago.cl/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Realtime-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<p align="center">
  Plataforma web de acompañamiento espiritual cristiano, oración comunitaria en tiempo real y sostenimiento ético de obras benéficas, diseñada en sinergia directa con el canal de YouTube <b><a href="https://youtube.com/@cielosanto20">@cielosanto20</a></b>.
</p>

[Explorar Web](#-características-principales) •
[Arquitectura](#-stack-tecnológico) •
[Instalación](#-instalación-y-desarrollo) •
[Bóveda de Obsidian](#-bóveda-de-conocimiento-obsidian) •
[Compromiso Ético](#-compromiso-ético-y-transparencia)

---

</div>

## 🌟 Características Principales

### 1. 📖 Hoy en Cielo Santo
- **Salmo Diario con Contexto**: Selección de pasajes bíblicos enriquecidos con una reflexión original y una oración guiada de 30 segundos.
- **Contador Colectivo de Amén**: Registro persistente diario de afirmación de fe.
- **Motor Viral de WhatsApp**: Compartir reflexiones bíblicas y oraciones matutinas en grupos familiares con un solo clic y URL optimizada.

### 2. 🙏 Muro de Intenciones Comunitario
- **Muro moderado**: Las peticiones públicas quedan pendientes hasta su revisión; las privadas nunca aparecen en el muro público.
- **Privacidad y Cuidado de Datos**:
  - *Modo Público*: Se comparte con la comunidad en el muro tras moderación.
  - *Modo Privado*: Intenciones confidenciales reservadas únicamente para la oración del equipo pastoral.
- **Protección Sensible**: Advertencias para evitar la difusión de datos médicos sensibles de terceros.
- **Apoyo Comunitario Fraternal**: Interacción interactiva (*"Hoy estás orando junto a otras X personas por..."*).
- **Herramienta de Reporte**: Botón comunitario para filtrar spam o contenido indebido.

### 3. 🎥 Acompañamiento en YouTube (@cielosanto20)
- **Oraciones de Acompañamiento**: Accesos directos a la *Oración de la Mañana*, el *Salmo 91* y la *Oración por los Hijos*.

### 4. 📚 Recursos para el Camino de Fe
- **Devocional "30 días con los Salmos"**: Libro digital en PDF descargable de inmediato con lecturas guiadas de paz y fortaleza ($4.990 CLP).
- **Membresía "Oraciones del Alba"**: Despacho diario a las 7:00 AM con reflexión profunda, audio y mención en oraciones ($2.990 CLP/mes).
- **Newsletter Gratuito**: *"Una palabra de esperanza cada mañana"* para acompañar al creyente sin costo.

### 5. 🌾 Sostén y Obras Solidarias
- **Separación Estricta de Fondos**:
  - *Fondo Operativo*: Sostenimiento de servidores en la nube, herramientas de audio y producción de video.
  - *Fondo Solidario (Pan y Abrigo)*: Destinado a raciones de alimentos y abrigo para familias vulnerables en alianza con comedores sociales.
- **Aportes Voluntarios Neutros**: Eliminación de jerarquías espirituales de mérito ($3.000, $10.000, $25.000 CLP o monto libre).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.3.6 (App Router)** | Renderizado híbrido Server Components + Client Leaves con Turbopack. |
| **Librería de Interfaz** | **React 19.2.8** | Manejo de estado reactivo y Server Actions. |
| **Estilos y Diseño** | **Tailwind CSS v4.0** | Sistema de diseño sobrio con tokens cálidos (`#fdf8f6`, `amber-700`, `slate-900`). |
| **Base de Datos** | **Supabase (PostgreSQL)** | Datos privados gestionados exclusivamente desde rutas del servidor, con RLS y moderación. |
| **Pasarela de Pagos** | **Mercado Pago / Stripe** | Aportes CLP y suscripciones Stripe; la entrega solo se marca tras confirmar el pago. |
| **Motor de Correo** | **Resend** | Confirmación de suscripción, entrega de compra y oración diaria. |
| **Lenguaje** | **TypeScript 5** | Tipado estricto en toda la aplicación. |

---

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- **Node.js** v20+ o v24+
- **npm**, **pnpm** o **yarn**

### 1. Clonar el repositorio
```bash
git clone https://github.com/zMatuiti/cielo-santo-web.git
cd cielo-santo-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia la plantilla de ejemplo y configura tus claves:
```bash
cp .env.example .env.local
```

Configura en `.env.local`:
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
MP_WEBHOOK_SECRET="..."
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Cielo Santo <paz@cielosanto.com>"
CRON_SECRET="secreto-aleatorio"
DOWNLOAD_TOKEN_SECRET="secreto-aleatorio-de-al-menos-32-caracteres"
```

### 4. Iniciar el servidor local
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

### Configuración necesaria para operar

La interfaz se mantiene en modo de disponibilidad limitada hasta completar estos pasos; no simula confirmaciones ni pagos.

1. Ejecuta las migraciones de `supabase/migrations/` en el SQL Editor de Supabase. Usa una llave `service_role` solo como variable de entorno del servidor; nunca la publiques como `NEXT_PUBLIC_*`.
2. En Supabase Storage, sube `private-resources/treinta-dias-con-los-salmos.pdf` y `private-resources/siete-salmos-para-el-descanso.pdf` al bucket privado `paid-resources` con esos mismos nombres. El devocional de pago se entrega con un enlace válido por 72 horas; el libro gratuito se envía al correo que lo solicita con un enlace válido por 48 horas. La dirección del libro gratuito se elimina a los 90 días y no activa la suscripción diaria.
3. Configura Stripe para escuchar `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid` y `invoice.payment_failed` en `/api/webhooks/stripe`. Habilita el portal de cliente en Stripe para gestionar/cancelar suscripciones.
4. Configura el webhook de Mercado Pago en `/api/webhooks/mercadopago` y guarda su secreto en `MP_WEBHOOK_SECRET`.
5. Verifica el dominio remitente en Resend y configura `RESEND_FROM_EMAIL`.
6. En GitHub Actions, crea los secretos `CIELO_SANTO_SITE_URL` y `CRON_SECRET`. El workflow horario ejecuta el envío cuando la hora de Santiago es 07:00; el primer envío depende del planificador de GitHub.

Las nuevas peticiones quedan en estado `pendiente`. El equipo debe revisarlas desde Supabase y cambiar su `estado` a `aprobado` o `rechazado`; las privadas nunca deben aprobarse para el muro público. Las peticiones privadas y las publicaciones sin aprobar se eliminan a los 90 días por el proceso diario de limpieza.

Los pagos de los tres destinos de aporte quedan etiquetados como `operativo`, `solidario` o `continuidad` en la tabla `payments`. Esa etiqueta registra el destino elegido en el sitio; la conciliación bancaria y el reporte financiero siguen siendo responsabilidad de la organización.

### 5. Compilación para producción
```bash
npm run build
npm run start
```

---

## 🗄️ Bóveda de Conocimiento (Obsidian)

El repositorio incluye la carpeta [`CieloSanto_boveda`](./CieloSanto_boveda), una base de conocimiento viva con **26 documentos interconectados** para planificar la estrategia y el desarrollo:

```
CieloSanto_boveda/
├── 00_DASHBOARD/                # Centro de control y mapa de navegación
├── 01_VISION_Y_MARCA/          # Propósito, buyer personas y compromisos legales
├── 02_AUDITORIA_Y_DIAGNOSTICO/  # Auditoría técnica, de UX y rendimiento
├── 03_ARQUITECTURA_Y_STACK_WEB/ # App router, Supabase, Mercado Pago y Resend
├── 04_MODELO_DE_NEGOCIO_Y_MONETIZACION/ # Flywheel comercial, precios y catálogo
├── 05_EMBUDO_Y_CRECIMIENTO/     # Sinergia YouTube, WhatsApp y email marketing
├── 06_ROADMAP_Y_PLAN_MAESTRO/  # Fases de desarrollo y backlog priorizado
└── 99_GUIAS_Y_RECURSOS/        # Plantillas de copywriting y variables .env
```

---

## ⚖️ Compromiso Ético y Transparencia

Cielo Santo opera bajo tres principios fundamentales:
1. **Separación Espiritual y Financiera**: El pago o aporte voluntario jamás se asocia a promesas divinas, favores celestiales ni méritos espirituales. Todos los hermanos tienen el mismo valor en nuestra comunidad.
2. **Autoría Humana Auténtica**: Rechazamos la generación masiva de contenido automatizado sin aporte reflexivo. Cada oración y mensaje devocional nace de un compromiso sincero de acompañamiento.
3. **Claridad Jurídica y Tributaria**: En Chile distinguimos con rigor los *aportes voluntarios de sostenimiento* de las *donaciones solidarias*, respetando los marcos regulatorios del SII.

---

## 📄 Licencia

Este proyecto es de carácter privado y comunitario para el ministerio **Cielo Santo**. Todos los derechos reservados © 2026.
