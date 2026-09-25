---
title: Estrategia Multidivisa CLP / USD
module: 04_MODELO_DE_NEGOCIO_Y_MONETIZACION
tags:
  - divisas
  - clp
  - usd
  - stripe-multidivisa
  - internacionalizacion
  - conversion
aliases:
  - Estrategia Multidivisa
  - Monedas CLP y USD
---

# 💱 03. Estrategia Multidivisa CLP / USD

> [!NOTE]
> Una de las inconsistencias más notorias del proyecto actual es la coexistencia de **Pesos Chilenos (CLP)** en el Catálogo Digital y **Dólares Americanos (USD)** en la página de Donaciones. Este documento analiza las repercusiones de este conflicto y define la hoja de ruta para resolverlo limpiamente.

---

## 1. El Diagnóstico del Conflicto Actual

```mermaid
flowchart LR
    subgraph Catalogo["/productos (Catálogo)"]
        C1["$2.990 CLP / mes"]
        C2["$4.990 CLP (Libro PDF)"]
    end

    subgraph Donaciones["/donaciones (Ofrendas)"]
        D1["$5 USD (Semilla)"]
        D2["$15 USD (Luz)"]
        D3["$30 USD (Pilar)"]
    end

    Catalogo --- Discrepancia{"⚠️ ¿Qué moneda rige en Cielo Santo?"}
    Donaciones --- Discrepancia
```

### Problemas Detectados:
1. **Confusión Numérica Internacional**: Un usuario de México, Colombia o EE.UU. que llega a `/productos` ve `$4.990` y puede interpretar erróneamente que el libro cuesta casi cinco mil dólares.
2. **Fricción de Conversión para Usuarios Chilenos**: Un usuario en Chile que entra a `/donaciones` ve `$15 USD` y debe calcular mentalmente el tipo de cambio (~14.250 CLP), lo que posterga la decisión de aportar.
3. **Complejidad de Stripe**: Si no se configuran precios multidivisa en Stripe, la pasarela rechazará o convertirá cargos con tasas bancarias desfavorables para los donantes.

---

## 2. Las 3 Alternativas Estratégicas

| Alternativa | Descripción | Ventajas | Desventajas |
| :--- | :--- | :--- | :--- |
| **Opción A: Todo en USD** | Homogeneizar toda la web a dólares americanos ($3.50, $5.00, $15.00, $30.00). | Estándar global para toda Latinoamérica y USA. Una sola cuenta bancaria. | Puede parecer más distante para el público chileno tradicional. |
| **Opción B: Toggle Manual (CLP / USD)** | Un interruptor en la cabecera donde el usuario elige ver los precios en CLP o USD. | Control total del usuario, máxima transparencia. | Requiere mantener estados en el cliente y sincronizar dos listas de precios. |
| **Opción C: Stripe Adaptive Pricing (Recomendada)** | Stripe detecta el país de la IP y muestra la moneda local automáticamente en el checkout. | Cero fricción, cobros nativos en moneda local, máxima conversión internacional. | Requiere activar la función en el Dashboard de Stripe. |

---

## 3. Solución Práctica Inmediata (Fase de Transición)

Mientras se conecta la pasarela final de Stripe, se recomienda aplicar una **doble indicación visual transparente** en las tarjetas de la interfaz:

### En `/productos`:
- **Oraciones del Alba**: `$2.990 CLP` <span className="text-xs text-slate-500 font-normal">($3.15 USD aprox.)</span>
- **Devocional: 30 Días**: `$4.990 CLP` <span className="text-xs text-slate-500 font-normal">($5.25 USD aprox.)</span>

### En `/donaciones`:
- **Semilla de Fe**: `$5 USD` <span className="text-xs text-slate-500 font-normal">(~$4.700 CLP)</span>
- **Luz de Esperanza**: `$15 USD` <span className="text-xs text-slate-500 font-normal">(~$14.200 CLP)</span>
- **Pilar del Ministerio**: `$30 USD` <span className="text-xs text-slate-500 font-normal">(~$28.500 CLP)</span>

### Texto de Confianza en el Footer:
> *"Aceptamos tarjetas de débito y crédito de todos los países. Tu banco realizará la conversión automática a la moneda de tu país sin comisiones ocultas."*
