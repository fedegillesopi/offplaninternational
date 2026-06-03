# Off Plan International — Product Requirements Document

**Cliente:** Off Plan International
**Proyecto:** Plataforma global de listing de propiedades Off-Plan
**Versión:** 1.0 — 03-Jun-2026
**Estado:** MVP — detalle de propiedad completado

---

## 1. CONTEXTO DEL PROYECTO

**Problema que resuelve:** Comprar propiedades Off-Plan es confuso, lento y manejado por agentes de ventas con información parcial. No existe un lugar único donde se listen unidades individuales con datos financieros completos (depósito, plan de pago, precio, fecha de entrega).

**Origen del proyecto:** Iniciativa de Off Plan International para crear un marketplace global de propiedades Off-Plan que elimine intermediarios y centralice la información.

**Mercado objetivo:** Global, con foco inicial en:
- EAU (mercado principal, default locale)
- Reino Unido
- España
- Portugal
- Brasil
- Argentina
- México

**Diferencial clave:**
- Transparencia total: datos financieros completos por unidad
- Sin agentes: contacto directo con la promotora
- Unidades individuales, no solo proyectos
- Búsqueda granular con múltiples filtros
- Multi-moneda y multi-idioma desde el día uno

---

## 2. OBJETIVOS DEL PRODUCTO

### 2.1 Objetivos principales
- Proveer un marketplace global donde inversores puedan buscar, comparar y contactar promotoras directamente
- Dar a las promotoras un canal de listing directo sin coste de intermediarios
- Centralizar información financiera completa por unidad (depósito, plan de pago, precio, fecha de entrega)
- Eliminar la fricción del proceso de compra Off-Plan

### 2.2 Indicadores de éxito del MVP
- Propiedades listadas: ≥ 100 unidades en los primeros 3 meses
- Promotoras registradas: ≥ 5 promotoras activas
- Usuarios registrados: ≥ 200 en los primeros 3 meses
- Consultas enviadas a través de la plataforma: ≥ 50 en los primeros 3 meses

---

## 3. ALCANCE DEL MVP

### 3.1 Incluye

| Feature | Rol | Estado |
|---|---|---|
| Homepage (hero, features, about, FAQ, contacto, footer) | Público | ✅ Implementado |
| Sistema i18n con 7 locales y geo-detección | Público | ✅ Implementado |
| Auth completo (login, signup, forgot/reset password, update password) | Usuario | ✅ Implementado |
| Navbar responsive con menú mobile | Público | ✅ Implementado |
| HeroHeader con búsqueda y filtros (categoría, precio, estado) | Público | ✅ Implementado |
| CurrencySwitcher con persistencia en cookie | Público | ✅ Implementado |
| Listado de propiedades con cards y filtros | Público | ✅ Implementado |
| Conversión de moneda en vivo en todas las cards | Público | ✅ Implementado |
| Página de detalle de propiedad (gallery, sidebar, details-table, amenities, payment-plan, tags, breadcrumb, related-properties) | Público | ✅ Completado |
| Página de listado de desarrollos `/development/[slug]` | Público | ❌ Pendiente |
| Página de listado de promotoras `/developer/[slug]` | Público | ❌ Pendiente |
| Página de listado de comunidades | Público | ❌ Pendiente |
| Dashboard de usuario (favoritos, consultas) | Usuario | ❌ Pendiente |
| Panel de administración para promotoras | Promotora | ❌ Pendiente |
| Mapa global con unidades geolocalizadas | Público | ❌ Pendiente |

### 3.2 Fuera de alcance del MVP
- Comparador lado a lado de propiedades
- Tour virtual / video recorrido 3D
- Calculadora de rentabilidad / ROI
- Valoraciones y reseñas de promotoras
- Pagos integrados en plataforma
- App nativa mobile (iOS / Android)
- OAuth social (Google, Apple)
- Modo offline
- CRM para promotoras

---

## 4. MODELO OPERATIVO

El sistema funciona como un **marketplace bilateral** donde:

- Las **promotoras** listan unidades individuales con datos financieros completos
- Los **inversores** buscan, filtran y contactan directamente a las promotoras
- **No hay intermediarios** — la comunicación es directa entre ambas partes
- **No hay comisiones por venta** — el modelo de ingresos futuro son planes premium de visibilidad

**Jerarquía de datos:**

```
Comunidad / Zona
  └── Desarrollo / Proyecto
        └── Promotora (Developer)
              └── Unidades (properties individuales)
```

**Flujo de valor:**

```
Promotora lista unidades → Inversor busca/filtra → Encuentra unidad
                     ↓
         Inversor envía consulta → Consulta llega a promotora
                     ↓
         Promotora contacta directamente al inversor
                     ↓
         Sin intermediarios, sin presión comercial
```

---

## 5. ROLES DEL SISTEMA

### 5.1 Inversor / Comprador
**Perfil:** Inversor o comprador final que busca propiedades Off-Plan. Local o internacional.

**Motivación inmediata:** Encontrar unidades disponibles con información financiera clara y contactar directamente a la promotora.

**Motivación diferida:** Guardar favoritos, hacer seguimiento de consultas, recibir alertas de nuevas propiedades.

**Acciones en el sistema:**
- Buscar propiedades por ubicación, categoría, precio, estado
- Ver detalle de cada propiedad
- Cambiar moneda de visualización
- Registrarse para guardar favoritos y enviar consultas
- Enviar consulta a promotora desde la ficha de propiedad
- Contactar por WhatsApp directamente

**Restricciones:**
- No puede listar propiedades
- No puede editar información de propiedades
- No accede a paneles de administración

### 5.2 Promotora / Developer
**Perfil:** Empresa desarrolladora que construye y vende propiedades Off-Plan.

**Motivación inmediata:** Listar unidades individuales y recibir consultas directas de inversores sin pagar intermediarios.

**Motivación diferida:** Panel de administración, estadísticas de consultas, gestión de inventario de unidades.

**Acciones en el sistema:**
- Listar nuevas propiedades con datos financieros
- Editar información de sus propiedades
- Ver y responder consultas recibidas
- Gestionar disponibilidad de unidades

**Restricciones:**
- No puede ver propiedades de otras promotoras (solo las propias en su panel)
- No puede actuar como inversor con la misma cuenta

---

## 6. FUNCIONALIDADES DETALLADAS

### 6.1 Homepage
- **Hero section:** título, subtítulo, campo de búsqueda y dropdowns de filtro (categoría, precio, estado)
- **Features section:** 4 cards con íconos ("Transparencia Total", "Sin Agentes", "Unidades Individuales", "Búsqueda Inteligente")
- **About section:** propuesta de valor
- **FAQ:** accordion con preguntas frecuentes
- **Contact Banner:** CTA de contacto
- **Footer:** navegación, redes sociales, copyright
- **Navbar:** menú responsive con navLinks traducidos, logo, CurrencySwitcher

### 6.2 Sistema i18n (next-intl v4)
- 7 locales activos: ae (default), ar, br, es, gb, mx, pt
- Prefijo de ruta: `as-needed` — el locale default (ae) no aparece en la URL
- Geo-detección por headers CDN (Vercel, Cloudflare, AWS)
- Cookie `NEXT_LOCALE` con persistencia de 30 días
- Traducciones en archivos `messages/{locale}.json`
- Navegación: usar `Link` y `redirect` desde `@/i18n/navigation` (no `next/link`)
- Mapeo país → locale → moneda default:
  - EAU → ae → AED | AR → ar → USD | BR → br → USD | ES → es → EUR
  - GB → gb → GBP | MX → mx → USD | PT → pt → EUR

### 6.3 Auth (Supabase)
- Método: email/password
- Flujos: registro, login, forgot password, reset password, update password
- Confirmación de email obligatoria
- Rutas protegidas via middleware: `proxy.ts` combina i18n + geo + auth
- `getUser()` server-side para verificar sesión (no `getClaims()`)
- Sin distinción de roles en MVP

### 6.4 Currency Switcher
- 4 monedas disponibles: AED, USD, EUR, GBP
- USD como default global (no por locale)
- Persistencia en cookie `NEXT_CURRENCY` por 30 días
- Conversión en vivo con tasas fijas en `lib/exchange-rates.ts` (sin API externa en MVP)
- Formato por moneda usando `Intl.NumberFormat` con locale específico
- Provider global (`CurrencyProvider`) envuelve al árbol cliente desde `[locale]/layout.tsx`
- `CurrencyPrice` component para renderizar precios con reactividad

### 6.5 Listado de propiedades
- Ruta: `/properties-list` (sin locale prefix; el middleware resuelve)
- Grid de PropertyCards con datos de cada unidad
- Barra de filtros completa: Location, Category, Price Range, Status
- "+ More Filters" expande: Beds, Baths, Developer, Amenities
- "Map View" botón (placeholder)
- Cada PropertyCard muestra: imagen, categoría (badge), camas/baños/área, precio via CurrencyPrice, ubicación con MapPin, logo del developer, descripción, botones Contact y WhatsApp
- Datos mockeados en `lib/mock-properties.ts` (3 unidades)
- Conversión de moneda en vivo al cambiar moneda global

### 6.6 Búsqueda
- Campo de búsqueda por texto en homepage
- Filtros dropdown en homepage (categoría, precio, estado)
- ⚠️ **Estado actual:** La UI de búsqueda existe pero no ejecuta acciones reales (navegación ni API call). Pendiente conectar a resultados reales.

### 6.7 Detalle de propiedad
- Ruta: `/properties/[id]` (sin locale prefix; el middleware resuelve)
- Galería de imágenes con flechas prev/next y navegación por thumbnails
- Sidebar con precio, badge de estado, botones Contact y WhatsApp en row estilo card, y links a development/developer con truncate funcional (`min-w-0` + `w-full`)
- Details table con datos clave (dormitorios, baños, área, depósito, fecha de entrega, tipo de propiedad, referencia)
- Amenities grid con modal de overlay + scroll lock
- Payment plan con tabla de hitos (milestone, percentage, amount, description)
- Tags de características
- Breadcrumb reutilizable con separador "/"
- Related properties grid (3 propiedades sugeridas)
- Traducciones `property_detail` en 7 locales
- Datos mockeados desde `lib/mock-properties.ts` con interfaz `PropertyData` compartida en `lib/types.ts`

---

## 7. ARQUITECTURA DEL SISTEMA

### 7.1 Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR, Server Components, Server Actions |
| Lenguaje | TypeScript ~5 | Strict mode |
| Base de datos | Supabase (PostgreSQL) | Auth + futura DB |
| Estilos | Tailwind CSS 3.4 + tailwindcss-animate | Design system |
| Componentes | Radix UI (Checkbox, DropdownMenu, Label, Slot) | Primitivas accesibles |
| UI utilities | clsx + tailwind-merge + class-variance-authority | Variantes y merge de clases |
| Iconos | lucide-react 0.511 | Iconografía |
| i18n | next-intl 4.12 | Internacionalización |
| Temas | next-themes 0.4 | Dark/light mode |
| Currency | Intl.NumberFormat (nativo) + tasas fijas | Formato y conversión de moneda |
| Package manager | pnpm | — |
| Linter | ESLint 9 + eslint-config-next | Calidad de código |

### 7.2 Modelo de datos

Actualmente no hay tablas propias creadas en Supabase. Solo se usa `auth.users` (gestionado por Supabase).

**Tablas pendientes de crear:**
- `properties` — unidades individuales (precio, depósito, plan de pago, fecha entrega, ubicación, imágenes)
- `developers` — promotoras (nombre, logo, descripción, contacto)
- `developments` — proyectos/desarrollos (nombre, ubicación, amenities, fecha entrega estimada)
- `communities` — comunidades/zonas
- `favorites` — favoritos del usuario
- `inquiries` — consultas de inversores a promotoras

### 7.3 Estructura de rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Homepage |
| `/properties-list` | Público | Listado de propiedades con filtros |
| `/properties/[id]` | Público | Detalle de propiedad (gallery, sidebar, details-table, amenities, payment-plan, tags, breadcrumb, related-properties) |
| `/auth/login` | Público | Login |
| `/auth/sign-up` | Público | Registro |
| `/auth/sign-up-success` | Público | Éxito de registro |
| `/auth/forgot-password` | Público | Reset de contraseña |
| `/auth/update-password` | Público | Actualizar contraseña |
| `/auth/confirm` | Público | Callback de confirmación email |
| `/auth/error` | Público | Error de autenticación |
| `/protected` | Autenticado | Página protegida (placeholder) |

### 7.4 Seguridad y acceso
- Autenticación: Supabase Auth con sesiones gestionadas por cookies
- Protección de rutas: `proxy.ts` combina i18n routing + geo-detección + auth
- `getUser()` server-side para verificar sesión (no `getClaims()`)
- Middleware de next-intl en proxy resuelve locale antes de auth
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

## 8. FLUJOS DE USUARIO DETALLADOS

### Flujo A: Inversor busca propiedades

```
1. Inversor llega a la homepage (detecta locale por cookie o geo)
2. Usa campo de búsqueda o dropdowns de filtro (categoría, precio, estado)
3. Navega a /properties-list
4. Usa filtros avanzados (location, category, price range, status, + more)
5. Explora PropertyCards con precios en su moneda
6. Puede cambiar moneda con CurrencySwitcher — todas las cards se actualizan en vivo
7. Hace clic en una card → navega a /properties/[id] (detalle de propiedad)
8. Ve gallery, details, amenities, payment plan, tags, related properties
9. Hace clic en "Contact" o WhatsApp en el detalle o sidebar
```

⚠️ El paso 2 (búsqueda en homepage) tiene UI pero no dispara navegación. Los pasos 3-6 están implementados. El paso 7 (detalle de propiedad) está implementado con gallery, sidebar, details-table, amenities-grid, payment-plan, tags, breadcrumb, related-properties. El paso 9 tiene botones pero sin acción de contacto real. Los links a development/developer en sidebar llevan a 404.

**Servicios consumidos:** CurrencyContext, Intl.NumberFormat, filter-options.ts

### Flujo B: Usuario se registra

```
1. Usuario navega a /auth/sign-up
2. Completa formulario con email y password
3. Submit → supabase.auth.signUp()
4. Supabase envía email de confirmación con link a /auth/confirm
5. Usuario confirma email
6. Redirigido a /protected
```

**Servicios consumidos:** Supabase Auth

### Flujo C: Cambio de moneda

```
1. Usuario ve moneda actual en navbar (ej: "$ USD")
2. Abre CurrencySwitcher dropdown
3. Selecciona nueva moneda (AED, USD, EUR, GBP)
4. CurrencyContext.setCurrency() escribe cookie NEXT_CURRENCY por 30 días
5. Todos los CurrencyPrice components se re-renderizan con la nueva moneda
6. convertPrice() usa tasas fijas de exchange-rates.ts
7. formatPrice() usa Intl.NumberFormat con locale específico por moneda
```

**Servicios consumidos:** CurrencyContext, exchange-rates.ts, Intl.NumberFormat

### Flujo D: Login

```
1. Usuario navega a /auth/login
2. Completa formulario con email y password
3. Submit → supabase.auth.signInWithPassword()
4. Si éxito → redirige a /protected
5. Si error → mensaje en el formulario
```

**Servicios consumidos:** Supabase Auth

---

## 9. REGLAS DE NEGOCIO

1. **La moneda por defecto es USD** (global, no por locale). El usuario puede cambiarla y persiste 30 días.
2. **Las tasas de cambio son fijas en MVP.** No se consultan APIs externas. Se actualizan manualmente en `lib/exchange-rates.ts`.
3. **Los datos de propiedades son mockeados en MVP.** No hay conexión a base de datos real. Datos en `lib/mock-properties.ts`.
4. **La búsqueda en homepage tiene UI pero no funcionalidad real.** Es placeholder visual.
5. **Los botones Contact y WhatsApp en PropertyCards y detalle de propiedad son placeholder.** No ejecutan consulta real (no hay endpoint ni conexión a DB).
6. **Las rutas `/development/[slug]` y `/developer/[slug]` no existen.** Los links desde el detalle de propiedad llevan a 404.
7. **El locale default (ae) no aparece en la URL.** Evita redirects innecesarios para EAU, mercado principal.
8. **La geo-detección funciona solo en producción** (Vercel, Cloudflare, AWS). En local se usa default locale.
9. **No hay distinción de roles en MVP.** Todos los usuarios autenticados tienen el mismo acceso.
10. **Solo email/password en MVP.** Sin OAuth social.
11. **Usar `getUser()` en vez de `getClaims()`** para verificar sesión server-side (el JWT puede estar expirado aunque los claims se decodifiquen).

---

## 10. SUPUESTOS Y RESTRICCIONES

**Supuestos:**
- Los inversores tienen acceso a internet y usan navegador web
- Las promotoras tienen capacidad técnica para listar sus unidades (o reciben asistencia)
- El mercado Off-Plan es suficientemente grande como para justificar una plataforma global
- Los inversores están dispuestos a contactar a promotoras directamente sin agente de por medio
- El locale/idioma se puede inferir por geolocalización del país de origen

**Restricciones:**
- Datos mockeados para MVP — sin base de datos propia de propiedades
- Sin mapa funcional en MVP (pendiente geolocalización)
- Sin pagos integrados en la plataforma
- Sin comparador de propiedades
- Sin app nativa mobile
- Solo email/password en auth
- Tasas de cambio fijas, no automáticas
- Sin modo offline
- Sin distinción de roles de usuario en MVP
- Las rutas `/development/[slug]` y `/developer/[slug]` no existen — los links desde detalle de propiedad dan 404
- Sin dashboard de usuario (favoritos, consultas)
- Sin panel de administración para promotoras

---

## 11. ROADMAP EVOLUTIVO

Lo que viene después del MVP validado:

### ✅ Completado
- Página de detalle de propiedad con gallery (prev/next), sidebar (truncate links, botones card-style en row), details-table, amenities-grid (modal + scroll lock), payment-plan, tags, breadcrumb, related-properties
- Traducciones `property_detail` en 7 locales
- Breadcrumb reutilizable con separador "/"
- Interfaz `PropertyData` compartida en `lib/types.ts`
- Datos mockeados (3 propiedades) para todas las secciones

### 🔜 Siguientes pasos (next-steps)
- **Corto plazo:** Crear rutas `/development/[slug]` y `/developer/[slug]` — actualmente dan 404 al navegar desde el detalle de propiedad
- **Corto plazo:** Dashboard de usuario con favoritos y consultas
- **Corto plazo:** Conectar la búsqueda de homepage a resultados reales (navegación a `/properties-list` con query params)
- **Corto plazo:** Implementar envío real de consultas Contact y WhatsApp (conectar a backend/Supabase)
- **Corto plazo:** Conectar datos de propiedades a Supabase (reemplazar mock data con queries reales)
- **Mediano plazo:** Páginas de listado de comunidades
- **Mediano plazo:** Panel de administración para promotoras (gestión de propiedades, consultas)
- **Mediano plazo:** Mapa global con unidades geolocalizadas
- **Mediano plazo:** Filtros avanzados (beds, baths, amenities, date range) — ya tienen UI pero sin datos reales
- **Largo plazo:** Comparador lado a lado de propiedades
- **Largo plazo:** Calculadora de rentabilidad / ROI
- **Largo plazo:** Valoraciones y reseñas de promotoras
- **Largo plazo:** Planes pagos para promotoras (visibilidad premium)
- **Largo plazo:** App nativa mobile (iOS / Android)
- **Largo plazo:** OAuth social (Google, Apple)

---

## 12. GLOSARIO

| Término | Definición |
|---|---|
| Off-Plan | Propiedad en venta antes de su construcción o durante la misma |
| Unidad | Propiedad individual dentro de un desarrollo (ej: departamento, villa, local) |
| Promotora / Developer | Empresa desarrolladora que construye y comercializa el proyecto |
| Desarrollo / Project | Conjunto de unidades construidas por una promotora en un mismo sitio |
| Comunidad | Zona o distrito donde se ubica un desarrollo |
| Depósito | Pago inicial requerido para reservar una unidad Off-Plan |
| Plan de pago | Esquema de pagos escalonados durante la construcción |
| Fecha de entrega | Fecha estimada en que la unidad estará lista para escriturar |
| MVP | Minimum Viable Product — versión inicial con funcionalidades esenciales |
| i18n | Internacionalización — soporte multi-idioma |
| Locale | Identificador de idioma/región (ej: ae, es, gb, br) |
| RLS | Row Level Security — mecanismo de seguridad a nivel de fila en Supabase |
