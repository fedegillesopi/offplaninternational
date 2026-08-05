# Off Plan International — Product Requirements Document

**Cliente:** Off Plan International
**Proyecto:** Plataforma global de listing de propiedades Off-Plan
**Versión:** 1.5 — 01-Ago-2026
**Estado:** MVP en desarrollo — Auth i18n completo, comunidades en DB (migración 008), ruta /app

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

**Arquitectura general:** El proyecto opera como dos experiencias integradas en un mismo dominio:
1. **Sitio público** (bajo `[locale]`): landing page, listado y detalle de propiedades, auth para inversores. Todo con i18n y geo-detección.
2. **Plataforma de vendedores** (rutas standalone): dashboard, auth con 3 roles (developer, broker, private seller), gestión de propiedades y métricas. Sin i18n (inglés por ahora).

---

## 2. OBJETIVOS DEL PRODUCTO

### 2.1 Objetivos principales
- Proveer un marketplace global donde inversores puedan buscar, comparar y contactar promotoras directamente
- Dar a promotoras, brokers y vendedores privados un canal de listing directo sin coste de intermediarios
- Centralizar información financiera completa por unidad (depósito, plan de pago, precio, fecha de entrega)
- Eliminar la fricción del proceso de compra Off-Plan

### 2.2 Indicadores de éxito del MVP
- Propiedades listadas: ≥ 100 unidades en los primeros 3 meses
- Usuarios registrados (todos los roles): ≥ 200 en los primeros 3 meses
- Consultas enviadas a través de la plataforma: ≥ 50 en los primeros 3 meses

---

## 3. ALCANCE DEL MVP

### 3.1 Incluye

| Feature | Plataforma | Estado |
|---|---|---|
| Homepage (hero, features, about, FAQ, contacto, footer) | Público | ✅ Implementado |
| Sistema i18n con 7 locales y geo-detección | Público | ✅ Implementado |
| Navbar responsive con menú mobile y CurrencySwitcher | Público | ✅ Implementado |
| HeroHeader con búsqueda y filtros (categoría, precio, estado) | Público | ✅ Implementado |
| CurrencySwitcher con persistencia en cookie (NEXT_CURRENCY) | Público | ✅ Implementado |
| Listado de propiedades con cards y filtros avanzados | Público | ✅ Implementado |
| Conversión de moneda en vivo (CurrencyPrice + CurrencyProvider) | Público | ✅ Implementado |
| Página de detalle de propiedad (gallery, sidebar, details-table, amenities, payment-plan, tags, breadcrumb, related-properties) | Público | ✅ Completado |
| Auth unificado con 3 roles (login, signup, forgot/reset password, update password, confirm email) | Todos | ✅ Implementado |
| Signup URL-driven por role: `/auth/sign-up/developer`, `/auth/sign-up/broker`, `/auth/sign-up/private-seller` | Todos | ✅ Implementado |
| Onboarding post-confirmación: `/auth/onboarding/[role]` con campos condicionales | Todos | ✅ Implementado |
| Tabla `user_profiles` en Supabase con RLS, trigger y migración desde `developer_profiles` | Todos | ✅ Implementado |
| Auth i18n: namespace `auth` traducido a 7 locales + auth components con `useTranslations` | Todos | ✅ Implementado |
| Locale-aware redirects en auth: `emailRedirectTo`, `forgot-password` redirectTo, `confirm/route.ts` con `NEXT_LOCALE` | Todos | ✅ Implementado |
| Dashboard unificado con sidebar basado en role (Developer/Broker/Private Seller) | Todos | ✅ Implementado |
| Componentes reorganizados en directorios por dominio (site/, properties/, auth/, shared/, platform/) | Frontend | ✅ Implementado |
| Template cleanup: 13 archivos eliminados (tutorial starter kit, section-cards, data-table, sidebar.tsx) | Frontend | ✅ Implementado |
| shadcn defaults restaurados: Button (h-9/h-10), Input (h-9), custom spacing eliminado | Frontend | ✅ Implementado |
| UI primitives creados: textarea.tsx, dialog.tsx (Radix UI) | Frontend | ✅ Implementado |
| Rename `/dashboard` → `/app` | Todos | ✅ Implementado |
| Sidebar reestructurada: NAV_BY_ROLE simplificado, dropdown usuario con logout | Todos | ✅ Implementado |
| Pricing plans configurados por role × país (`lib/pricing-plans.ts`) | Todos | ✅ Implementado |
| Legacy route redirects (`/login` → `/auth/login`, `/signup` → `/auth/sign-up/developer`) | Auth | ✅ Implementado |
| Fix middleware: `updateSession()` antes de `intlMiddleware()` en auth routes | Auth | ✅ Implementado |
| Tablas `developers`, `developments` en Supabase (migración 007) | Backend | ✅ Implementado |
| Tabla `properties` recreada con FKs a `developers`, `developments` y `user_profiles` (migración 007) | Backend | ✅ Implementado |
| Tabla `payment_plan_milestones` recreada con CHECK y RLS mejorado (migración 007) | Backend | ✅ Implementado |
| Interfaz `PropertyData` migrada a campos planos + nuevas interfaces `Developer`, `Development`, `PaymentPlanMilestone` | Frontend | ✅ Implementado |
| Página de listado de desarrollos `/development/[slug]` | Público | ❌ Pendiente |
| Página de listado de promotoras `/developer/[slug]` | Público | ❌ Pendiente |
| Página de listado de comunidades `/communities` (grid + búsqueda client-side, leída de Supabase) | Público | ✅ Implementado |
| Página de detalle de comunidad `/community/[slug]` (header, mapa, descripción sanitizada, info card, galería) | Público | ✅ Implementado |
| Tablas `communities` y `community_translations` en Supabase con RLS (migración 008) | Backend | ✅ Implementado |
| Seed de 42 comunidades de Dubai + 42 traducciones base (`supabase/seed/communities.sql`) | Backend | ✅ Implementado |
| Sanitizador HTML allowlist + validación de `google_map_url` (seguridad) | Frontend | ✅ Implementado |
| Dashboard de inversor (favoritos, consultas) | Inversor | ❌ Pendiente |
| Paneles específicos por role (Properties/Analytics para Developer, Listings/Clients para Broker, My Property para Private Seller) | Vendedor | ❌ Pendiente |
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

El sistema funciona como un **marketplace multilateral** con tres tipos de vendedores y una cara pública de inversores:

**Cara pública (inversores):**
- Los vendedores (developers, brokers, vendedores privados) listan unidades individuales con datos financieros completos
- Los inversores buscan, filtran y contactan directamente al vendedor
- No hay intermediarios ni comisiones por venta
- El modelo de ingresos futuro son planes premium de visibilidad para vendedores

**Cara privada (vendedores — 3 roles):**
- Los vendedores se registran eligiendo su role (Developer, Broker, o Private Seller)
- Tras confirmar email, completan un onboarding específico para su role
- Acceden a un dashboard unificado con sidebar adaptado a su role
- La tabla `user_profiles` se crea automáticamente al registrarse vía trigger de Supabase

**Modelo de pricing por role:**
- **Developer:** Planes Enterprise/Business/Professional según país ($99–$299/mes)
- **Broker:** Planes Professional/Starter según país ($49–$199/mes)
- **Private Seller:** Plan Free (hasta 3 propiedades)

**Jerarquía de datos:**

```
Comunidad / Zona
  └── Desarrollo / Proyecto
        └── Vendedor (Developer / Broker / Private Seller)
              └── Unidades (properties individuales)
```

**Flujo de valor:**

```
Vendedor lista unidades → Inversor busca/filtra → Encuentra unidad
                     ↓
         Inversor envía consulta → Consulta llega al vendedor
                     ↓
         Vendedor contacta directamente al inversor
                     ↓
         Sin intermediarios, sin presión comercial
```

---

## 5. ROLES DEL SISTEMA

### 5.1 Inversor / Comprador
**Perfil:** Inversor o comprador final que busca propiedades Off-Plan. Local o internacional.

**Motivación inmediata:** Encontrar unidades disponibles con información financiera clara y contactar directamente al vendedor.

**Motivación diferida:** Guardar favoritos, hacer seguimiento de consultas, recibir alertas de nuevas propiedades.

**Acciones en el sistema:**
- Buscar propiedades por ubicación, categoría, precio, estado
- Ver detalle de cada propiedad
- Cambiar moneda de visualización
- Registrarse para guardar favoritos y enviar consultas
- Enviar consulta al vendedor desde la ficha de propiedad
- Contactar por WhatsApp directamente

**Restricciones:**
- No puede listar propiedades
- No puede editar información de propiedades
- No accede a paneles de vendedores

### 5.2 Developer (Promotora)
**Perfil:** Empresa desarrolladora que construye y vende propiedades Off-Plan. Se registra con datos de empresa.

**Motivación inmediata:** Acceder al dashboard, listar propiedades y recibir consultas de inversores.

**Motivación diferida:** Analytics de propiedades, gestión de inventario de unidades.

**Acciones en el sistema:**
- Registrarse en `/auth/sign-up/developer` con full name, email y password
- Completar onboarding en `/auth/onboarding/developer` con: company name, company website, operating country, phone
- Acceder al dashboard con sidebar: Dashboard, Properties, Analytics, Settings
- Listar y gestionar propiedades

**Restricciones:**
- No puede ver propiedades de otros vendedores
- Campos de onboarding: company_name, company_website, operating_country (obligatorio), phone

### 5.3 Broker
**Perfil:** Intermediario inmobiliario con licencia profesional que lista propiedades de distintos desarrolladores.

**Motivación inmediata:** Acceder al dashboard, listar propiedades de sus clientes y gestionar consultas.

**Motivación diferida:** Gestión de clientes (inversores), seguimiento de leads.

**Acciones en el sistema:**
- Registrarse en `/auth/sign-up/broker` con full name, email y password
- Completar onboarding en `/auth/onboarding/broker` con: company name, company website, operating country, license number, phone
- Acceder al dashboard con sidebar: Dashboard, Listings, Clients, Settings
- Listar propiedades de distintos desarrolladores

**Restricciones:**
- Campos de onboarding: company_name, company_website, operating_country, license_number (obligatorio), phone
- license_number es obligatorio y específico del broker

### 5.4 Private Seller
**Perfil:** Propietario individual que quiere vender su propia propiedad Off-Plan o en fase de construcción.

**Motivación inmediata:** Listar su propiedad y recibir consultas directas de inversores.

**Motivación diferida:** Gestionar las consultas recibidas de su propiedad.

**Acciones en el sistema:**
- Registrarse en `/auth/sign-up/private-seller` con full name, email y password
- Completar onboarding en `/auth/onboarding/private-seller` con: country of residence, phone
- Acceder al dashboard con sidebar: Dashboard, My Property, Settings
- Listar su propiedad individual

**Restricciones:**
- Plan gratuito con hasta 3 propiedades
- Campos de onboarding: country_of_residence (obligatorio), phone
- No tiene campos de empresa (company_name, company_website, operating_country no aplican)

---

## 6. FUNCIONALIDADES DETALLADAS

### 6.1 Sitio público (bajo `[locale]`)

#### 6.1.1 Homepage
- **Hero section:** título, subtítulo, campo de búsqueda y dropdowns de filtro (categoría, precio, estado)
- **Features section:** 4 cards con íconos ("Transparencia Total", "Sin Agentes", "Unidades Individuales", "Búsqueda Inteligente")
- **About section:** propuesta de valor
- **FAQ:** accordion con preguntas frecuentes
- **Contact Banner:** CTA de contacto
- **Footer:** navegación, redes sociales, copyright
- **Navbar:** menú responsive con navLinks traducidos, logo, CurrencySwitcher

#### 6.1.2 Sistema i18n (next-intl v4)
- 7 locales activos: ae (default), ar, br, es, gb, mx, pt
- Prefijo de ruta: `as-needed` — el locale default (ae) no aparece en la URL
- Geo-detección por headers CDN (Vercel, Cloudflare, AWS)
- Cookie `NEXT_LOCALE` con persistencia de 30 días
- Traducciones en archivos `messages/{locale}.json`
- Navegación: usar `Link` y `redirect` desde `@/i18n/navigation` (no `next/link`)
- Mapeo país → locale → moneda default:
  - EAU → ae → AED | AR → ar → USD | BR → br → USD | ES → es → EUR
  - GB → gb → GBP | MX → mx → USD | PT → pt → EUR

#### 6.1.3 Auth (bajo `/[locale]/auth/`)
- Método: email/password
- Flujos: registro, login, forgot password, reset password, update password
- Confirmación de email obligatoria
- Rutas protegidas via middleware: `proxy.ts` ejecuta `updateSession()` antes de `intlMiddleware()` en rutas de auth para resolver locale correctamente
- `getUser()` server-side para verificar sesión (no `getClaims()`)
- Tras login exitoso → redirige a `/app` (standalone, sin locale prefix)
- **i18n:** Todos los formularios de auth usan `useTranslations("auth.*")` con traducciones a 7 locales (ae, ar, br, es, gb, mx, pt)
- **Locale-aware redirects:** `emailRedirectTo` (sign-up) y `redirectTo` (forgot-password) incluyen locale via `useLocale()`. `confirm/route.ts` lee cookie `NEXT_LOCALE` para redirects

#### 6.1.4 Currency Switcher
- 4 monedas disponibles: AED, USD, EUR, GBP
- USD como default global (no por locale)
- Persistencia en cookie `NEXT_CURRENCY` por 30 días
- Conversión en vivo con tasas fijas en `lib/exchange-rates.ts` (sin API externa en MVP)
- Formato por moneda usando `Intl.NumberFormat` con locale específico
- Provider global (`CurrencyProvider`) envuelve al árbol cliente desde `[locale]/layout.tsx`
- `CurrencyPrice` component para renderizar precios con reactividad

#### 6.1.5 Listado de propiedades
- Ruta: `/properties-list` (sin locale prefix; el middleware resuelve)
- Grid de PropertyCards con datos de cada unidad
- Barra de filtros completa: Location, Category, Price Range, Status
- "+ More Filters" expande: Beds, Baths, Developer, Amenities
- "Map View" botón (placeholder)
- Cada PropertyCard muestra: imagen, categoría (badge), camas/baños/área, precio via CurrencyPrice, ubicación con MapPin (city + community), logo y nombre del developer, descripción, botones Contact y WhatsApp
- Datos mockeados en `lib/mock-properties.ts` (3 unidades)
- Conversión de moneda en vivo al cambiar moneda global
- **Campos planos:** PropertyCard accede a campos planos del objeto (`developer_name`, `developer_logo`, `city`, `community`) en lugar de joins anidados

#### 6.1.6 Búsqueda
- Campo de búsqueda por texto en homepage
- Filtros dropdown en homepage (categoría, precio, estado)
- ⚠️ **Estado actual:** La UI de búsqueda existe pero no ejecuta acciones reales (navegación ni API call). Pendiente conectar a resultados reales.

#### 6.1.7 Detalle de propiedad
- Ruta: `/[locale]/property/[slug]` (con slug SEO-friendly)
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
- Secciones de desarrollo y comunidad con datos completos (nombre, área total, amenities, descripción)
- **Migración a campos planos (23-Jul-2026):** Todas las referencias a datos del developer, desarrollo y comunidad se resuelven vía campos planos en `PropertyData` (`developer_name`, `developer_slug`, `developer_logo`, `development_name`, `development_slug`, `development_total_area`, `development_amenities`, `community_name`, `community_slug`, `community_total_area`, `community_description`). RelatedProperties ahora se renderiza correctamente.

#### 6.1.8 Página de listado y detalle de comunidades

**Listado (`/[locale]/communities`):**
- Server component que consulta `getCommunities(locale)` con el Supabase server client
- `getCommunities` hace `select("*, community_translations(*)")` filtrando `is_active = true`; resuelve la traducción con fallback locale → 'ae' → primera; ordena con `localeCompare(locale)`
- `CommunitiesGrid` (client) con input de búsqueda que filtra por nombre, ciudad, location y tags (`useState`/`useMemo`); sin resultados muestra `t("communities.no_results")`
- `CommunityCard` en `components/site/` (reutilizable) linkea a `/community/{slug}` via `@/i18n/navigation`
- Namespace `communities` traducido en los 7 locales

**Detalle (`/[locale]/community/[slug]`):**
- Server component con `getCommunityBySlug(slug, locale)` (`.maybeSingle()`); si no existe o está inactiva → `notFound()`
- `CommunityHeader`: imagen destacada (placeholder con iniciales si no hay) + iframe de Google Maps si `google_map_url` pasa la validación
- Descripción HTML renderizada con `dangerouslySetInnerHTML` SIEMPRE pasando por `sanitizeHtml()` (allowlist de tags, bloqueo de scripts/iframes y neutralización de entidades)
- `CommunityInfoCard` (sticky): `average_price_range` + CTA "See properties" que apunta a `/properties-list?community={slug}` ⚠️ (ruta inexistente, ver regla 23)
- `CommunityGallery` con lightbox (navegación por teclado, scroll lock) solo si hay imágenes
- Namespace `community_detail` traducido en los 7 locales

**Datos:**
- Contenido curado en DB (importado de CSV de Webflow), no user-generated ni mock
- Seed `supabase/seed/communities.sql`: 42 comunidades de Dubai + 42 traducciones en locale `ae` (upserts idempotentes)
- `developer_id` en NULL (el CSV no traía developers); el seed no lo pisa en el `DO UPDATE`
- ⚠️ **Pendiente:** ejecutar migración 008 + seed en Supabase (sin eso, las páginas muestran vacío)

### 6.2 Auth unificado y onboarding (3 roles)

#### 6.2.1 Registro por role (URL-driven)
- **Ruta base:** `/[locale]/auth/sign-up/[role]` — cada role tiene su propia URL
- **Tabs de role:** El componente `sign-up-form.tsx` renderiza 3 tabs (Developer, Broker, Private Seller). Al hacer clic en un tab, navega a `/auth/sign-up/{role}` usando `router.push()`. No hay tabs internos — cada tab es una URL distinta.
- **Lectura del role:** `SignUpForm` lee el role de `useParams()` (`params.role`). El form inicializa `activeTab` con el role de la URL.
- **Formulario:** full name, email, password, repeat password (común a los 3 roles)
- **Submit:** `supabase.auth.signUp()` con `options.data.role = activeTab` y `full_name`. El role se guarda en `raw_user_meta_data` de Supabase.
- **Redirect post-signup:** `/auth/sign-up-success` (email de confirmación pendiente)
- **Redirect legacy:** `/[locale]/auth/sign-up` (sin role) redirige a `/auth/sign-up/developer`
- **Componente:** `components/auth/sign-up-form.tsx` (client, usa `useTranslations("auth.sign_up")`)
- **Página:** `app/[locale]/auth/sign-up/[role]/page.tsx` — layout split con imagen a la izquierda (lg) y formulario a la derecha. "Back to home" traducido via `getTranslations("auth")`

#### 6.2.2 Login unificado
- **Ruta:** `/[locale]/auth/login` — formulario con email y password
- **Componente:** `components/auth/login-form.tsx` (client, usa `useTranslations("auth.login")`, `Link` y `useRouter` de `@/i18n/navigation`)
- **Submit:** `supabase.auth.signInWithPassword()` → redirect a `/app`
- **Link a registro:** `/auth/sign-up` (redirige a `/auth/sign-up/developer`)
- **Link a forgot password:** `/auth/forgot-password`
- **Legacy route:** `(auth)/login/page.tsx` redirige a `/auth/login`

#### 6.2.3 Onboarding post-confirmación
- **Ruta:** `/[locale]/auth/onboarding/[role]`
- **Trigger:** El `confirm route handler` (`app/[locale]/auth/confirm/route.ts`) lee la cookie `NEXT_LOCALE` (fallback: `ae`), verifica el OTP con Supabase, lee `user_profiles.role` y `user_profiles.profile_completed`. Si `profile_completed === false`, redirige a `/{locale}/auth/onboarding/{role}`. Si `profile_completed === true`, redirige a `/{locale}/app`.
- **Formulario unificado con campos condicionales por role:**
  - **Developer:** company name*, company website, operating country*, phone*
  - **Broker:** company name*, company website, operating country*, license number*, phone*
  - **Private Seller:** country of residence*, phone*
  - (* = obligatorio)
- **Submit:** Actualiza `user_profiles` con los campos correspondientes + `profile_completed = true`
- **Post-submit:** Redirige a `/dashboard`
- **Países disponibles:** AE, GB, ES, PT, MX, BR, AR, ID, ME
- **Componente:** `app/[locale]/auth/onboarding/[role]/page.tsx` (client)
- **Configuración de role:** `ROLE_CONFIG` define título, ícono (lucide-react: Building2, Briefcase, User) y descripción por role

### 6.3 Dashboard unificado (rutas standalone)

#### 6.3.1 Layout del dashboard
- **Ruta:** `/app` (sin locale prefix, sin i18n)
- **Protección:** `app/app/layout.tsx` verifica sesión vía `supabase.auth.getUser()`. Sin sesión → redirect a `/auth/login`.
- **Datos del perfil:** Query a `user_profiles` selectando `full_name`, `email`, `role`. Si no hay `role` → redirect a `/auth/login`.
- **Sidebar:** `AppSidebar` renderiza navegación diferente según `role`. Layout flex simple (no usa shadcn SidebarProvider).
- **SiteHeader** con botón Publish (Plus icon) que lleva a `/app/properties/new`

#### 6.3.2 Sidebar por role (`app-sidebar.tsx`)
- **Común a todos:** Dashboard (`/app`), Properties (`/app/properties`)
- **Developer:** Dashboard, Properties, Analytics (`/app/analytics`)
- **Broker:** Dashboard, Properties, Clients (`/app/clients`)
- **Private Seller:** Dashboard, Properties
- **Settings** (`/app/settings`) en NavSecondary, común a todos
- **NavUser:** Dropdown con avatar, nombre, email y botón de logout

#### 6.3.3 Dashboard page
- Placeholder page en `/app`
- ⚠️ Las sub-rutas del sidebar (analytics, clients, settings) están definidas en la navegación pero las páginas aún no existen

#### 6.3.4 Legacy route redirects
- `(auth)/login/page.tsx` y `(auth)/signup/page.tsx` eliminadas en cleanup
- Legacy routes `/login` y `/signup` redirigen al sistema actual

### 6.4 Pricing plans (`lib/pricing-plans.ts`)

Matriz de pricing configurada por role × país:

| Role | País | Plan | Precio/mes | Moneda | Listing limit |
|---|---|---|---|---|---|
| Developer | AE | Enterprise | 299 | AED | Unlimited |
| Developer | GB | Business | 199 | GBP | Unlimited |
| Developer | ES | Business | 149 | EUR | Unlimited |
| Developer | PT | Business | 149 | EUR | Unlimited |
| Developer | MX | Professional | 99 | USD | Up to 50 |
| Developer | BR | Professional | 99 | USD | Up to 50 |
| Developer | AR | Professional | 99 | USD | Up to 50 |
| Broker | AE | Professional | 199 | AED | Unlimited |
| Broker | GB | Professional | 149 | GBP | Unlimited |
| Broker | ES | Professional | 99 | EUR | Up to 50 |
| Broker | PT | Professional | 99 | EUR | Up to 50 |
| Broker | MX | Starter | 49 | USD | Up to 20 |
| Broker | BR | Starter | 49 | USD | Up to 20 |
| Broker | AR | Starter | 49 | USD | Up to 20 |
| Private Seller | Todos | Free | 0 | USD | Up to 3 |

**Tipos TypeScript:** `UserRole = "developer" | "broker" | "private_seller"` (en `lib/types.ts`)
**Función helper:** `getPricingPlan(role, country?)` — resuelve el plan para un role y país dado. Fallback a `_default` o al primer plan disponible.

### 6.5 Fix middleware auth routes

**Problema original:** En rutas de auth (`/[locale]/auth/*`), `intlMiddleware()` se ejecutaba antes que `updateSession()`, causando que el locale no se resolviera correctamente al redirigir tras auth.

**Solución implementada en `proxy.ts`:**
- Las rutas de auth (detectadas por regex `authRouteRegex`) ejecutan `updateSession()` primero
- Si `updateSession()` retorna un redirect (status 3xx), se retorna ese redirect directamente
- Si no hay redirect, se continúa con `intlMiddleware(request)`
- Las rutas standalone (`/dashboard`, `/login`, `/signup`) siguen ejecutando solo `updateSession()`

```
Auth routes (/[locale]/auth/*):
  updateSession() → si redirect, retornarlo → sino, intlMiddleware()

Standalone routes (/dashboard, /login, /signup):
  updateSession() directamente

Otras rutas:
  intlMiddleware() directamente
```

---

## 7. ARQUITECTURA DEL SISTEMA

### 7.1 Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | Next.js 16.2.6 (App Router) | SSR, Server Components, Server Actions |
| Lenguaje | TypeScript ~5 | Strict mode |
| Base de datos | Supabase (PostgreSQL) | Auth + tablas user_profiles, developers, developments, properties, payment_plan_milestones, communities, community_translations |
| Estilos | Tailwind CSS 3.4 + tailwindcss-animate | Design system |
| Componentes UI | Radix UI (shadcn-style): sidebar, sheet, dialog, drawer, select, tabs, table, avatar, separator, skeleton, chart | Primitivas accesibles |
| Tabla de datos | @tanstack/react-table 8.21 | Tabla con sorting, filtering, pagination |
| Drag & drop | @dnd-kit/core, sortable, modifiers, utilities | Reordenación de filas en DataTable |
| Gráficos | recharts 3.8 | Gráfico de área en drawer de DataTable |
| Notificaciones | sonner 2.0 | Toasts en DataTable |
| Drawer mobile | vaul 1.1 | Drawer responsive en DataTable |
| Iconos | lucide-react 0.511 + @tabler/icons-react 3.44 | Iconografía |
| i18n | next-intl 4.12 | Internacionalización |
| Temas | next-themes 0.4 | Dark/light mode |
| Validación | zod 4.4 | Schema de datos en DataTable |
| Currency | Intl.NumberFormat (nativo) + tasas fijas | Formato y conversión de moneda |
| Package manager | pnpm | — |
| Linter | ESLint 9 + eslint-config-next | Calidad de código |

### 7.2 Modelo de datos

#### 7.2.1 Tablas de Supabase Auth (gestionadas por Supabase)
- `auth.users` — usuarios del sistema
- `auth.sessions` — sesiones activas

#### 7.2.2 Tabla: user_profiles (tabla principal de perfiles)
Creada via migración `002_user_profiles.sql`. Reemplaza a `developer_profiles` como tabla principal.

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, FK → auth.users(id) ON DELETE CASCADE | ID del usuario |
| role | text | NOT NULL, CHECK ('developer', 'broker', 'private_seller') | Rol del usuario en la plataforma |
| full_name | text | NOT NULL (default '') | Nombre completo |
| email | text | NOT NULL | Email del usuario |
| phone | text | NOT NULL (default '') | Número de teléfono |
| company_name | text | NOT NULL (default '') | Nombre de la empresa (developer/broker) |
| company_website | text | NOT NULL (default '') | Website de la empresa (developer/broker) |
| operating_country | text | NOT NULL (default '') | Código ISO 2 letras del país de operación (developer/broker) |
| license_number | text | NOT NULL (default '') | Número de licencia profesional (broker) |
| country_of_residence | text | NOT NULL (default '') | País de residencia (private_seller) |
| profile_completed | boolean | NOT NULL (default false) | Si el usuario completó el onboarding |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de última actualización |

**Políticas RLS:**
- SELECT: solo el propio usuario puede leer su perfil (`auth.uid() = id`)
- INSERT: solo el propio usuario puede insertar su perfil (`auth.uid() = id`)
- UPDATE: solo el propio usuario puede actualizar su perfil (`auth.uid() = id`)

**Triggers:**
- `trigger_set_updated_at_user_profiles`: actualiza `updated_at` automáticamente en cada UPDATE
- `handle_new_user()`: al crear un usuario en `auth.users`, inserta automáticamente un registro en `user_profiles` con `id`, `email`, `role` (desde `raw_user_meta_data->>'role'`, default 'developer') y campos vacíos

**Migración de datos:** La migración 002 migra registros existentes de `developer_profiles` → `user_profiles` con `role = 'developer'` y `profile_completed` basado en si `company_name` no está vacío. La tabla `developer_profiles` se mantiene intacta (no se elimina).

#### 7.2.3 Tabla: developers

Creada por migración `007_developers_developments_properties_rebuild.sql`.

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del developer |
| name | text | NOT NULL | Nombre de la promotora |
| slug | text | NOT NULL, UNIQUE | Slug único |
| logo_url | text | nullable | URL del logo |
| website | text | nullable | Sitio web |
| description | text | nullable | Descripción |
| country | text | nullable | País de operación |
| is_verified | boolean | NOT NULL DEFAULT false | Developer verificado |
| user_profile_id | uuid | FK → user_profiles(id) ON DELETE SET NULL | Perfil de usuario asociado |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de última actualización |

**Índices:** `slug`, `user_profile_id`, `country`
**Trigger:** `trigger_set_updated_at_developers`
**Políticas RLS:**
- SELECT público: developers verificados (`is_verified = true`)
- SELECT propio: developer ve su propio registro (`auth.uid() = user_profile_id`)
- No hay INSERT/UPDATE desde cliente (solo service_role)

#### 7.2.4 Tabla: developments

Creada por migración `007_developers_developments_properties_rebuild.sql`.

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del desarrollo |
| name | text | NOT NULL | Nombre del desarrollo |
| slug | text | NOT NULL, UNIQUE | Slug único |
| developer_id | uuid | FK → developers(id) ON DELETE SET NULL | Developer asociado |
| description | text | nullable | Descripción |
| country | text | nullable | País |
| city | text | nullable | Ciudad |
| community | text | nullable | Zona o barrio |
| cover_image | text | nullable | Imagen principal |
| images | text[] | nullable | Lista de imágenes |
| amenities | text[] | nullable | Amenities del desarrollo |
| handover_date | date | nullable | Fecha estimada de entrega |
| is_active | boolean | NOT NULL DEFAULT true | Desarrollo activo |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de última actualización |

**Índices:** `slug`, `developer_id`, `country`, `city`
**Trigger:** `trigger_set_updated_at_developments`
**Políticas RLS:**
- SELECT público: developments activos (`is_active = true`)

#### 7.2.5 Tabla: properties

Creada por migración `007_developers_developments_properties_rebuild.sql` (reemplaza 003).

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID de la propiedad |
| listed_by_id | uuid | NOT NULL, FK → user_profiles(id) ON DELETE CASCADE | ID del vendedor |
| listed_by_type | text | NOT NULL, CHECK IN ('developer', 'broker', 'private_seller') | Tipo de vendedor |
| developer_id | uuid | FK → developers(id) ON DELETE SET NULL | Developer constructor (opcional) |
| development_id | uuid | FK → developments(id) ON DELETE SET NULL | Desarrollo/proyecto (opcional) |
| status | text | NOT NULL DEFAULT 'available', CHECK IN ('available', 'sold', 'reserved', 'off_market') | Estado |
| country | text | NOT NULL | País |
| city | text | NOT NULL | Ciudad |
| community | text | nullable | Zona o barrio |
| address | text | nullable | Dirección |
| title | text | NOT NULL | Título |
| slug | text | NOT NULL, UNIQUE(listed_by_id, slug) | Slug único por seller |
| description | text | nullable | Descripción |
| property_type | text | NOT NULL, CHECK IN ('apartment', 'villa', 'townhouse', 'penthouse', 'duplex') | Tipo |
| bedrooms | integer | nullable | Dormitorios |
| bathrooms | integer | nullable | Baños |
| area_sqft | numeric | nullable | Área en pies cuadrados |
| area_sqm | numeric | nullable | Área en metros cuadrados |
| floor | integer | nullable | Piso |
| has_balcony | boolean | DEFAULT false | Tiene balcón |
| has_garden | boolean | DEFAULT false | Tiene jardín |
| price | numeric | NOT NULL | Precio |
| currency | text | NOT NULL DEFAULT 'USD', CHECK IN ('AED', 'USD', 'EUR', 'GBP') | Moneda |
| deposit_percentage | numeric | nullable | Porcentaje de depósito |
| deposit_amount | numeric | nullable | Monto del depósito |
| has_post_handover | boolean | DEFAULT false | Tiene plan post-entrega |
| handover_date | date | nullable | Fecha de entrega |
| payment_plan_months | integer | nullable | Meses del plan de pago |
| amenities | text[] | nullable | Lista de amenities |
| images | text[] | nullable | URLs de imágenes |
| cover_image | text | nullable | URL de imagen principal |
| tags | text[] | nullable | Tags |
| is_featured | boolean | DEFAULT false | Propiedad destacada |
| is_active | boolean | DEFAULT true | Propiedad activa |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de última actualización |

**Índices:**
- Simples: `listed_by_id`, `listed_by_type`, `developer_id`, `development_id`, `status`, `country`, `city`, `property_type`, `is_active`
- Compuesto: `(listed_by_id, is_active)` — query del dashboard

**Trigger:** `set_updated_at_properties`
**Políticas RLS:**
- SELECT público: propiedades activas (`is_active = true`)
- SELECT privado: seller ve todas sus propiedades (`auth.uid() = listed_by_id`)
- INSERT: seller inserta sus propiedades, verificando `listed_by_type = role`
- UPDATE/DELETE: solo seller dueño

#### 7.2.6 Tabla: payment_plan_milestones

Creada por migración `007_developers_developments_properties_rebuild.sql` (reemplaza 004).

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del hito |
| property_id | uuid | NOT NULL, FK → properties(id) ON DELETE CASCADE | ID de la propiedad |
| milestone_name | text | NOT NULL | Nombre del hito (ej: 'On Booking') |
| percentage | numeric | NOT NULL, CHECK (>= 0 AND <= 100) | Porcentaje del total |
| amount | numeric | nullable | Monto en moneda de la propiedad |
| due_date | date | nullable | Fecha de vencimiento |
| description | text | nullable | Descripción |
| sort_order | integer | NOT NULL DEFAULT 0 | Orden de los hitos |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |

**Índice:** `property_id`
**Políticas RLS:**
- SELECT público: milestones de propiedades activas
- INSERT/UPDATE/DELETE: seller dueño de la propiedad (check vía subquery a properties)

#### 7.2.7 Tabla: communities (contenido curado)

Creada por migración `supabase/migrations/008_communities.sql`. Contenido importado de CSV de Webflow — no es user-generated.

**Índices:** `slug`, `country`, `city`, `developer_id`, `is_active`
**Trigger:** `trigger_set_updated_at_communities` (idempotente con `DROP TRIGGER IF EXISTS`)
**Políticas RLS:**
- SELECT público: comunidades activas (`is_active = true`)
- No hay INSERT/UPDATE desde cliente (contenido curado, solo service_role/seed)

#### 7.2.8 Tabla: community_translations

Creada por migración `supabase/migrations/008_communities.sql`. Una fila por comunidad y locale.

**Constraints:** `UNIQUE (community_id, locale)`
**Índices:** `community_id`, `locale`
**Trigger:** `trigger_set_updated_at_community_translations` (idempotente)
**Políticas RLS:**
- SELECT público: solo traducciones de comunidades activas (subquery a `communities.is_active`)

#### 7.2.9 Interfaces TypeScript

Definidas en `lib/types.ts` (las de comunidades en `lib/communities.ts`):

```typescript
// --- Tipos base ---
type UserRole = "developer" | "broker" | "private_seller";
type PropertyStatus = "available" | "sold" | "reserved" | "off_market";
type PropertyType = "apartment" | "villa" | "townhouse" | "penthouse" | "duplex";
type PropertyCurrency = "AED" | "USD" | "EUR" | "GBP";

// --- Tabla developers ---
interface Developer {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  country: string | null;
  is_verified: boolean;
  user_profile_id: string | null;
  created_at: string;
  updated_at: string;
}

// --- Tabla developments ---
interface Development {
  id: string;
  name: string;
  slug: string;
  developer_id: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  community: string | null;
  cover_image: string | null;
  images: string[] | null;
  amenities: string[] | null;
  handover_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Tabla payment_plan_milestones ---
interface PaymentPlanMilestone {
  id: string;
  property_id: string;
  milestone_name: string;
  percentage: number;
  amount: number | null;
  due_date: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

// --- Tabla communities (definida en lib/communities.ts) ---
interface Community {
  id: string;
  slug: string;
  country: string | null;
  city: string | null;
  location: string | null;
  average_price_range: string | null;
  highlight_image: string | null;
  images: string[] | null;
  tags: string[] | null;
  google_map_url: string | null;
  developer_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Tabla user_profiles ---
interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  company_website: string;
  operating_country: string;
  license_number: string;
  country_of_residence: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

// --- Tabla properties (con campos planos joined) ---
interface PropertyData {
  // Identificación
  id: string;
  slug: string;
  title: string;
  description: string;
  descriptionFull: string;

  // Relaciones (FKs)
  listed_by_id: string;
  listed_by_type: UserRole;
  developer_id: string | null;
  development_id: string | null;

  // Ubicación
  status: PropertyStatus;
  country: string;
  city: string;
  community: string;
  address: string | null;

  // Características físicas
  property_type: PropertyType;
  category: string;
  subcategory: string;
  beds: number;
  baths: number;
  area: number;
  area_sqft: number | null;
  area_sqm: number | null;
  floor: number | null;
  has_balcony: boolean;
  has_garden: boolean;

  // Financiero
  price: number;
  currency: PropertyCurrency;
  deposit_percentage: number | null;
  deposit_amount: number | null;

  // Entrega y plan de pago
  has_post_handover: boolean;
  handover_date: string | null;
  handoverDate: string;
  payment_plan_months: number | null;

  // Multimedia y amenities
  images: string[];
  cover_image: string | null;
  amenities: string[];
  tags: string[];

  // Metadata
  is_featured: boolean;
  is_active: boolean;
  addedOn: string;
  created_at: string;
  updated_at: string;

  // Campos planos (joined desde developers, developments, communities)
  developer_name: string;
  developer_slug: string;
  developer_logo: string;
  development_name: string;
  development_slug: string;
  development_total_area: number;
  development_amenities: string[];
  community_name: string;
  community_slug: string;
  community_total_area: number;
  community_description: string;

  // Plan de pago (objeto legacy para UI)
  paymentPlan: {
    length: string;
    depositPercentage: string;
    depositValue: string;
    description: string;
  };

  // Contacto
  phone: string;
  whatsapp: string;
}
```

**Patrón de campos planos:** `PropertyData` incluye tanto los campos propios de la tabla `properties` como campos "joined" que replican datos de las tablas `developers`, `developments` y `communities`. Esto evita joins en tiempo de render y simplifica el acceso en componentes Server. Cuando se conecte a Supabase real, se resolverán vía `select` con joins o vía vistas materializadas.

#### 7.2.10 Tablas con datos migrados
- `subscriptions` — suscripciones por usuario (inactiva en beta, preparada para Stripe) — migración 006
- Storage bucket `property-images` — imágenes de propiedades (público, 5MB, folder-based RLS) — migración 005

#### 7.2.11 Tablas legacy
- `developer_profiles` — reemplazada por `user_profiles` (migración 002). Se mantiene por retrocompatibilidad.
- `properties` (v003) — reemplazada por la versión 007 con FKs a `developers`, `developments` y `user_profiles`
- `payment_plan_milestones` (v004) — reemplazada por la versión 007 con CHECK en percentage y RLS mejorado

#### 7.2.12 Tablas pendientes de crear
- `favorites` — favoritos del inversor
- `inquiries` — consultas de inversores a vendedores

### 7.3 Estructura de rutas

#### Sitio público (con i18n)

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Homepage |
| `/[locale]` | Público | Homepage con locale |
| `/[locale]/properties-list` | Público | Listado de propiedades con filtros |
| `/[locale]/property/[slug]` | Público | Detalle de propiedad |
| `/[locale]/communities` | Público | Listado de comunidades (DB + búsqueda client) |
| `/[locale]/community/[slug]` | Público | Detalle de comunidad (descripción sanitizada, mapa, galería) |
| `/[locale]/auth/login` | Público | Login unificado |
| `/[locale]/auth/sign-up/[role]` | Público | Registro por role (developer/broker/private-seller) |
| `/[locale]/auth/sign-up` | Público | Redirect a `/auth/sign-up/developer` |
| `/[locale]/auth/forgot-password` | Público | Reset de contraseña |
| `/[locale]/auth/update-password` | Público | Actualizar contraseña |
| `/[locale]/auth/confirm` | Público | Callback de confirmación email → onboarding o dashboard |
| `/[locale]/auth/onboarding/[role]` | Autenticado | Onboarding post-confirmación por role |
| `/[locale]/auth/error` | Público | Error de autenticación |
| `/[locale]/auth/sign-up-success` | Público | Éxito de registro |
| `/[locale]/protected` | Autenticado | Página protegida inversor (placeholder) |

#### Plataforma de vendedores (sin i18n)

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Público | Redirect a `/auth/login` |
| `/signup` | Público | Redirect a `/auth/sign-up/developer` |
| `/app` | Autenticado | Dashboard unificado con sidebar según role |
| `/app/settings` | Autenticado | Configuración (placeholder en sidebar) |
| `/app/properties` | Autenticado | Listado de propiedades del seller |
| `/app/properties/new` | Autenticado | Publicar nueva propiedad (wizard multi-step) |
| `/app/analytics` | Developer | Analytics (pendiente) |
| `/app/clients` | Broker | Clientes (pendiente) |

### 7.4 Seguridad y acceso

- **Autenticación:** Supabase Auth con sesiones gestionadas por cookies
- **Middleware unificado:** `proxy.ts` combina:
  - next-intl locale routing (público)
  - Geo-detección (público)
  - Auth middleware para rutas protegidas y dashboard
- **Fix auth routes:** En `proxy.ts`, las rutas de auth ejecutan `updateSession()` antes de `intlMiddleware()` para resolver el locale correctamente antes de redirigir
- **Protección del dashboard:** `updateSession()` en `lib/supabase/middleware.ts` verifica sesión en `/app/*`. Si no hay usuario, redirige a `/auth/login`. Si hay usuario en `/auth/login` o `/auth/sign-up`, redirige a `/app`.
- **Protección del sitio público:** `updateSession()` también protege `/[locale]/protected` y `/[locale]/auth/*` (excepto rutas públicas como login, sign-up, forgot-password, etc.)
- **Onboarding gate:** El confirm route handler lee la cookie `NEXT_LOCALE` y `user_profiles.profile_completed`. Si es `false`, redirige a `/{locale}/auth/onboarding/{role}`. Si es `true`, redirige a `/{locale}/app`.
- **Verificación de sesión:** `getUser()` server-side (no `getClaims()`) — el JWT puede estar expirado aunque los claims se decodifiquen
- **Variables de entorno:** `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **RLS en user_profiles:** cada usuario solo puede leer/escribir su propio perfil
- **RLS en developers:** público para verificados, propio para el developer dueño
- **RLS en developments:** público para activos
- **RLS en properties:** público para activos, propio para el seller dueño
- **RLS en payment_plan_milestones:** público para propiedades activas, propio vía subquery a properties
- **RLS en communities:** SELECT público solo comunidades activas; sin INSERT/UPDATE/DELETE desde cliente (contenido curado, solo service_role/seed)
- **RLS en community_translations:** SELECT público solo traducciones de comunidades activas
- **Sanitización HTML:** descripciones de comunidades se renderizan con `dangerouslySetInnerHTML` solo tras `sanitizeHtml()` (allowlist de tags, bloqueo de scripts/iframes y neutralización de entidades) — `lib/sanitize-html.ts`
- **Validación de `google_map_url`:** solo se renderiza el iframe si el host es `google.com/maps` y el path empieza con `/maps/`; iframe con `sandbox` + `referrerPolicy="no-referrer"` para reducir la superficie de ataque
- **Role en Supabase Auth:** El role se guarda en `raw_user_meta_data` del usuario al registrarse (`options.data.role`). El trigger `handle_new_user()` lo lee con `coalesce(new.raw_user_meta_data->>'role', 'developer')`.

---

## 8. FLUJOS DE USUARIO DETALLADOS

### Flujo A: Inversor busca propiedades (sitio público)

```
1. Inversor llega a la homepage (detecta locale por cookie o geo)
2. Usa campo de búsqueda o dropdowns de filtro (categoría, precio, estado)
3. Navega a /properties-list
4. Usa filtros avanzados (location, category, price range, status, + more)
5. Explora PropertyCards con precios en su moneda
6. Puede cambiar moneda con CurrencySwitcher — todas las cards se actualizan en vivo
7. Hace clic en una card → navega a /[locale]/property/[slug] (detalle de propiedad)
8. Ve gallery, details, amenities, payment plan, tags, related properties
9. Hace clic en "Contact" o WhatsApp en el detalle o sidebar
```

⚠️ El paso 2 (búsqueda en homepage) tiene UI pero no dispara navegación. El paso 9 tiene botones pero sin acción de contacto real. Los links a development/developer en sidebar llevan a 404.

**Servicios consumidos:** CurrencyContext, Intl.NumberFormat, filter-options.ts

### Flujo B: Usuario se registra con un role

```
1. Usuario navega a /auth/sign-up/developer (o /broker, o /private-seller)
2. Ve 3 tabs (Developer, Broker, Private Seller) — el tab activo corresponde a la URL. Labels traducidos via useTranslations("auth.sign_up")
3. Si cambia de tab, navega a /auth/sign-up/{nuevo-role} (URL cambia)
4. Completa formulario: full name, email, password, repeat password
5. Submit → supabase.auth.signUp() con options.data.role = activeTab y emailRedirectTo = ${origin}/${locale}/auth/confirm
6. Trigger handle_new_user() crea registro en user_profiles con role, email y campos vacíos
7. Redirige a /auth/sign-up-success (email de confirmación pendiente)
8. Usuario confirma email → /[locale]/auth/confirm route handler lee cookie NEXT_LOCALE
```

**Servicios consumidos:** Supabase Auth, user_profiles (trigger)

### Flujo C: Onboarding post-confirmación

```
1. Confirm route handler lee cookie NEXT_LOCALE (fallback: ae)
2. Verifica OTP con supabase.auth.verifyOtp()
3. Lee user_profiles.role y user_profiles.profile_completed
4. Si profile_completed === false → redirect a /{locale}/auth/onboarding/{role}
5. Si profile_completed === true → redirect a /{locale}/app
6. Onboarding page muestra formulario con campos condicionales:
   - Developer: company name*, company website, operating country*, phone*
   - Broker: company name*, company website, operating country*, license number*, phone*
   - Private Seller: country of residence*, phone*
7. Submit → actualiza user_profiles con campos + profile_completed = true
8. Redirige a /app
```

**Servicios consumidos:** Supabase Auth (verifyOtp), user_profiles (select + update)

### Flujo D: Login de vendedor

```
1. Usuario navega a /auth/login (o /login que redirige aquí). Textos traducidos via useTranslations("auth.login")
2. Completa formulario con email y password
3. Submit → supabase.auth.signInWithPassword()
4. Si éxito → redirige a /app
5. App layout: getUser() → user_profiles query (full_name, email, role)
6. AppSidebar renderiza navegación según role
7. Si error → mensaje en el formulario
8. Si usuario ya autenticado visita /login o /signup → middleware redirige a /app
```

**Servicios consumidos:** Supabase Auth, user_profiles (RLS)

### Flujo E: Cambio de moneda (sitio público)

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

### Flujo F: Sidebar adaptativo por role

```
1. App layout carga perfil de user_profiles (incluye role)
2. AppSidebar selecciona navegación de NAV_BY_ROLE:
   - Todos: Dashboard (/app), Properties (/app/properties)
   - Developer: + Analytics
   - Broker: + Clients
3. NavSecondary muestra Settings (común a todos)
4. NavUser muestra dropdown con avatar, nombre, email y botón de logout
```

### Flujo G: Navegación de comunidades (listado + detalle)

```
1. Usuario navega a /[locale]/communities
2. communities/page.tsx (server) llama a getCommunities(locale): select("*, community_translations(*)") filtrando is_active = true
3. Se resuelve la traducción con fallback locale → 'ae' → primera y se ordena con localeCompare(locale)
4. CommunitiesGrid (client) filtra por texto (nombre, ciudad, location, tags) con useState/useMemo
5. Clic en CommunityCard → /community/{slug} (via @/i18n/navigation)
6. community/[slug]/page.tsx llama a getCommunityBySlug(slug, locale) con .maybeSingle(); si no existe o está inactiva → notFound()
7. Descripción HTML se sanitiza con sanitizeHtml() antes de dangerouslySetInnerHTML
8. CommunityHeader renderiza imagen destacada + iframe de Google Maps (si google_map_url validada)
9. CommunityInfoCard muestra average_price_range y CTA "See properties" → /properties-list?community={slug} ⚠️ (ruta inexistente)
```

**Servicios consumidos:** Supabase server client, `lib/communities.ts`, `lib/sanitize-html.ts`

---

## 9. REGLAS DE NEGOCIO

1. **La moneda por defecto es USD** (global, no por locale). El usuario puede cambiarla y persiste 30 días.
2. **Las tasas de cambio son fijas en MVP.** No se consultan APIs externas. Se actualizan manualmente en `lib/exchange-rates.ts`.
3. **Los datos de propiedades del sitio público son mockeados en MVP.** No hay conexión a base de datos real. Datos en `lib/mock-properties.ts`.
4. **La búsqueda en homepage tiene UI pero no funcionalidad real.** Es placeholder visual.
5. **Los botones Contact y WhatsApp en PropertyCards y detalle de propiedad son placeholder.** No ejecutan consulta real (no hay endpoint ni conexión a DB).
6. **Las rutas `/development/[slug]` y `/developer/[slug]` no existen.** Los links desde el detalle de propiedad llevan a 404.
7. **El locale default (ae) no aparece en la URL.** Evita redirects innecesarios para EAU, mercado principal.
8. **La geo-detección funciona solo en producción** (Vercel, Cloudflare, AWS). En local se usa default locale.
9. **Solo email/password en MVP.** Sin OAuth social.
10. **Usar `getUser()` en vez de `getClaims()`** para verificar sesión server-side (el JWT puede estar expirado aunque los claims se decodifiquen).
11. **El dashboard y sus componentes (SectionCards, DataTable) usan datos mockeados.** Son placeholder visual.
12. **Las sub-rutas del dashboard (properties, analytics, listings, clients, my-property) están definidas en la navegación del sidebar pero las páginas aún no existen.** Al navegar darán 404.
13. **La tabla `user_profiles` se crea automáticamente al registrarse** vía trigger `handle_new_user()`. El role se extrae de `raw_user_meta_data->>'role'` (default: 'developer'). El onboarding se completa post-confirmación de email.
14. **El middleware de auth para el dashboard es independiente del i18n.** Las rutas `/app`, `/login` y `/signup` no tienen locale prefix y no pasan por next-intl.
15. **El confirm route handler lee la cookie `NEXT_LOCALE`** para determinar el locale del usuario antes de redirigir. Fallback: `ae`.
16. **Los pricing plans están configurados pero no se aplican.** Son referencia para futura implementación de planes pagos.
17. **El role se almacena en dos lugares:** `raw_user_meta_data` de Supabase Auth (al registrarse) y `user_profiles.role` (tabla propia). El confirm route handler y el app layout leen de `user_profiles`.
18. **Los componentes usan campos planos para acceder a datos de tablas relacionadas.** `PropertyData` incluye campos "joined" (`developer_name`, `development_name`, etc.) que replican datos de `developers` y `developments`. Cuando se conecte a Supabase real, se resolverán vía `select` con joins o vistas materializadas.
19. **Auth forms están completamente traducidos.** Namespace `auth` en `messages/{locale}.json` con secciones: login, sign_up, forgot_password, update_password, back_to_home. Auth components usan `useTranslations("auth.*")`.
20. **emailRedirectTo y redirectTo incluyen locale.** El sign-up form usa `useLocale()` para construir `${origin}/${locale}/auth/confirm`. El forgot-password form usa el mismo patrón para `${origin}/${locale}/auth/update-password`.
21. **Componentes organizados por dominio.** `site/` (público), `properties/` (listado/detalle), `auth/` (formularios), `shared/` (currency), `platform/` (dashboard). `ui/` solo primitivas shadcn.
22. **La ruta del dashboard es `/app`** (no `/dashboard`). Rename realizado para simplificar.
23. **El CTA "See properties" del detalle de comunidad apunta a `/properties-list?community={slug}`, ruta inexistente.** La lista real es `/properties` y no lee query params. ⚠️
24. **Las comunidades son contenido curado en DB, no user-generated.** Solo se escriben vía migración/seed (service_role). No hay INSERT/UPDATE desde cliente.
25. **Las traducciones de comunidades se resuelven con fallback locale → 'ae' → primera disponible.** Hoy solo existe la fila base 'ae' (inglés en todos los locales); las traducciones se agregan por fila en `community_translations`, no en los mensajes.
26. **`developer_id` en communities está NULL** (el CSV de Webflow no traía developers). El seed no lo pisa en el `DO UPDATE`. El bloque "Main Developer" se reimplementará cuando haya datos.
27. **Las descripciones de comunidades usan `dangerouslySetInnerHTML` solo tras `sanitizeHtml()`.** No aplicar a contenido user-generated.
28. **Los iframes de Google Maps se renderizan solo si la URL pasa la validación** (host `google.com/maps` + path `/maps/`), con `sandbox` y `referrerPolicy="no-referrer"`.
29. **La migración 008 + seed de communities requieren ejecución manual en Supabase** (SQL Editor). Hasta entonces, las páginas de communities muestran vacío.

---

## 10. SUPUESTOS Y RESTRICCIONES

**Supuestos:**
- Los inversores tienen acceso a internet y usan navegador web
- Los vendedores (developers, brokers, private sellers) tienen capacidad técnica para listar sus unidades (o reciben asistencia)
- El mercado Off-Plan es suficientemente grande como para justificar una plataforma global
- Los inversores están dispuestos a contactar a vendedores directamente sin agente de por medio
- El locale/idioma se puede inferir por geolocalización del país de origen

**Restricciones:**
- Datos de propiedades mockeados para MVP — las tablas `developers`, `developments`, `properties` y `payment_plan_milestones` existen en Supabase pero la UI pública aún no las consulta; las comunidades sí se leen de DB (migración 008 + seed)
- Sin mapa funcional en MVP (pendiente geolocalización)
- Sin pagos integrados en la plataforma
- Sin comparador de propiedades
- Sin app nativa mobile
- Solo email/password en auth
- Tasas de cambio fijas, no automáticas
- Sin modo offline
- Las rutas `/development/[slug]` y `/developer/[slug]` no existen
- Sin dashboard de inversor (favoritos, consultas)
- Los botones de contacto (WhatsApp, Phone) no ejecutan acciones reales
- El dashboard y su tabla de datos usan datos de relleno (no son propiedades reales)
- Las sub-rutas del sidebar del dashboard (analytics, clients, settings) no tienen páginas implementadas
- Los pricing plans están configurados pero no se cobran ni se aplican
- La ruta `/app` no tiene page.tsx funcional (solo placeholder)
- La migración 008 + seed de communities no están ejecutadas en producción (requieren SQL Editor manual)
- Las traducciones de comunidades solo existen en locale 'ae' (el contenido se muestra en inglés en todos los locales)
- El CTA "See properties" de comunidades apunta a una ruta inexistente (`/properties-list?community={slug}`)

---

## 11. ROADMAP EVOLUTIVO

### ✅ Completado
- Homepage completa con hero, features, about, FAQ, contacto, footer
- Sistema i18n completo con 7 locales, geo-detección y routing as-needed
- Auth completo con 3 roles (developer, broker, private seller)
- Signup URL-driven por role con tabs y navegación
- Onboarding post-confirmación con campos condicionales por role
- Tabla `user_profiles` con RLS, triggers y migración desde `developer_profiles`
- CurrencySwitcher con persistencia y conversión en vivo
- Listado de propiedades con filtros avanzados
- Página de detalle de propiedad con gallery, sidebar, details-table, amenities-grid (modal + scroll lock), payment-plan, tags, breadcrumb, related-properties
- Traducciones `property_detail` en 7 locales
- Interfaz `PropertyData` y `UserProfile` en `lib/types.ts`
- Datos mockeados (3 propiedades) para todas las secciones
- Dashboard unificado con sidebar adaptativo por role
- Legacy route redirects (`/login`, `/signup`)
- Fix middleware auth routes (updateSession antes de intlMiddleware)
- Pricing plans configurados por role × país
- Confirm route handler con onboarding gate
- Tablas `developers`, `developments` creadas en Supabase (migración 007)
- Tabla `properties` recreada con FKs a `developers`, `developments` y `user_profiles` (migración 007, reemplaza 003)
- Tabla `payment_plan_milestones` recreada con CHECK en percentage (0-100) y RLS con ownership check vía subquery (migración 007, reemplaza 004)
- Función `trigger_set_updated_at()` renombrada a `trigger_set_updated_at_user_profiles()` para evitar conflictos de nombres
- Interfaz `PropertyData` migrada a campos planos: `developer_name`, `developer_slug`, `developer_logo`, `development_name`, `development_slug`, `development_total_area`, `development_amenities`, `community_name`, `community_slug`, `community_total_area`, `community_description`
- Nuevas interfaces TypeScript: `Developer`, `Development`, `PaymentPlanMilestone`
- Nuevos tipos TypeScript: `PropertyStatus`, `PropertyType`, `PropertyCurrency`
- `property-card.tsx` migrado a campos planos (`developer_name`, `developer_logo`, `city`, `community`)
- Detalle de propiedad migrado a campos planos (todas las referencias anidadas eliminadas)
- `RelatedProperties` se renderiza correctamente
- Auth i18n: namespace `auth` traducido a 7 locales (login, sign-up, forgot-password, update-password, back_to_home)
- Auth components actualizados con `useTranslations("auth.*")`
- Role labels traducidos en sign-up form
- `emailRedirectTo` y `forgot-password` redirectTo incluyen locale
- `confirm/route.ts` lee cookie `NEXT_LOCALE` para redirects locale-aware
- Componentes reorganizados en directorios por dominio (site/, properties/, auth/, shared/, platform/)
- Template cleanup: 13 archivos eliminados (tutorial starter kit, section-cards, data-table, sidebar.tsx)
- Route group `(auth)/` eliminada
- shadcn defaults restaurados: Button (h-9/h-10), Input (h-9), custom spacing eliminado
- UI primitives creados: textarea.tsx, dialog.tsx
- Rename `/dashboard` → `/app`
- Sidebar reestructurada: NAV_BY_ROLE simplificado, dropdown usuario con logout
- Tablas `communities` y `community_translations` creadas en Supabase (migración 008)
- Seed de 42 comunidades de Dubai + 42 traducciones base (locale `ae`) en `supabase/seed/communities.sql`
- Página de listado de comunidades `/communities` con búsqueda client-side
- Página de detalle de comunidad `/community/[slug]` con header, mapa, descripción sanitizada y galería con lightbox
- Sanitizador HTML allowlist (`lib/sanitize-html.ts`) + validación de `google_map_url`
- `lib/mock-communities.ts` y tipo `CommunityData` eliminados (reemplazados por `Community` en `lib/communities.ts`)

### 🔜 Siguientes pasos
- **Corto plazo:** Implementar páginas del sidebar: `/app/analytics` (Developer), `/app/clients` (Broker), `/app/settings` (todos)
- **Corto plazo:** Crear rutas `/development/[slug]` y `/developer/[slug]` — actualmente dan 404 al navegar desde el detalle de propiedad
- **Corto plazo:** Conectar tablas `developers`, `developments` y `properties` a la UI real (reemplazar datos planos mockeados con queries a Supabase)
- **Corto plazo:** Conectar la búsqueda de homepage a resultados reales (navegación a `/properties-list` con query params)
- **Corto plazo:** Implementar envío real de consultas Contact y WhatsApp (conectar a backend/Supabase)
- **Mediano plazo:** Dashboard de inversor (favoritos, consultas)
- **Corto plazo:** Ejecutar migración 008 + seed de communities en Supabase (producción)
- **Corto plazo:** Conectar el CTA "See properties" de communities a `/properties` con query param `community`
- **Corto plazo:** Asignar `developer_id` a cada comunidad (dato pendiente en Webflow)
- **Mediano plazo:** Traducir comunidades a locales adicionales (hoy solo existe la fila base 'ae')
- **Mediano plazo:** Panel de administración completo para vendedores (gestión de propiedades, consultas)
- **Mediano plazo:** Mapa global con unidades geolocalizadas
- **Mediano plazo:** Conectar DataTable del dashboard a datos reales de propiedades
- **Mediano plazo:** Aplicar pricing plans (planes pagos según role y país)
- **Largo plazo:** Comparador lado a lado de propiedades
- **Largo plazo:** Calculadora de rentabilidad / ROI
- **Largo plazo:** Valoraciones y reseñas de vendedores
- **Largo plazo:** App nativa mobile (iOS / Android)
- **Largo plazo:** OAuth social (Google, Apple)

---

## 12. GLOSARIO

| Término | Definición |
|---|---|
| Off-Plan | Propiedad en venta antes de su construcción o durante la misma |
| Unidad | Propiedad individual dentro de un desarrollo (ej: departamento, villa, local) |
| Developer | Empresa desarrolladora que construye y comercializa el proyecto |
| Broker | Intermediario inmobiliario con licencia que lista propiedades de distintos desarrolladores |
| Private Seller | Propietario individual que vende su propia propiedad |
| Vendedor | Término genérico que engloba Developer, Broker y Private Seller |
| Desarrollo / Project | Conjunto de unidades construidas por un desarrollador en un mismo sitio |
| Comunidad | Zona o distrito donde se ubica un desarrollo |
| Depósito | Pago inicial requerido para reservar una unidad Off-Plan |
| Plan de pago | Esquema de pagos escalonados durante la construcción |
| Fecha de entrega | Fecha estimada en que la unidad estará lista para escriturar |
| MVP | Minimum Viable Product — versión inicial con funcionalidades esenciales |
| i18n | Internacionalización — soporte multi-idioma |
| Locale | Identificador de idioma/región (ej: ae, es, gb, br) |
| RLS | Row Level Security — mecanismo de seguridad a nivel de fila en Supabase |
| user_profiles | Tabla unificada de perfiles con roles (reemplaza developer_profiles como tabla principal) |
| SectionCards | Componente de tarjetas de métricas en el dashboard |
| DataTable | Tabla interactiva con drag & drop, filtros, paginación y edición inline |
| Onboarding | Flujo post-registro donde el usuario completa los datos de su perfil según su role |
| Pricing Plans | Matriz de precios configurada por role × país para futuros planes pagos |
| Campos planos | Patrón de diseño donde `PropertyData` incluye datos "joined" de tablas relacionadas (`developer_name`, `development_name`, etc.) para evitar joins en tiempo de render |
