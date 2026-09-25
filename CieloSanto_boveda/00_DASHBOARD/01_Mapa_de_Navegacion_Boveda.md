---
title: Mapa de Navegación de la Bóveda
module: 00_DASHBOARD
tags:
  - mapa-navegacion
  - indice
  - boveda-obsidian
  - directorio
aliases:
  - Mapa de Navegación
  - Índice Completo
---

# 🗺️ Mapa de Navegación de la Bóveda

> Esta nota sirve como directorio integral de todos los documentos y artefactos de conocimiento creados para **Cielo Santo**. Utilízala para buscar notas por módulo, temática o estado.

---

## 🗂️ Directorio Estructurado por Módulos

### Módulo 00: Tableros de Control
- [[00_Centro_de_Control_Cielo_Santo]]: Resumen ejecutivo, diagnóstico global, accesos directos y estado por dimensiones.
- [[01_Mapa_de_Navegacion_Boveda]]: Este índice sistemático de navegación.

### Módulo 01: Visión y Marca
- [[01_Mision_Vision_y_Valores]]: Definición del propósito de acompañamiento espiritual y los 5 pilares no negociables.
- [[02_Audiencia_y_Buyer_Personas]]: Arquetipos de usuarios (Hermana en aflicción, Donante agradecido, Buscador diario matutino).
- [[03_Identidad_Visual_y_Tono_de_Voz]]: Paleta de color (#fdf8f6, ambar-700, slate-900), reglas tipográficas y guía de redacción pastoral.
- [[04_Compromisos_Eticos_y_Legales_Chile]]: Separación de promesas espirituales del dinero, marco del SII en Chile y privacidad de datos.

### Módulo 02: Auditoría y Diagnóstico
- [[01_Auditoria_Tecnica_Codebase]]: Análisis del repositorio `cielo-santo-web`, versiones de paquetes, linting y estado de compilación.
- [[02_Auditoria_UX_UI_y_Conversion]]: Detección de botones estáticos, falta de persistencia en muro y conflicto CLP vs USD.
- [[03_Auditoria_SEO_y_Rendimiento]]: Revisión de meta-etiquetas, etiquetas OpenGraph, canonicals y rendimiento de imágenes Unsplash.

### Módulo 03: Producto y Arquitectura Web
- [[01_Estructura_de_Rutas_App_Router]]: Mapa de rutas (`/`, `/productos`, `/donaciones`, `/nosotros`) y especificación de endpoints API.
- [[02_Componentes_e_Interactividad]]: Desglose de componentes: Hero, Salmo del Día, `CampanaDonacion`, Muro de Intenciones y Layout.
- [[03_Integracion_Supabase_Base_de_Datos]]: Esquema SQL de tablas (`peticiones`, `oraciones_apoyos`, `amens`, `suscriptores`), RLS y realtime.
- [[04_Integracion_Stripe_y_Pagos]]: Flujo de Checkout para pagos internacionales secundarios.
- [[05_Integracion_Resend_Email_Devocional]]: Arquitectura de envío automatizado con Resend, diseño de plantillas HTML y cron jobs a las 7:00 AM.
- [[06_Integracion_MercadoPago_Chile]]: Pasarela principal para Chile (Webpay / CuentaRUT / CLP) y suscripciones.

### Módulo 04: Modelo de Negocio y Monetización
- [[01_Catalogo_Digital_y_Devocionales]]: Propuesta de valor de *30 días con los Salmos* ($4.990 CLP) y *Oraciones del Alba* ($2.990 CLP).
- [[02_Sistema_de_Donaciones_y_Siembra]]: Aportes voluntarios neutros ($3.000, $10.000, $25.000 CLP), rendición de cuentas e impacto benéfico.
- [[03_Estrategia_Multidivisa_CLP_USD]]: Análisis comparativo y propuesta de unificación en CLP para Chile con referencia USD.
- [[04_Arquitectura_Comercial_Realista_y_Flywheel]]: Modelo flywheel, separación de hechos vs hipótesis, 5 vías de ingresos y proyecciones.

### Módulo 05: Embudo y Crecimiento
- [[01_Embudo_YouTube_Shorts_a_Comunidad]]: Estrategia de apalancamiento del canal `@cielosanto20` para alimentar la plataforma web.
- [[02_Motor_de_WhatsApp_y_Viralidad]]: Mecánicas para compartir versículos y peticiones por WhatsApp, impulsando el boca a boca familiar.
- [[03_Retencion_y_Email_Marketing]]: Estrategia de nutrición por correo para convertir suscriptores casuales en miembros activos del ministerio.

### Módulo 06: Roadmap y Plan Maestro
- [[01_Fase_1_Conexion_Funcional_y_DB]]: Prioridad 1: hacer el Muro de Peticiones y contador de Amén 100% operativos con persistencia en Supabase.
- [[02_Fase_2_Pasarela_Stripe_Operativa]]: Prioridad 2: activar cobros reales para capturar ofrendas y ventas del catálogo.
- [[03_Fase_3_Automatizacion_y_Comunidad]]: Prioridad 3: cron de correos matutinos a las 7:00 AM y panel de moderación.
- [[04_Backlog_Tecnico_Priorizado]]: Matriz Esfuerzo vs. Impacto con tareas listas para asignar y ejecutar.

### Módulo 99: Guías y Recursos
- [[01_Variables_de_Entorno_Template]]: Plantilla documentada de `.env.local` con todas las variables necesarias.
- [[02_Templates_de_Copywriting_y_Oraciones]]: Textos listos para correos, confirmaciones de donación y mensajes del muro.

---

## 🏷️ Nube de Etiquetas Principales

`#cielo-santo` `#nextjs16` `#react19` `#tailwind4` `#supabase` `#stripe` `#resend` `#oracion` `#devocional` `#donaciones` `#youtube-shorts` `#whatsapp-marketing` `#monetizacion-espiritual`
