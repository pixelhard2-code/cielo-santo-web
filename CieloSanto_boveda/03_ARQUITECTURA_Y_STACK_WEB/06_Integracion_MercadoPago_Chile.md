---
title: Integración de Mercado Pago para Chile y Latinoamérica
module: 03_ARQUITECTURA_Y_STACK_WEB
tags:
  - mercadopago
  - webpay
  - chile
  - pasarela-pagos
  - clp
  - suscripciones
aliases:
  - Integración Mercado Pago
  - Pasarela Chile
---

# 💳 06. Integración de Mercado Pago para Chile

> [!IMPORTANT]
> **Hecho Técnico Crítico**: Stripe Payments **no lista a Chile** entre sus países soportados para abrir cuentas estándar de recaudación directa. Por tanto, para un ministerio o entidad que opera legalmente desde Chile, **Mercado Pago** es la pasarela natural y de mayor penetración, permitiendo pagos con Redcompra, CuentaRUT, Webpay y tarjetas de crédito locales.

---

## 1. El Stack Tecnológico Adaptado para Chile

```
ANTES:
[Stripe] + [Supabase] + [Resend]

AHORA (Arquitectura Realista para Chile):
[Mercado Pago / Webpay] + [Supabase] + [Resend]
```

*(Stripe se mantiene en el código como opción secundaria para pagos internacionales en dólares si el proyecto se constituye bajo una entidad en EE.UU. o Europa).*

---

## 2. Tipos de Pagos Implementados con Mercado Pago

| Tipo | Producto | Endpoint | Medio de Pago |
| :--- | :--- | :--- | :--- |
| **Pago Único** | *30 días con los Salmos* ($4.990 CLP) | `createMercadoPagoPreference` | Débito, Crédito, CuentaRUT, Webpay |
| **Aporte Voluntario** | Sostén de $3.000, $10.000, $25.000 o libre | `createMercadoPagoPreference` | Débito, Crédito, Transferencia bancaria |
| **Suscripción Recurrente** | *Oraciones del Alba* ($2.990 CLP/mes) | API `/preapproval_plan` | Débito automático mensual en tarjeta |

---

## 3. Implementación en el Repositorio (`lib/mercadopago.ts`)

El proyecto ya cuenta con el cliente oficial instalado (`mercadopago: ^2.x`):

```typescript
import { MercadoPagoConfig, Preference } from 'mercadopago';

const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

export const isMercadoPagoConfigured = Boolean(mpAccessToken);

export const mpClient = isMercadoPagoConfigured
  ? new MercadoPagoConfig({ accessToken: mpAccessToken })
  : null;
```

---

## 4. Webhooks y Notificaciones IPN
Mercado Pago envía notificaciones `payment.updated` a nuestro endpoint backend para:
1. Confirmar el pago exitoso en la tabla `donaciones` o `suscriptores` de Supabase.
2. Disparar el envío inmediato del devocional en PDF mediante Resend.
3. Emitir el recibo de agradecimiento fraternal.
