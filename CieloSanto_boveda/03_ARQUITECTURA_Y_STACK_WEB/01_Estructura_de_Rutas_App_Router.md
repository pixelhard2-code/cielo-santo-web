---
title: Estructura de Rutas App Router
module: 03_ARQUITECTURA_Y_STACK_WEB
tags:
  - app-router
  - nextjs16
  - rutas
  - api-routes
  - arquitectura-web
aliases:
  - Estructura de Rutas
  - Arquitectura App Router
---

# 🗺️ 01. Estructura de Rutas App Router

> [!NOTE]
> **Cielo Santo** opera sobre la arquitectura moderna **Next.js App Router**. Este documento mapea tanto las rutas existentes como las rutas de backend API proyectadas para habilitar la persistencia, la pasarela de pagos y el envío de correos.

---

## 1. Mapa Completo de Rutas (Presente y Proyectado)

```
app/
├── layout.tsx                     # Marco global (Navbar sticky, footer y viewport)
├── globals.css                    # Directivas de Tailwind CSS v4 y tema
├── page.tsx                       # "/" - Santuario principal y Muro de Oración
│
├── productos/
│   └── page.tsx                   # "/productos" - Catálogo devocional y suscripción
│
├── donaciones/
│   └── page.tsx                   # "/donaciones" - Página de siembra y ofrendas
│
├── gracias/                       # [PROYECTADA] Confirmación post-pago y descarga
│   └── page.tsx                   # "/gracias?session_id=..."
│
└── api/                           # [PROYECTADAS] Endpoints de Backend y Webhooks
    ├── peticiones/
    │   ├── route.ts               # GET: listar oraciones / POST: nueva petición
    │   └── [id]/
    │       └── apoyar/
    │           └── route.ts       # POST: sumar apoyo ("Unirme en oración")
    ├── amens/
    │   └── route.ts               # GET: total amens / POST: registrar amén
    ├── checkout/
    │   └── route.ts               # POST: generar Stripe Checkout Session
    ├── webhooks/
    │   └── stripe/
    │       └── route.ts           # POST: receptor de eventos Stripe
    └── cron/
        └── devocional-alba/
            └── route.ts           # GET: trigger automatizado de Resend (7:00 AM)
```

---

## 2. Detalle de Páginas de Usuario

### A. Página de Inicio (`/`)
- **Archivo**: `app/page.tsx`.
- **Propósito**: Entrada principal, generación de confianza, versículo interactivo y recepción de intenciones.
- **Componentes**: Hero con imagen de amanecer, Tarjeta Salmo del Día (interactiva con Amén y WhatsApp), Banner de Campaña Donación, Muro de Intenciones con formulario, y Llamado a la acción hacia YouTube.

### B. Catálogo Digital (`/productos`)
- **Archivo**: `app/productos/page.tsx`.
- **Propósito**: Ofrecer recursos espirituales de pago para nutrir la fe y financiar el ministerio.
- **Productos**:
  1. *Oraciones del Alba*: Suscripción mensual ($2.990 CLP).
  2. *Devocional: 30 Días*: Libro Digital en formato PDF ($4.990 CLP).
- **Elementos de Conversión**: Tabla de beneficios con checks verdes, badges ("MÁS VENDIDO"), sellos de seguridad bancaria y FAQ.

### C. Portal de Donaciones (`/donaciones`)
- **Archivo**: `app/donaciones/page.tsx`.
- **Propósito**: Canalizar la generosidad de la comunidad hacia la obra social y la expansión digital.
- **Estructura**: Encabezado emotivo con citas de ayuda al prójimo, video testimonial, 3 niveles de ofrenda ($5, $15 y $30 USD), y galería de transparencia "La obra en acción" (*Pan y Abrigo* y *Luz y Palabra*).

---

## 3. Especificación de Endpoints API Requeridos

### 1. `POST /api/peticiones`
- **Body**: `{ nombre: string, peticion: string }`
- **Lógica**: Valida campos, filtra palabras ofensivas (moderación básica) e inserta en la tabla `peticiones` de Supabase con `estado = 'aprobado'` o `'pendiente'`.

### 2. `POST /api/peticiones/[id]/apoyar`
- **Lógica**: Incrementa el contador `apoyos` en la base de datos de manera atómica con Supabase RPC o `UPDATE peticiones SET apoyos = apoyos + 1 WHERE id = :id`.

### 3. `POST /api/checkout`
- **Body**: `{ tipo: 'suscripcion' | 'devocional' | 'donacion', monto?: number, currency: 'clp' | 'usd' }`
- **Respuesta**: `{ url: 'https://checkout.stripe.com/c/pay/cs_...' }`
- **Lógica**: Inicializa Stripe Checkout Session con `success_url` apuntando a `/gracias?session_id={CHECKOUT_SESSION_ID}`.

### 4. `POST /api/webhooks/stripe`
- **Seguridad**: Valida firma `stripe-signature` con el secreto `STRIPE_WEBHOOK_SECRET`.
- **Eventos**:
  - `checkout.session.completed`: Si compró el Devocional PDF, dispara un correo inmediato mediante Resend con el enlace de descarga seguro.
  - `customer.subscription.created`: Registra al nuevo suscriptor en Supabase para incluirlo en el envío diario de las 7:00 AM.
