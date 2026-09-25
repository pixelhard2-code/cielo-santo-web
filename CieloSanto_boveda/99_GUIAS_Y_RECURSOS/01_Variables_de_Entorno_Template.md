---
title: Plantilla de Variables de Entorno (.env.local)
module: 99_GUIAS_Y_RECURSOS
tags:
  - variables-entorno
  - env-local
  - configuracion
  - seguridad
  - api-keys
aliases:
  - Variables de Entorno
  - Configuración .env
---

# 🔐 01. Plantilla de Variables de Entorno (.env.local)

> [!CAUTION]
> **Regla de Oro de Seguridad**: Nunca subas el archivo `.env.local` al repositorio de Git. Las claves que no empiezan por `NEXT_PUBLIC_` son estrictamente privadas de servidor y otorgan control administrativo sobre pagos y base de datos.

---

## 1. Contenido del Archivo `.env.local`

Copia el siguiente bloque y pégalo en la raíz de tu proyecto en un archivo llamado `.env.local`:

```bash
# ==============================================================================
# 🌐 CONFIGURACIÓN GENERAL DE LA APLICACIÓN
# ==============================================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# En producción cambiar a: "https://cielosanto.com"

# ==============================================================================
# 🗄️ SUPABASE (Base de datos PostgreSQL y Realtime)
# Obtener en: https://app.supabase.com/project/_/settings/api
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# Clave opcional para tareas de mantenimiento backend sin restricciones RLS:
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ==============================================================================
# 💳 STRIPE (Pasarela de Cobros y Suscripciones)
# Obtener en: https://dashboard.stripe.com/apikeys
# ==============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# IDs de Precios creados en Stripe (Modo Prueba o Producción)
STRIPE_PRICE_ORACIONES_ALBA="price_1Q..."   # Suscripción mensual ($2.990 CLP o $3.50 USD)
STRIPE_PRICE_DEVOCIONAL_30D="price_1Q..."   # Pago único Devocional PDF ($4.990 CLP o $5.50 USD)
STRIPE_PRICE_OFRENDA_SEMILLA="price_1Q..."  # Tier $5 USD
STRIPE_PRICE_OFRENDA_LUZ="price_1Q..."      # Tier $15 USD
STRIPE_PRICE_OFRENDA_PILAR="price_1Q..."    # Tier $30 USD

# ==============================================================================
# 📬 RESEND (Motor de Correos Transaccionales y Devocionales)
# Obtener en: https://resend.com/api-keys
# ==============================================================================
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Cielo Santo <paz@cielosanto.com>"

# ==============================================================================
# ⏱️ CRON JOB (Protección de Endpoints Automatizados)
# Generar una cadena aleatoria segura para proteger /api/cron/...
# ==============================================================================
CRON_SECRET="cadena_secreta_super_segura_para_el_cron_job"
```

---

## 2. Dónde Conseguir Cada Clave

1. **Supabase**:
   - Inicia sesión en [Supabase](https://supabase.com).
   - Ve a **Settings -> API**. Copia la *Project URL* y la *anon public key*.
2. **Stripe**:
   - Inicia sesión en [Stripe](https://dashboard.stripe.com).
   - En la pestaña de desarrolladores, ve a **API Keys**. Copia la *Publishable key* y la *Secret key*.
   - Ve a **Webhooks -> Add endpoint**. Añade la URL `https://tu-dominio.com/api/webhooks/stripe` y obtén el secreto de firma (`whsec_...`).
3. **Resend**:
   - Inicia sesión en [Resend](https://resend.com).
   - Ve a **API Keys -> Create API Key**.
   - Ve a **Domains** y agrega tu dominio `cielosanto.com` configurando los registros DNS correspondientes.
