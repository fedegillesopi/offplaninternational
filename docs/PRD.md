# Off Plan International — Product Requirements Document

**Cliente:** Off Plan International
**Proyecto:** Plataforma global de listing de propiedades Off-Plan
**Versión:** 1.11 — 03-Sep-2026
**Estado:** MVP en desarrollo — i18n inactiva (sitio siempre en inglés, locale default `en`, `localePrefix: never`), Auth i18n completo, comunidades en DB (migración 008), ruta /app, developer pages en DB + editor rich text TipTap (migraciones 011–013), broker profile pages + form (migración 014), property upload & management system (form 11 secciones, Development Details fields migración 019, milestones CRUD, CRUD completo, back button + AlertDialog en forms), credenciales de broker RERA/QR/ORN/checkbox (migración 022), selección de plan por perfil en `/auth/payment` (mock de tiers, sin Stripe; `lib/plans.ts`; plan Free de 10 propiedades)

---

## 1. CONTEXTO DEL PROYECTO

**Problema que resuelve:** Comprar propiedades Off-Plan es confuso, lento y manejado por agentes de ventas con información parcial. No existe un lugar único donde se listen unidades individuales con datos financieros completos (depósito, plan de pago, precio, fecha de entrega).

**Origen del proyecto:** Iniciativa de Off Plan International para crear un marketplace global de propiedades Off-Plan que elimine intermediarios y centralice la información.

**Mercado objetivo:** Global, con foco inicial en:
- EAU (mercado principal)
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
- Multi-moneda desde el día uno; i18n (next-intl) preservada pero inactiva (sitio siempre en inglés)

**Arquitectura general:** El proyecto opera como dos experiencias integradas en un mismo dominio:
1. **Sitio público**: landing page, listado y detalle de propiedades, auth para inversores. El contenido se sirve **siempre en inglés** (locale `en`); i18n (next-intl) preservada para posible reactivación futura, sin selector de idioma ni geo-detección activa.
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
| Sistema i18n con next-intl preservado (sitio siempre en inglés; sin geo-detección, sin selector de idioma) | Público | ✅ Implementado (inactivo) |
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
| Auth i18n: namespace `auth` traducido a 7 locales (archivos de mensajes preservados; contenido servido en inglés `en`) | Todos | ✅ Implementado (inactivo) |
| Auth sin dependencia de locale en URL: redirects a rutas limpias (`/auth/onboarding/{role}`, `/app`) | Todos | ✅ Implementado |
| Dashboard unificado con sidebar basado en role (Developer/Broker/Private Seller) | Todos | ✅ Implementado |
| Componentes reorganizados en directorios por dominio (site/, properties/, auth/, shared/, platform/) | Frontend | ✅ Implementado |
| Template cleanup: 13 archivos eliminados (tutorial starter kit, section-cards, data-table, sidebar.tsx) | Frontend | ✅ Implementado |
| shadcn defaults restaurados: Button (h-9/h-10), Input (h-9), custom spacing eliminado | Frontend | ✅ Implementado |
| UI primitives creados: textarea.tsx, dialog.tsx (Radix UI) | Frontend | ✅ Implementado |
| Rename `/dashboard` → `/app` | Todos | ✅ Implementado |
| Sidebar reestructurada: NAV_BY_ROLE simplificado, dropdown usuario con logout | Todos | ✅ Implementado |
| Página de selección de plan por perfil `/auth/payment` (mock de tiers, sin Stripe; `lib/plans.ts`; plan Free de 10 propiedades) | Todos | ✅ Implementado (mock UI) |
| Credenciales de broker (RERA card, QR, agency ORN, checkbox de confirmación) en onboarding y broker-profile (migración 022) | Broker | ✅ Implementado |
| Legacy route redirects (`/login` → `/auth/login`, `/signup` → `/auth/sign-up/developer`) | Auth | ✅ Implementado |
| Fix middleware: `updateSession()` antes de `intlMiddleware()` en auth routes | Auth | ✅ Implementado |
| Tablas `developers`, `developments` en Supabase (migración 007) | Backend | ✅ Implementado |
| Tabla `properties` recreada con FKs a `developers`, `developments` y `user_profiles` (migración 007) | Backend | ✅ Implementado |
| Tabla `payment_plan_milestones` recreada con CHECK y RLS mejorado (migración 007) | Backend | ✅ Implementado |
| Interfaz `PropertyData` migrada a campos planos + nuevas interfaces `Developer`, `Development`, `PaymentPlanMilestone` | Frontend | ✅ Implementado |
| Página de listado de desarrollos `/development/[slug]` | Público | ❌ Pendiente |
| Página de listado de promotoras `/developers` y detalle `/developer/[slug]` (leídas de Supabase, solo verified, búsqueda por texto visible) | Público | ✅ Implementado |
| Form de perfil de developer `/app/developer` (slug auto + copy URL, city select por operating country, cover/logo upload, on-time completion, email/phone, Save con detección de cambios) | Vendedor | ✅ Implementado |
| Editor rich text TipTap para descripción de developer (negrita, cursiva, H3, listas, blockquote, imagen) | Vendedor | ✅ Implementado |
| Upload de imágenes al bucket `developer-images/{userId}/description/` (migración 012) | Backend | ✅ Implementado |
| Sanitización HTML user-generated (`sanitizeUserHtml`): allowlist estricto + origin check de imágenes, aplicada en cliente y servidor | Vendedor | ✅ Implementado |
| Tabla `cities` curada por país + 50 ciudades de EAU (migración 013 + seed) | Backend | ✅ Implementado |
| Página de listado de comunidades `/communities` (grid + búsqueda client-side, leída de Supabase) | Público | ✅ Implementado |
| Página de detalle de comunidad `/community/[slug]` (header, mapa, descripción sanitizada, info card, galería) | Público | ✅ Implementado |
| Tablas `communities` y `community_translations` en Supabase con RLS (migración 008) | Backend | ✅ Implementado |
| Seed de 42 comunidades de Dubai + 42 traducciones base (`supabase/seed/communities.sql`) | Backend | ✅ Implementado |
| Sanitizador HTML allowlist + validación de `google_map_url` (seguridad) | Frontend | ✅ Implementado |
| Dashboard de inversor (favoritos, consultas) | Inversor | ❌ Pendiente |
| Paneles específicos por role (Properties para todos, Analytics para Developer, Broker Profile para Broker, Clients para Broker) | Vendedor | ✅ Implementado (parcial: Properties + profiles)|
| Broker profile page `/broker/[slug]` (header, description, active properties) + form `/app/broker` + migración 014 | Vendedor/Broker | ✅ Implementado |
| Property upload form con 11 secciones (basic info, location, details, pricing, milestones, development details, amenities, images, tags, visibility) + back button + AlertDialog delete | Vendedor | ✅ Implementado |
| MilestonesEditor CRUD para plan de pago | Vendedor | ✅ Implementado |
| PropertyList table con 7 columnas (property, status, price, location, specs, created, actions) | Vendedor | ✅ Implementado |
| Dashboard pages: property listing (`/app/properties`), create (`/app/properties/new`), edit (`/app/properties/[id]/edit`) | Vendedor | ✅ Implementado |
| Server actions: `saveProperty`, `deleteProperty`, `saveMilestones` con validaciones y ownership checks | Backend | ✅ Implementado |
| Data access: `getMyProperties`, `getMyProperty` para queries del dashboard | Backend | ✅ Implementado |
| Namespace `property_form` traducido en 7 locales | Vendedor | ✅ Implementado |
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

**Modelo de pricing (planes por perfil, NO por país):**
- Selección de plan en `/auth/payment` tras el onboarding. Es un **mock de UI sin Stripe ni persistencia**: elegir cualquier plan navega a `/app`.
- Cada perfil (developer, broker, private_seller) tiene un plan **Free** (sin Stripe, límite de **10 propiedades**) + tiers de pago:
  - **Developer:** Free / Starter / Pro / Enterprise (referencial USD/mes: 0 / 49 / 99 / 299)
  - **Broker:** Free / Starter / Pro / Enterprise (referencial USD/mes: 0 / 39 / 79 / 199)
  - **Private Seller:** Free / Single / Starter / Pro (Single = 29 USD/mes, 1 propiedad)
- Los planes NO varían por país (decisión de producto; reemplaza la antigua matriz role × país).
- Fuente de catálogo: `lib/plans.ts` (`PLANS`, `getPlansForRole`, `getPlan`, `getMaxProperties`). El límite principal es la cantidad de propiedades activas. Implementación futura con Stripe: `docs/STRIPE-PLANS.md`.
- `lib/pricing-plans.ts` (matriz role × país) quedó **sin uso en código** (solo referenciado en docs).

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
- Editar su perfil público en `/app/developer`: descripción rich text (TipTap), logo, cover, ciudad, on-time completion, email y phone

**Restricciones:**
- No puede ver propiedades de otros vendedores
- Tiene un único registro en `developers` (UNIQUE(user_profile_id)); solo puede INSERT/UPDATE el suyo propio (RLS)
- Campos de onboarding: company_name, company_website, operating_country (obligatorio), phone

### 5.3 Broker
**Perfil:** Intermediario inmobiliario con licencia profesional que lista propiedades de distintos desarrolladores.

**Motivación inmediata:** Acceder al dashboard, listar propiedades de sus clientes, gestionar consultas y mantener un perfil público profesional.

**Motivación diferida:** Gestión de clientes (inversores), seguimiento de leads, construir reputación vía perfil público.

**Acciones en el sistema:**
- Registrarse en `/auth/sign-up/broker` con full name, email y password
- Completar onboarding en `/auth/onboarding/broker` con: company name, company website, operating country, RERA Broker Card / ID (imagen obligatoria), QR Code (imagen opcional), Agency ORN, checkbox "I confirm these details are up to date", phone
- Seleccionar plan en `/auth/payment` tras completar el onboarding (mock de tiers por perfil)
- Acceder al dashboard con sidebar: Dashboard, Properties, Broker Profile, Clients, Settings
- Listar propiedades de distintos desarrolladores
- Editar su perfil público en `/app/broker`: nombre, slug, imagen de perfil, URL personal, descripción rich text (TipTap), país, ciudad, email público, teléfono, WhatsApp, transacciones cerradas

**Restricciones:**
- Campos de onboarding broker: company_name, company_website, operating_country, RERA Broker Card / ID (obligatorio), QR Code (opcional), agency_orn, details_confirmed (checkbox), phone. El antiguo campo texto `license_number` fue reemplazado por la imagen RERA.
- La RERA Broker Card / ID es obligatoria y específica del broker (bucket `broker-images/rera`); el QR es opcional (bucket `broker-images/qr`)
- Al guardar el onboarding, se hace **upsert en `broker_profiles`** (crea el row con name/slug desde company_name/full_name si no existe) con `rera_card_url`, `qr_code_url`, `agency_orn`, `details_confirmed`
- Una sola página de broker por usuario (`UNIQUE(user_profile_id)` en `broker_profiles`)
- Página pública solo visible para brokers verificados (`is_verified = true`)

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
- Plan Free con hasta 10 propiedades (selección de plan en `/auth/payment`; el límite del plan Free es 10 para los 3 perfiles)
- Campos de onboarding: country_of_residence (obligatorio), phone
- No tiene campos de empresa (company_name, company_website, operating_country no aplican)

---

## 6. FUNCIONALIDADES DETALLADAS

### 6.1 Sitio público (siempre en inglés; carpeta `[locale]` del repo, locale resuelto a `en` sin prefijo en URL)

#### 6.1.1 Homepage
- **Hero section:** título, subtítulo, campo de búsqueda y dropdowns de filtro (categoría, precio, estado)
- **Features section:** 4 cards con íconos ("Transparencia Total", "Sin Agentes", "Unidades Individuales", "Búsqueda Inteligente")
- **About section:** propuesta de valor
- **FAQ:** accordion con preguntas frecuentes
- **Contact Banner:** CTA de contacto
- **Footer:** navegación, redes sociales, copyright
- **Navbar:** menú responsive con navLinks traducidos, logo, CurrencySwitcher

#### 6.1.2 Sistema i18n (next-intl v4) — inactivo, sitio siempre en inglés
- **Decision de negocio (definitiva por ahora):** el sitio se sirve **siempre en inglés** con URLs limpias (sin prefijo de locale). Se mantienen las traducciones y el framework i18n (next-intl) por si se reactiva, pero no hay selector de idioma ni detección geográfica activa.
- Locales configurados: `en` (default), `ar`, `br`, `es`, `gb`, `mx`, `pt` (los códigos de país quedan "dormidos" en la config)
- Prefijo de ruta: `never` — URLs sin prefijo: `/`, `/properties`, `/property/[slug]`, `/communities`, `/developers`, `/auth/*`, etc.
- Cualquier URL con prefijo de locale (`/es/...`, `/ar/...`, etc.) redirige (301) a la versión limpia en inglés
- Sin geo-detección de idioma y sin cookie `NEXT_LOCALE` (eliminadas)
- Contenido público y traducciones se muestran en inglés (locale `en`); el contenido legal (privacy, terms, confirm-email) se resuelve a inglés para `en`/`gb`/`ae`
- Traducciones en archivos `messages/{locale}.json` (7 archivos, preservados para reactivación)
- Navegación: usar `Link` y `redirect` desde `@/i18n/navigation` (no `next/link`)
- Mapeo país → moneda default (referencial, no modifica el idioma):
  - EAU → AED | GB → GBP | ES → EUR | PT → EUR | MX → USD | BR → USD | AR → USD

#### 6.1.3 Auth
- Método: email/password
- Flujos: registro, login, forgot password, reset password, update password
- Confirmación de email obligatoria
- Rutas protegidas via middleware: `proxy.ts` ejecuta `updateSession()` antes de `intlMiddleware()` en rutas de auth
- `getUser()` server-side para verificar sesión (no `getClaims()`)
- Tras login exitoso → redirige a `/app` (standalone, sin locale prefix)
- **i18n:** Los archivos de mensajes `auth` preservan 7 locales, pero el contenido se sirve en inglés (`en`). Sin `useLocale()` ni cookie `NEXT_LOCALE`.
- **Redirects sin locale en URL:** `emailRedirectTo` (sign-up) y `redirectTo` (forgot-password) apuntan a rutas limpias (`/auth/confirm`, `/auth/update-password`). `confirm/route.ts` redirige a `/auth/onboarding/{role}` o `/app` (sin prefijo de locale)

#### 6.1.4 Currency Switcher
- 4 monedas disponibles: AED, USD, EUR, GBP
- USD como default global (no por locale)
- Persistencia en cookie `NEXT_CURRENCY` por 30 días
- Conversión en vivo con tasas fijas en `lib/exchange-rates.ts` (sin API externa en MVP)
- Formato por moneda usando `Intl.NumberFormat` con locale específico
- Provider global (`CurrencyProvider`) envuelve al árbol cliente desde el layout raíz del app
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
- Ruta: `/property/[slug]` (con slug SEO-friendly)
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

**Listado (`/communities`):**
- Server component que consulta `getCommunities(locale)` con el Supabase server client
- `getCommunities` hace `select("*, community_translations(*)")` filtrando `is_active = true`; resuelve la traducción con fallback locale → `DEFAULT_LOCALE` (`en`) → primera disponible; ordena con `localeCompare(locale)` (ver nota técnica de inconsistencia por filas base en 'ae')
- `CommunitiesGrid` (client) con input de búsqueda que filtra por nombre, ciudad, location y tags (`useState`/`useMemo`); sin resultados muestra `t("communities.no_results")`
- `CommunityCard` en `components/site/` (reutilizable) linkea a `/community/{slug}` via `@/i18n/navigation`
- Namespace `communities` traducido en los 7 locales

**Detalle (`/community/[slug]`):**
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

#### 6.1.9 Página de listado y detalle de promotoras

**Listado (`/developers`):**
- Server component que consulta `getDevelopers()` con el Supabase server client: `select("*")` filtrando `is_verified = true`, ordenado por nombre (`localeCompare(..., "en")`)
- `DevelopersGrid` (client) con input de búsqueda que filtra por nombre, descripción en texto plano (`stripHtmlToText`) y slug (`useState`/`useMemo`); sin resultados muestra `t("developers.no_results")`
- `DeveloperCard` en `components/site/` muestra cover image + logo overlay, nombre y descripción con `stripHtmlToText(description)` (line-clamp-2, sin etiquetas ni estilos)
- Namespace `developers` traducido en los 7 locales (`back_to_home`, `all_developers`, `search_placeholder`, `no_results`)

**Detalle (`/developer/[slug]`):**
- Server component con `getDeveloperBySlug(slug)` (`.maybeSingle()` con `is_verified = true`); si no existe → `notFound()`
- `DeveloperHeader`: cover image + logo (placeholder con iniciales si no hay)
- Ubicación = `country, city` (join con filtro de vacíos)
- `DeveloperDescription`: si la descripción es HTML (`isHtmlText`) se renderiza con `dangerouslySetInnerHTML` SIEMPRE pasando por `sanitizeUserHtml()` (allowlist estricto + origin check de imágenes); si es legacy `**bold**` se renderiza como texto con `<strong>`
- `DeveloperInfoCard` (sticky): `on_time_completion` %, email, phone, website (validado http(s), link con `noopener noreferrer`) y CTA "See developer properties" → `/properties-list?developer={slug}` ⚠️ (ruta inexistente, ver regla 37)
- Estilos `.developer-description` en `globals.css` (p, ul/ol, li, blockquote, h2/h3, img)
- Namespace `developer_detail` traducido en los 7 locales (`back_to_list`, `all_developers`, `about_developer`, `on_time_completion`, `email`, `phone`, `website`, `see_properties`)

**Datos:**
- Se leen de la tabla `developers` en Supabase (no mock). `lib/mock-developers-detail.ts` fue eliminado.
- Solo aparecen promotoras con `is_verified = true`

### 6.2 Auth unificado y onboarding (3 roles)

#### 6.2.1 Registro por role (URL-driven)
- **Ruta base:** `/auth/sign-up/[role]` — cada role tiene su propia URL
- **Tabs de role:** El componente `sign-up-form.tsx` renderiza 3 tabs (Developer, Broker, Private Seller). Al hacer clic en un tab, navega a `/auth/sign-up/{role}` usando `router.push()`. No hay tabs internos — cada tab es una URL distinta.
- **Lectura del role:** `SignUpForm` lee el role de `useParams()` (`params.role`). El form inicializa `activeTab` con el role de la URL.
- **Formulario:** full name, email, password, repeat password (común a los 3 roles)
- **Submit:** `supabase.auth.signUp()` con `options.data.role = activeTab` y `full_name`. El role se guarda en `raw_user_meta_data` de Supabase.
- **Redirect post-signup:** `/auth/sign-up-success` (email de confirmación pendiente)
- **Redirect legacy:** `/auth/sign-up` (sin role) redirige a `/auth/sign-up/developer`
- **Componente:** `components/auth/sign-up-form.tsx` (client, usa `useTranslations("auth.sign_up")`)
- **Página:** `app/[locale]/auth/sign-up/[role]/page.tsx` — layout split con imagen a la izquierda (lg) y formulario a la derecha. "Back to home" traducido via `getTranslations("auth")` (contenido servido en inglés `en`)

#### 6.2.2 Login unificado
- **Ruta:** `/auth/login` — formulario con email y password
- **Componente:** `components/auth/login-form.tsx` (client, `Link` y `useRouter` de `@/i18n/navigation`)
- **Submit:** `supabase.auth.signInWithPassword()` → redirect a `/app`
- **Link a registro:** `/auth/sign-up` (redirige a `/auth/sign-up/developer`)
- **Link a forgot password:** `/auth/forgot-password`
- **Legacy route:** `(auth)/login/page.tsx` redirige a `/auth/login`

#### 6.2.3 Onboarding post-confirmación
- **Ruta:** `/auth/onboarding/[role]`
- **Trigger:** El `confirm route handler` (`app/[locale]/auth/confirm/route.ts`) verifica el OTP con Supabase, lee `user_profiles.role` y `user_profiles.profile_completed`. Si `profile_completed === false`, redirige a `/auth/onboarding/{role}`. Si `profile_completed === true`, redirige a `/app`. (Sin cookie `NEXT_LOCALE`; rutas sin prefijo de locale)
- **Formulario unificado con campos condicionales por role:**
  - **Developer:** company name*, company website, operating country*, phone*
  - **Broker:** company name*, company website, operating country*, RERA Broker Card / ID* (imagen, bucket `broker-images/rera`), QR Code (imagen opcional, bucket `broker-images/qr`), Agency ORN (texto, ≤ 64 chars), checkbox "I confirm these details are up to date", phone*
  - El campo texto `license_number` fue reemplazado por la imagen RERA.
  - **Private Seller:** country of residence*, phone*
  - (* = obligatorio)
- **Submit:** Actualiza `user_profiles` con los campos correspondientes + `profile_completed = true`. Para role **broker**, además hace **upsert en `broker_profiles`** con `rera_card_url`, `qr_code_url`, `agency_orn`, `details_confirmed` (crea el row con name/slug desde `company_name`/`full_name` si no existe).
- **Post-submit:** Redirige a `/auth/payment` (selección de plan) — ya no va directo a `/app`
- **Países disponibles:** AE, GB, ES, PT, MX, BR, AR, ID, ME
- **Componente:** `app/[locale]/auth/onboarding/[role]/page.tsx` (client, contenido servido en inglés)
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
- **Broker:** Dashboard, Properties, Broker Profile (`/app/broker`), Clients (`/app/clients`)
- **Private Seller:** Dashboard, Properties
- **Settings** (`/app/settings`) en NavSecondary, común a todos
- **NavUser:** Dropdown con avatar, nombre, email y botón de logout

#### 6.3.3 Dashboard page
- Placeholder page en `/app`
- ⚠️ Las sub-rutas del sidebar (analytics, clients, settings) están definidas en la navegación pero las páginas aún no existen

#### 6.3.4 Legacy route redirects
- `(auth)/login/page.tsx` y `(auth)/signup/page.tsx` eliminadas en cleanup
- Legacy routes `/login` y `/signup` redirigen al sistema actual

### 6.4 Selección de plan (`/auth/payment`) — mock de tiers por perfil

**Ruta:** `/auth/payment` (server) resuelve el role desde `user_profiles` y delega en `PaymentPage` (client).
**Estado:** Mock de UI. Sin Stripe, sin persistencia ni cobro. Elegir cualquier plan (incl. los de pago) navega a `/app`.

**Fuente de catálogo:** `lib/plans.ts` — `PLANS`, `getPlansForRole`, `getPlan`, `getMaxProperties`, tipos `PlanTier`/`Plan`.

**Tiers por perfil (USD/mes, referencial):**

| Perfil | Free | Single | Starter | Pro | Enterprise |
|---|---|---|---|---|---|
| developer | 10 (gratis) | — | 50 (49) | 200 (99) | ilimitado (299) |
| broker | 10 (gratis) | — | 25 (39) | 100 (79) | ilimitado (199) |
| private_seller | 10 (gratis) | 1 (29) | 20 (49) | ilimitado (99) | — |

- Los planes **no varían por país** (decisión de producto; reemplaza la antigua matriz role × país de `lib/pricing-plans.ts`, que quedó sin uso en código).
- El mock muestra la cantidad de propiedades disponibles según el tier seleccionado ("Up to X properties" / "Unlimited properties").
- **Nota de limpieza:** `lib/pricing-plans.ts` sigue existiendo pero **no se importa en ningún archivo de código** (solo referenciado en docs). Se debe eliminar.
- **Implementación futura con Stripe:** ver `docs/STRIPE-PLANS.md` (paso a paso: migración SQL propuesta `023_plans_and_subscriptions.sql`, tabla `plans`, ajuste de `subscriptions`, webhooks, enforcement del límite en `saveProperty`).

### 6.5 Fix middleware auth routes

**Problema original:** En rutas de auth (`/[locale]/auth/*`), `intlMiddleware()` se ejecutaba antes que `updateSession()`, causando que el locale no se resolviera correctamente al redirigir tras auth.

**Solución implementada en `proxy.ts`:**
- Las rutas de auth (detectadas por regex `authRouteRegex`) ejecutan `updateSession()` primero
- Si `updateSession()` retorna un redirect (status 3xx), se retorna ese redirect directamente
- Si no hay redirect, se continúa con `intlMiddleware(request)`
- Las rutas standalone (`/dashboard`, `/login`, `/signup`) siguen ejecutando solo `updateSession()`

> Nota: el regex `authRouteRegex` conserva el patrón de locales opcionales (`/(?:en|ar|...)?/auth`) por compatibilidad con URLs legacy, pero el sitio se sirve siempre en inglés (`en`) con `localePrefix: never`.

```
Auth routes (/[locale]/auth/*):
  updateSession() → si redirect, retornarlo → sino, intlMiddleware()

Standalone routes (/dashboard, /login, /signup):
  updateSession() directamente

Otras rutas:
  intlMiddleware() directamente
```

### 6.6 Perfil de developer y editor rich text (TipTap)

#### 6.6.1 Página `/app/developer`
- Server page protegida: verifica sesión, lee `user_profiles.role`; si el role no es `developer` → redirect a `/app`
- Carga el developer propio (`getMyDeveloper(user.id)`), el perfil de usuario, el país de operación (`lib/countries.ts`: normalización ISO ↔ nombre) y las ciudades del país (`getCitiesByCountry`)
- Acceso: item "Developer Profile" en la sidebar del role developer (`NAV_BY_ROLE`, icono BriefcaseBusiness)

#### 6.6.2 DeveloperForm (`components/platform/developer-form.tsx`, client)
- **Campos:** Company Name, Slug (auto-generado de `slugify(name)`, read-only, botón copiar URL pública `/developer/{slug}`), Description (RichTextEditor), Country (read-only desde el perfil), City (select de `cities` por operating country + la ciudad actual si no está en la lista), Cover Image y Logo (ImageUpload), Website, On-time completion (%) 0–100, Email, Phone
- **Prefill:** name desde `developer.name` (fallback `profile.company_name`); para registros nuevos, website/email/phone se rellenan desde `user_profiles`; para registros existentes **no** se rellenan (no se pisan datos guardados)
- **Detección de cambios:** `hasChanges` compara cada campo (la descripción se compara sanitizada); el botón Save queda deshabilitado cuando no hay cambios
- **Guardado:** `sanitizeUserHtml(description)` en cliente → `saveDeveloperProfile()` (server action) → `router.refresh()`
- Banner "Pending verification" si `is_verified === false`

#### 6.6.3 RichTextEditor (`components/platform/rich-text-editor.tsx`, client)
- TipTap v3.29 (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`, `@tiptap/pm`)
- StarterKit con headings nivel 2–3, Placeholder, Image (`inline: false`)
- Toolbar: negrita, cursiva, H3, lista con viñetas, lista ordenada, blockquote, insertar imagen
- **Imágenes:** input file oculto (jpeg/png/webp) → `uploadImage(file, userId, "description")` → bucket `developer-images` en `{userId}/description/{timestamp}-{random}.{ext}` → se embebe como `<img src>` en el HTML
- `onUpdate` → `onChange(editor.getHTML())`; spinner de upload y mensaje de error
- **Conversión legacy:** `toEditorHtml()` convierte descripciones markdown `**bold**` + saltos de línea a HTML (`<strong>`, `<p>`, `<br>`) antes de alimentar el editor; si ya es HTML se usa tal cual (`isHtmlText`)

#### 6.6.4 `saveDeveloperProfile` (`lib/actions.ts`, server action)
- Requiere sesión (`getUser()`); si no hay usuario → error
- **Validaciones:** company name requerido (max 120), slug regex `^[a-z0-9-]+$`, descripción max 20.000 chars (tras sanitizar), email max 320, phone max 50, website http(s) válido (auto-prefija `https://` si falta el protocolo), on_time_completion entre 0 y 100 (null permitido)
- **Sanitización en servidor:** `sanitizeUserHtml(payload.description)` — doble sanitización (cliente + servidor)
- **Upsert:** update si viene `id` (filtrado por `user_profile_id = user.id` — no puede editar filas ajenas); insert si no, con `country` y `user_profile_id`
- Devuelve `{ error }` que el form muestra inline

#### 6.6.5 Sanitización user-generated (`lib/sanitize-html.ts`)
- `sanitizeUserHtml()` para contenido user-generated (descripciones de developers editadas con TipTap). Allowlist mínimo: `p, strong, em, br, ul, ol, li, blockquote, h2, h3, img`
- **Imágenes:** solo `https` y solo del origin de Supabase Storage (host de `NEXT_PUBLIC_SUPABASE_URL`); `src` y `alt` re-escapan `"<>`; si no pasa, el tag `<img>` se elimina
- **Tags bloqueados** (incluido su contenido): `script, style, iframe, object, embed, form, input, button, link, meta, svg, math, video, audio, source, figure, figcaption, template, noscript, a`
- **Tags truncados** (sin `>`) se escapan a entidades → no pueden conservar atributos al ser reparseados; neutralización de entidades peligrosas (`&#x3c;` → `&amp;lt;`)
- `sanitizeHtml()` (contenido curado de communities) se mantiene sin cambios

#### 6.6.6 Storage y tablas relacionadas
- **Migración 011:** `cover_image`, `city`, `on_time_completion`, `email`, `phone` en `developers` + `UNIQUE(user_profile_id)` + políticas RLS `developers_insert_own` / `developers_update_own` (`auth.uid() = user_profile_id`)
- **Migración 012:** bucket `developer-images` (público, 5MB, jpeg/png/webp); estructura `developer-images/{user_id}/{folder}/{filename}`; RLS: SELECT público, INSERT/DELETE solo en la carpeta propia (`storage.foldername(name))[1] = auth.uid()`)
- **Migración 013 + seed:** tabla `cities` (`country`, `name`, UNIQUE(country, name), SELECT público) con 50 ciudades de EAU curadas (CSV de Webflow)
- `next.config.ts`: `remotePatterns` incluye el host de Supabase (next/image para cover/logo)

### 6.7 Perfil de broker y página pública

#### 6.7.1 Página `/app/broker`
- Server page protegida: verifica sesión, lee `user_profiles.role`; si el role no es `broker` → redirect a `/app`
- Carga el broker propio (`getMyBroker(user.id)`), el perfil de usuario, el país de operación (`lib/countries.ts`: normalización ISO ↔ nombre) y las ciudades del país (`getCitiesByCountry`)
- Acceso: item "Broker Profile" en la sidebar del role broker (`NAV_BY_ROLE`, icono BriefcaseBusiness)

#### 6.7.2 BrokerForm (`components/platform/broker-form.tsx`, client)
- **Campos:** Name, Slug (auto-generado de `slugify(name)`, read-only, botón copiar URL pública `/broker/{slug}`), Profile Image (ImageUpload a bucket `broker-images`), Description (RichTextEditor), Country (read-only desde el perfil), City (select de `cities` por operating country), Personal Website, Public Email, Phone, WhatsApp, Closed Transactions (number), y una sección **"Credentials"** con: RERA Broker Card / ID (ImageUpload, bucket `broker-images/rera`), QR Code (ImageUpload, bucket `broker-images/qr`), Agency ORN (texto) y checkbox "I confirm these details are up to date" (con **preview destacada del QR** si existe)
- **Prefill:** name desde `broker.name` (fallback `profile.company_name`); para registros nuevos, email/phone se rellenan desde `user_profiles`; para registros existentes **no** se rellenan (no se pisan datos guardados)
- **Detección de cambios:** `hasChanges` compara cada campo (la descripción se compara sanitizada); el botón Save queda deshabilitado cuando no hay cambios
- **Guardado:** `sanitizeUserHtml(description)` en cliente → `saveBrokerProfile()` (server action) → `router.refresh()`
- Banner "Pending verification..." si `is_verified === false`
- **i18n:** Dashboard sin i18n por ahora (strings hardcoded en inglés)

#### 6.7.3 `saveBrokerProfile` (`lib/actions.ts`, server action)
- Requiere sesión (`getUser()`); si no hay usuario → error
- **Validaciones:** name requerido (max 120), slug regex `^[a-z0-9-]+$`, descripción max 20.000 chars (tras sanitizar), email max 320, phone max 50, whatsapp max 50, personal_url http(s) válido (auto-prefija `https://`), closed_transactions entre 0 y 100.000 (null permitido)
- **Credenciales (migración 022):** recibe `rera_card_url`, `qr_code_url`, `agency_orn` (texto, max 64 chars, trim) y `details_confirmed` (boolean); se persisten en `broker_profiles`
- **Sanitización en servidor:** `sanitizeUserHtml(payload.description)` — doble sanitización (cliente + servidor)
- **Upsert:** update si viene `id` (filtrado por `user_profile_id = user.id`); insert si no, con `country` y `user_profile_id`
- Devuelve `{ error }` que el form muestra inline

#### 6.7.4 Página pública `/broker/[slug]`
- Server component: `getBrokerBySlug(slug)` filtra `is_verified = true`; `notFound()` si no existe
- **BrokerHeader:** imagen circular (placeholder con iniciales si no hay), nombre, URL personal (validada con `safeUrl`), stats (active properties count + closed transactions), botones Email y WhatsApp
- **BrokerDescription:** renderiza HTML sanitizado (`sanitizeUserHtml()`) con fallback legacy `**bold**` via `splitBold()` (mismo patrón que `DeveloperDescription`). Usa clase `.rich-description` en `globals.css`
- **Active Properties:** hasta 5 propiedades activas del broker (query a `properties` filtrando `listed_by_id` + `listed_by_type = 'broker'`), con link "View all" → `/properties`
- **Acceso:** solo accesible desde property pages donde el broker es el vendedor (no hay listing page de brokers)
- **Datos:** se leen de la tabla `broker_profiles` en Supabase (no mock)

#### 6.7.5 Integración con property-sidebar
- `PropertySidebar` acepta props `sellerName`, `sellerSlug`, `listedByType` (tipo `UserRole`)
- Condicionalmente linka a `/broker/{slug}` o `/developer/{slug}` según `listed_by_type`
- Label del link: "Broker" si `listedByType === "broker"`, o el label traducido de `developer_label` para developers
- `PropertyData` incluye campos `broker_name` y `broker_slug` (además de `developer_name`/`developer_slug`)

#### 6.7.6 Traducciones
- Namespace `broker_detail` en 7 locales (ae, ar, es, gb, pt, br, mx): `back_to_properties`, `broker_profile`, `about_broker`, `active_properties`, `view_all`, `visit_personal_page`
- Dashboard sin i18n por ahora (strings hardcoded en inglés)

#### 6.7.7 Archivos clave
- **Migración:** `supabase/migrations/014_broker_profile.sql`
- **Types:** `BrokerProfile` en `lib/types.ts`
- **Data access:** `lib/brokers.ts` (`getBrokerBySlug`, `getMyBroker`, tipo `BrokerDetailData`)
- **Server action:** `saveBrokerProfile()` en `lib/actions.ts`
- **Componentes:** `broker-form.tsx`, `broker-header.tsx`, `broker-description.tsx`
- **Páginas:** `app/[locale]/broker/[slug]/page.tsx`, `app/app/broker/page.tsx`
- **CSS:** `.rich-description` en `globals.css` (compartida con developer)
- **Sidebar:** Broker Profile item en `NAV_BY_ROLE` (broker role)

### 6.8 Property Upload & Management (plataforma /app/properties)

#### 6.8.1 Listado de propiedades del vendedor (/app/properties)
- **Ruta:** `/app/properties` (sin locale prefix, requiere auth)
- **Server page:** verifica sesión via `getUser()`, carga `getMyProperties(user.id)` y renderiza `PropertyList`
- **PropertyList** (`components/platform/property-list.tsx`, server): tabla HTML con 7 columnas (Property, Status, Price, Location, Specs, Created, Actions)
  - Status con badges coloreados (available=verde, sold=rojo, reserved=amarillo, off_market=gris)
  - Botón "Edit" enlace a `/app/properties/{id}/edit`
  - Empty state con CTA "Create your first property"
- **Botón "Create Property"** en el header, enlace a `/app/properties/new`

#### 6.8.2 Crear propiedad (/app/properties/new)
- **Server page:** verifica sesión + perfil (`user_profiles`), carga ciudades por operating country, amenities, subcategories, communities, y developments (solo para developers con `developer_id`)
- **PageHeader con back button:** "Back" + flecha → `/app/properties`
- Renderiza `PropertyForm` con `property={null}` (modo creación), `ownDeveloperName` (nombre del developer del perfil, solo para developer)
- **Sidebar:** Link "Properties" en `NAV_BY_ROLE` para todos los roles

#### 6.8.3 Editar propiedad (/app/properties/[id]/edit)
- **Server page:** verifica sesión, carga `getMyProperty(user.id, id)` con ownership check
- Si la propiedad no existe o no pertenece al usuario → redirect a `/app/properties`
- Carga milestones de la propiedad (`payment_plan_milestones` filtrado por `property_id`, ordenado por `sort_order`)
- **PageHeader con back button:** "Back" + flecha → `/app/properties`
- Renderiza `PropertyForm` con `property={property}` + `milestones` (modo edición), `ownDeveloperName`
- **Delete:** botón destructivo abre **AlertDialog de confirmación** (Radix UI `AlertDialog`) preguntando "Are you sure?" → ejecuta `deleteProperty(id)` con ownership check

#### 6.8.4 PropertyForm (`components/platform/property-form.tsx`, client)
Formulario completo con 11 secciones, cada una encapsulada en un componente `FormSection` (`components/platform/property-form/form-section.tsx`) que renderiza un título con borde inferior.

| Sección | Componente | Campos |
|---|---|---|
| **Basic Information** | `BasicInformationSection` | Title*, Slug (auto, read-only + copy URL), Description (textarea), Property Type (select), Subcategory (select grouped by category), Status (select) |
| **Location** | `LocationSection` | Country (read-only desde perfil), City (select por operating country), Community (select filtrado por ciudad), Address |
| **Property Details** | `PropertyDetailsSection` | Bedrooms, Bathrooms, Floor, Area (sqft, auto-calc sqm), Balcony checkbox, Garden checkbox |
| **Pricing** | *(inline en PropertyForm)* | Price*, Currency (select), Deposit %, Deposit Amount (auto-calculated from % + price), Handover Date, Payment Plan Months, Post Handover checkbox |
| **Payment Plan Milestones** | `MilestonesEditor` | CRUD dinámico de hitos |
| **Development Details** | `DevelopmentDetailsSection` | Development (link) (dropdown de developments propios, solo developer), Development (texto plano, todos los roles), Development Area (sqft) (número libre), Developer (auto-completado read-only para developer / editable para broker y private_seller) |
| **Amenities** | `AmenitiesSection` | Toggle pills agrupados por categoría (desde `property_amenities` curados) |
| **Images** | `ImagesSection` | Cover Image (ImageUpload a bucket `property-images`), Gallery Images (upload múltiple, hasta 10, con preview y delete) |
| **Tags** | `TagsSection` | Input + Enter para agregar tags, chips removibles |
| **Visibility** | `VisibilitySection` | Active checkbox (controla `is_active`), botones de acción |

**Componentes de sección en `components/platform/property-form/`:**
Cada sección es un archivo independiente: `basic-information-section.tsx`, `location-section.tsx`, `property-details-section.tsx`, `development-details-section.tsx`, `tags-section.tsx`, `amenities-section.tsx`, `images-section.tsx`, `visibility-section.tsx`, `form-section.tsx` (wrapper compartido).

**Behavior of Development Details section:**
- **Development (link):** dropdown de developments activos del propio developer (solo visible para rol developer); `development_id` se guarda en BD como FK. En la página pública, si tiene `development_slug` se linkea a `/development/{slug}`.
- **Development (texto):** campo de texto libre para todos los roles. Se guarda en la columna `development` de `properties`. En la página pública se muestra en la tabla "Development Details".
- **Development Area (sqft):** número libre. Se guarda en `development_area`. Se muestra formateado como `X sqft` en la página pública.
- **Developer:**
  - **Rol developer:** se autocompleta con `developers.name` del perfil del usuario (`ownDeveloperName`); campo read-only. En BD se guarda el nombre en `developer` y el ID en `developer_id`.
  - **Rol broker / private_seller:** campo de texto editable (nombre del developer como texto plano). En BD `developer_id` se fuerza a null y se guarda solo el texto en `developer`. En la página pública, si el `listed_by_type` es `developer` y tiene `developer_slug` se linkea a `/developer/{slug}`; si no, se muestra como texto plano.

**NOTA:** `community_total_area` queda hardcodeado a 0 (pedido explícito del usuario de no tocarlo).

**Botones de acción (dentro de `VisibilitySection`):**
- Los botones son **full-width y apilados** verticalmente (uno debajo del otro en un contenedor `space-y-3`).
- **Creación:** botón primario "Create Property" + botón outline "Cancel" (navega a `/app/properties`).
- **Edición:** botón primario "Save Changes" + botón destructivo "Delete".
- **Delete abre AlertDialog** de confirmación (Radix UI): título "Are you sure?", descripción "This will permanently delete this property...", botones Cancel y Delete. No se usa `confirm()` nativo.
- **Los forms de broker/developer NO tienen botón Delete** (no existe server action de borrado para perfiles).

**Comportamiento del form:**
- `hasChanges`: compara cada campo contra el valor original; botón Save deshabilitado sin cambios
- **Slug auto-generado** desde title via `slugify()`, read-only, con botón copy de URL pública
- **Auto-cálculos:** sqm se calcula de sqft (`× 0.092903`); deposit_amount se calcula de price × deposit%
- **Guardado:** `saveProperty()` → `saveMilestones()` → `router.refresh()` (o redirect a `/app/properties` si es nuevo)
- **Delete:** AlertDialog → `deleteProperty()` → redirect a `/app/properties`

#### 6.8.5 MilestonesEditor (`components/platform/milestones-editor.tsx`, client)
- Editor dinámico de hitos del plan de pago (CRUD: add, edit, remove, reorder)
- Cada hito tiene: milestone_name*, percentage (0–100), amount (auto-calculated), due_date, description
- **Validación:** total de percentages no puede exceder 100%
- Recibe `propertyPrice` y `currency` para auto-calcular `amount` desde `percentage`

#### 6.8.6 Server Actions (`lib/actions.ts`)

**`saveProperty(payload)`：**
- Requiere sesión (`getUser()`) + role válido (developer/broker/private_seller)
- Valida: title (requerido, max 200), slug regex `^[a-z0-9-]+$`, description max (tras sanitizar), property_type, status, currency, price > 0, deposit_percentage 0–100, community max 200, address max 500, subcategory max 200, development max 200, developer max 200, development_area >= 0
- Auto-calcula area_sqm↔sqft y deposit_amount↔deposit_percentage si falta uno
- Sanitiza description con `sanitizeUserHtml()`
- **Lógica de developer_id y development_id:**
  - Si `listed_by_type === "developer"`: busca el registro en `developers` por `user_profile_id`, auto-setea `developer_id` y `developer` con el nombre del perfil (ignora el valor enviado del campo `developer`)
  - Si `listed_by_type` es broker o private_seller: `developer_id` se fuerza a null; `developer` se guarda como el texto enviado
  - `development_id`: solo se guarda si es developer Y seleccionó un development del dropdown; para otros roles se fuerza a null
- **INSERT** si no hay `id` (con `listed_by_id` y `listed_by_type` del perfil); **UPDATE** si hay `id` (filtrado por `listed_by_id` = user — ownership check)
- Devuelve `{ id, error }`

**`deleteProperty(propertyId)`：**
- Requiere sesión + ownership check (`listed_by_id = user.id`)
- DELETE de la propiedad (milestones se eliminan en cascade por FK)

**`saveMilestones(payload)`：**
- Requiere sesión + ownership check vía subquery a `properties`
- Valida: milestone names requeridos (max 200), percentages 0–100, total ≤ 100%
- Estrategia: DELETE todos los milestones existentes → INSERT los nuevos (reemplazo completo, no upsert individual)
- Devuelve `{ error }`

#### 6.8.7 Data Access (`lib/properties.ts`)

**`getMyProperties(userProfileId)`：**
- Query a `properties` con joins a `developers`, `user_profiles`, `developments`, `payment_plan_milestones`
- Filtra por `listed_by_id = userProfileId`
- Resuelve `broker_name`/`broker_slug` condicionalmente para `listed_by_type = 'broker'`
- Retorna `PropertyData[]` ordenado por `created_at DESC`

**`getMyProperty(userProfileId, propertyId)`：**
- Misma query que `getMyProperties` pero filtrando por `id = propertyId` + `listed_by_id = userProfileId`
- Retorna `PropertyData | null` (ownership check incluido)

#### 6.8.8 Fix PropertyCard — logo rendering condicional
- `property-card.tsx`: developer_logo se renderiza condicionalmente (`{property.developer_logo && (...)}`) para evitar error de `src=""` vacío en el `<Image>`

#### 6.8.9 Traducciones
- Namespace `property_form` agregado a los 7 archivos de mensajes (`messages/{locale}.json`)
- Dashboard sin i18n por ahora (strings hardcodeados en inglés)

#### 6.8.10 Fix Tailwind
- Agregado `primary.DEFAULT` en `tailwind.config.ts` para que las clases de utilidad `border-primary`, `bg-primary/10`, `text-primary` funcionen correctamente



---

## 7. ARQUITECTURA DEL SISTEMA

### 7.1 Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | Next.js 16.2.6 (App Router) | SSR, Server Components, Server Actions |
| Lenguaje | TypeScript ~5 | Strict mode |
| Base de datos | Supabase (PostgreSQL) | Auth + tablas user_profiles, developers, developments, properties, payment_plan_milestones, communities, community_translations, broker_profiles |
| Estilos | Tailwind CSS 3.4 + tailwindcss-animate | Design system |
| Componentes UI | Radix UI (shadcn-style): sidebar, sheet, dialog, drawer, select, tabs, table, avatar, separator, skeleton, chart | Primitivas accesibles |
| Tabla de datos | @tanstack/react-table 8.21 | Tabla con sorting, filtering, pagination |
| Drag & drop | @dnd-kit/core, sortable, modifiers, utilities | Reordenación de filas en DataTable |
| Gráficos | recharts 3.8 | Gráfico de área en drawer de DataTable |
| Notificaciones | sonner 2.0 | Toasts en DataTable |
| Drawer mobile | vaul 1.1 | Drawer responsive en DataTable |
| Iconos | lucide-react 0.511 + @tabler/icons-react 3.44 | Iconografía |
| Editor rich text | @tiptap/react + starter-kit + extension-image + extension-placeholder + @tiptap/pm (3.29) | Editor de descripciones en los forms de developer y broker |
| i18n | next-intl 4.12 | Internacionalización — preservada pero inactiva (sitio siempre en inglés) |
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
| description | text | nullable | Descripción de la promotora. Ahora guarda **HTML sanitizado producido por TipTap** (user-generated); descripciones legacy `**bold**` conviven y se convierten al editar |
| country | text | nullable | País de operación |
| cover_image | text | nullable | Imagen de portada de la página pública (migración 011) |
| city | text | nullable | Ciudad de operación (migración 011) |
| on_time_completion | integer | nullable | % de entregas a tiempo (0–100, validado en `saveDeveloperProfile`) (migración 011) |
| email | text | nullable | Email de contacto público (migración 011) |
| phone | text | nullable | Teléfono de contacto público (migración 011) |
| is_verified | boolean | NOT NULL DEFAULT false | Developer verificado |
| user_profile_id | uuid | FK → user_profiles(id) ON DELETE SET NULL | Perfil de usuario asociado |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de última actualización |

**Índices:** `slug`, `user_profile_id`, `country`
**Constraints adicionales:** `UNIQUE (user_profile_id)` — una sola página de developer por usuario (migración 011)
**Trigger:** `trigger_set_updated_at_developers`
**Políticas RLS:**
- SELECT público: developers verificados (`is_verified = true`)
- SELECT propio: developer ve su propio registro (`auth.uid() = user_profile_id`)
- INSERT propio: `developers_insert_own` — solo si `auth.uid() = user_profile_id` (migración 011)
- UPDATE propio: `developers_update_own` — solo el dueño (migración 011)
- DELETE: no hay política desde cliente

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
| developer_id | uuid | FK → developers(id) ON DELETE SET NULL | Developer constructor (opcional, auto-set para rol developer) |
| development_id | uuid | FK → developments(id) ON DELETE SET NULL | Desarrollo/proyecto (opcional, solo para developer) |
| development | text | nullable | Nombre del desarrollo (texto libre, todos los roles) — migración 019 |
| development_area | numeric | nullable | Área total del desarrollo en sqft (número libre) — migración 019 |
| developer | text | nullable | Nombre del developer (texto plano; auto-completado para developer, editable para broker/private_seller) — migración 019 |
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
  description: string | null;   // HTML sanitizado (TipTap) o legacy **bold**
  country: string | null;
  cover_image: string | null;   // migración 011
  city: string | null;          // migración 011
  on_time_completion: number | null;  // migración 011
  email: string | null;         // migración 011
  phone: string | null;         // migración 011
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

// --- Tabla broker_profiles ---
interface BrokerProfile {
  id: string;
  user_profile_id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  personal_url: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  email_public: string | null;
  phone: string | null;
  whatsapp: string | null;
  closed_transactions: number;
  rera_card_url: string | null;   // migración 022
  qr_code_url: string | null;     // migración 022
  agency_orn: string | null;      // migración 022
  details_confirmed: boolean;     // migración 022
  is_verified: boolean;
  created_at: string;
  updated_at: string;
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
  broker_name: string;
  broker_slug: string;
  private_seller_name: string;
  developer: string;           // texto plano (migración 019)
  development: string;         // texto plano del desarrollo (migración 019)
  development_area: number | null; // área del desarrollo en sqft (migración 019)
  development_name: string;    // resuelto: row.development ?? devt?.name
  development_slug: string;
  development_total_area: number; // alias de development_area ?? 0
  development_amenities: string[];
  community_name: string;
  community_slug: string;
  community_total_area: number; // hardcodeado a 0 (pedido explícito)
  community_description: string | null;

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
- Storage bucket `developer-images` — imágenes de la página de developer: cover, logo y descripción (público, 5MB, jpeg/png/webp, folder-based RLS `developer-images/{user_id}/{folder}/`) — migración 012
- `cities` — ciudades curadas por país para el dropdown del form de developer (SELECT público, UNIQUE(country, name), seed con 50 ciudades de EAU) — migración 013 + `supabase/seed/cities.sql`

#### 7.2.11 Tabla: broker_profiles

Creada por migración `supabase/migrations/014_broker_profile.sql`; ampliada por `022_broker_credentials.sql` (credenciales RERA/QR/ORN/confirmación).

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del perfil de broker |
| user_profile_id | uuid | NOT NULL, UNIQUE, FK → user_profiles(id) ON DELETE CASCADE | Perfil de usuario asociado |
| name | text | NOT NULL | Nombre del broker |
| slug | text | NOT NULL, UNIQUE | Slug único |
| profile_image | text | nullable | URL de imagen de perfil |
| personal_url | text | nullable | URL de sitio web personal |
| description | text | nullable | Descripción (HTML sanitizado por TipTap) |
| country | text | nullable | País de operación |
| city | text | nullable | Ciudad de operación |
| email_public | text | nullable | Email de contacto público |
| phone | text | nullable | Teléfono de contacto |
| whatsapp | text | nullable | Número de WhatsApp |
| closed_transactions | integer | DEFAULT 0 | Transacciones cerradas (auto-declarado, 0–100.000) |
| rera_card_url | text | nullable | URL de la imagen de la RERA Broker Card / ID (migración 022) |
| qr_code_url | text | nullable | URL del QR code del broker (migración 022) |
| agency_orn | text | nullable | Office Registration Number de la agencia que lo emplea, max 64 chars (migración 022) |
| details_confirmed | boolean | NOT NULL DEFAULT false | Si el broker confirmó que sus detalles están al día (migración 022) |
| is_verified | boolean | NOT NULL DEFAULT false | Broker verificado |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de última actualización |

**Índices:** `slug`, `user_profile_id`
**Constraints:** `UNIQUE (user_profile_id)` — una sola página de broker por usuario
**Trigger:** `trigger_set_updated_at_broker_profiles`
**Políticas RLS:**
- SELECT público: brokers verificados (`is_verified = true`)
- SELECT propio: broker ve su propio perfil (`auth.uid() = user_profile_id`, sin filtro verificación)
- INSERT propio: `broker_profiles_insert_own` — solo si `auth.uid() = user_profile_id`
- UPDATE propio: `broker_profiles_update_own` — solo el dueño

#### 7.2.12 Storage: broker-images

Bucket creado por migración `supabase/migrations/014_broker_profile.sql`.

- **Público:** true
- **Tamaño máximo:** 5MB
- **MIME types:** image/jpeg, image/png, image/webp
- **Estructura:** `broker-images/{user_id}/{folder}/{filename}`
- **Políticas:** SELECT público, INSERT/DELETE solo en la carpeta del usuario autenticado (`(storage.foldername(name))[1] = auth.uid()::text`)
- **Upload:** `lib/storage.ts` → `uploadImage(file, userId, folder, "broker-images")` (reutiliza la misma función que developer-images)

#### 7.2.13 Tablas legacy
- `developer_profiles` — reemplazada por `user_profiles` (migración 002). Se mantiene por retrocompatibilidad.
- `properties` (v003) — reemplazada por la versión 007 con FKs a `developers`, `developments` y `user_profiles`
- `payment_plan_milestones` (v004) — reemplazada por la versión 007 con CHECK en percentage y RLS mejorado

#### 7.2.14 Tablas pendientes de crear
- `favorites` — favoritos del inversor
- `inquiries` — consultas de inversores a vendedores

### 7.3 Estructura de rutas

#### Sitio público (en inglés, sin prefijo de locale)

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Homepage (locale default `en`, sin prefijo) |
| `/properties-list` | Público | Listado de propiedades con filtros |
| `/property/[slug]` | Público | Detalle de propiedad |
| `/communities` | Público | Listado de comunidades (DB + búsqueda client) |
| `/community/[slug]` | Público | Detalle de comunidad (descripción sanitizada, mapa, galería) |
| `/developers` | Público | Listado de promotoras (DB, solo verified, búsqueda por texto visible) |
| `/developer/[slug]` | Público | Detalle de promotora (descripción HTML sanitizada, info card, estilos) |
| `/broker/[slug]` | Público | Detalle de broker (header circular, descripción, propiedades activas, contacto) |
| `/auth/login` | Público | Login unificado |
| `/auth/sign-up/[role]` | Público | Registro por role (developer/broker/private-seller) |
| `/auth/sign-up` | Público | Redirect a `/auth/sign-up/developer` |
| `/auth/forgot-password` | Público | Reset de contraseña |
| `/auth/update-password` | Público | Actualizar contraseña |
| `/auth/confirm` | Público | Callback de confirmación email → onboarding o dashboard |
| `/auth/onboarding/[role]` | Autenticado | Onboarding post-confirmación por role |
| `/auth/payment` | Autenticado | Selección de plan por perfil (mock de tiers, sin Stripe; post-onboarding → `/app`) |
| `/auth/error` | Público | Error de autenticación |
| `/auth/sign-up-success` | Público | Éxito de registro |
| `/protected` | Autenticado | Página protegida inversor (placeholder) |

#### Plataforma de vendedores (sin i18n)

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Público | Redirect a `/auth/login` |
| `/signup` | Público | Redirect a `/auth/sign-up/developer` |
| `/app` | Autenticado | Dashboard unificado con sidebar según role |
| `/app/settings` | Autenticado | Configuración (placeholder en sidebar) |
| `/app/developer` | Developer | Form de perfil de la promotora (rich text TipTap, slug, cover/logo, city, on-time, contacto) |
| `/app/broker` | Broker | Form de perfil del broker (rich text TipTap, slug, profile image, city, contacto, transacciones) |
| `/app/properties` | Autenticado | Listado de propiedades del seller |
| `/app/properties/new` | Autenticado | Crear propiedad (PropertyForm con 11 secciones) |
| `/app/properties/[id]/edit` | Autenticado | Editar propiedad existente (PropertyForm + milestones + delete) |
| `/app/analytics` | Developer | Analytics (pendiente) |
| `/app/clients` | Broker | Clientes (pendiente) |

### 7.4 Seguridad y acceso

- **Autenticación:** Supabase Auth con sesiones gestionadas por cookies
- **Middleware unificado:** `proxy.ts` combina:
  - next-intl locale routing (público, solo default `en`)
  - `stripLocalePrefix()`: redirige (301) cualquier URL con prefijo de locale (`/es/...`, `/ar/...`) a la versión limpia en inglés
  - Auth middleware para rutas protegidas y dashboard
  - Sin geo-detección de idioma (eliminada)
- **Fix auth routes:** En `proxy.ts`, las rutas de auth ejecutan `updateSession()` antes de `intlMiddleware()` para resolver el locale correctamente antes de redirigir
- **Protección del dashboard:** `updateSession()` en `lib/supabase/middleware.ts` verifica sesión en `/app/*`. Si no hay usuario, redirige a `/auth/login`. Si hay usuario en `/auth/login` o `/auth/sign-up`, redirige a `/app`.
- **Protección del sitio público:** `updateSession()` también protege `/protected` y `/auth/*` (excepto rutas públicas como login, sign-up, forgot-password, etc.)
- **Onboarding gate:** El confirm route handler lee `user_profiles.profile_completed`. Si es `false`, redirige a `/auth/onboarding/{role}`. Si es `true`, redirige a `/app`. (Sin cookie `NEXT_LOCALE`; rutas sin prefijo de locale)
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
- **Sanitización user-generated:** descripciones de developers (HTML de TipTap) pasan SIEMPRE por `sanitizeUserHtml()` en cliente y en servidor antes de persistir (allowlist estricto: p, strong, em, br, ul, ol, li, blockquote, h2, h3, img; bloqueo de scripts/iframes/links/forms/embeds; tags truncados escapados a entidades)
- **Origin check de imágenes:** los `<img>` de la descripción solo se conservan si apuntan a `https://` + host de Supabase Storage; cualquier otro origen se elimina
- **Validación de website:** auto-prefijo `https://` y validación http(s) en `saveDeveloperProfile` (server) + `safeWebsite` en el info-card (evita `javascript:`)
- **RLS en developers:** INSERT/UPDATE solo del owner (`auth.uid() = user_profile_id`, migración 011); una sola página por usuario (UNIQUE)
- **RLS en bucket `developer-images`:** SELECT público; INSERT/DELETE solo en la carpeta del usuario autenticado (`(storage.foldername(name))[1] = auth.uid()`)
- **RLS en broker_profiles:** SELECT público solo para brokers verificados (`is_verified = true`); SELECT propio sin restricción de verificación (`auth.uid() = user_profile_id`); INSERT/UPDATE solo del owner (`auth.uid() = user_profile_id`)
- **RLS en bucket `broker-images`:** SELECT público; INSERT/DELETE solo en la carpeta del usuario autenticado (`(storage.foldername(name))[1] = auth.uid()`)
- **RLS en `cities`:** SELECT público (dato curado)

---

## 8. FLUJOS DE USUARIO DETALLADOS

### Flujo A: Inversor busca propiedades (sitio público)

```
1. Inversor llega a la homepage (siempre en inglés, sin detección de idioma)
2. Usa campo de búsqueda o dropdowns de filtro (categoría, precio, estado)
3. Navega a /properties-list
4. Usa filtros avanzados (location, category, price range, status, + more)
5. Explora PropertyCards con precios en su moneda
6. Puede cambiar moneda con CurrencySwitcher — todas las cards se actualizan en vivo
7. Hace clic en una card → navega a /property/[slug] (detalle de propiedad)
8. Ve gallery, details, amenities, payment plan, tags, related properties
9. Hace clic en "Contact" o WhatsApp en el detalle o sidebar
```

⚠️ El paso 2 (búsqueda en homepage) tiene UI pero no dispara navegación. El paso 9 tiene botones pero sin acción de contacto real. Los links a `/developer/[slug]` y `/broker/[slug]` del sidebar de propiedad ahora resuelven según `listed_by_type` (ver Flujo I). Los de `/development/[slug]` siguen en mock data.

**Servicios consumidos:** CurrencyContext, Intl.NumberFormat, filter-options.ts

### Flujo B: Usuario se registra con un role

```
1. Usuario navega a /auth/sign-up/developer (o /broker, o /private-seller)
2. Ve 3 tabs (Developer, Broker, Private Seller) — el tab activo corresponde a la URL. Labels traducidos via useTranslations("auth.sign_up")
3. Si cambia de tab, navega a /auth/sign-up/{nuevo-role} (URL cambia)
4. Completa formulario: full name, email, password, repeat password
5. Submit → supabase.auth.signUp() con options.data.role = activeTab y emailRedirectTo = ${origin}/auth/confirm (sin prefijo de locale)
6. Trigger handle_new_user() crea registro en user_profiles con role, email y campos vacíos
7. Redirige a /auth/sign-up-success (email de confirmación pendiente)
8. Usuario confirma email → /auth/confirm route handler verifica OTP y redirige a /auth/onboarding/{role} (si profile_completed=false) o /app (si ya lo completó); tras el onboarding el flujo continúa a /auth/payment
```

**Servicios consumidos:** Supabase Auth, user_profiles (trigger)

### Flujo C: Onboarding post-confirmación

```
1. Confirm route handler verifica OTP con supabase.auth.verifyOtp() (sin cookie NEXT_LOCALE)
2. Lee user_profiles.role y user_profiles.profile_completed
3. Si profile_completed === false → redirect a /auth/onboarding/{role}
4. Si profile_completed === true → redirect a /app
6. Onboarding page muestra formulario con campos condicionales:
   - Developer: company name*, company website, operating country*, phone*
   - Broker: company name*, company website, operating country*, RERA Broker Card / ID* (imagen, bucket broker-images/rera), QR Code (opcional, bucket broker-images/qr), Agency ORN, checkbox "I confirm these details are up to date", phone*
   - Private Seller: country of residence*, phone*
7. Submit → actualiza user_profiles con campos + profile_completed = true. Para role broker, hace además upsert en broker_profiles (rera_card_url, qr_code_url, agency_orn, details_confirmed)
8. Redirige a /auth/payment (selección de plan)
```

**Servicios consumidos:** Supabase Auth (verifyOtp), user_profiles (select + update)

### Flujo D: Login de vendedor

```
1. Usuario navega a /auth/login (o /login que redirige aquí). Contenido servido en inglés (`en`)
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
1. Usuario navega a /communities
2. communities/page.tsx (server) llama a getCommunities(locale): select("*, community_translations(*)") filtrando is_active = true
3. Se resuelve la traducción con fallback locale → `DEFAULT_LOCALE` (`en`) → primera y se ordena con localeCompare(locale)
4. CommunitiesGrid (client) filtra por texto (nombre, ciudad, location, tags) con useState/useMemo
5. Clic en CommunityCard → /community/{slug} (via @/i18n/navigation)
6. community/[slug]/page.tsx llama a getCommunityBySlug(slug, locale) con .maybeSingle(); si no existe o está inactiva → notFound()
7. Descripción HTML se sanitiza con sanitizeHtml() antes de dangerouslySetInnerHTML
8. CommunityHeader renderiza imagen destacada + iframe de Google Maps (si google_map_url validada)
9. CommunityInfoCard muestra average_price_range y CTA "See properties" → /properties-list?community={slug} ⚠️ (ruta inexistente)
```

**Servicios consumidos:** Supabase server client, `lib/communities.ts`, `lib/sanitize-html.ts`

### Flujo H: Developer edita su perfil (plataforma /app)

```
1. Developer navega a /app → sidebar "Developer Profile" (/app/developer)
2. Server page verifica sesión + role developer (otro role → redirect a /app)
3. Carga profile (user_profiles), getMyDeveloper(user.id) y cities del operating country
4. Form prefill: name (developer.name ?? company_name), slug auto, descripción legacy **bold** → HTML (toEditorHtml)
5. Edita la descripción con RichTextEditor (negrita, cursiva, H3, listas, blockquote, imagen)
6. Sube imagen → uploadImage() al bucket developer-images/{userId}/description/ → se embebe como <img>
7. Save → sanitizeUserHtml() en cliente → saveDeveloperProfile() (server action: getUser + validaciones + sanitización servidor + upsert)
8. Botón Save deshabilitado si no hay cambios; router.refresh() tras guardar
9. Público: /developers muestra la card con texto plano (stripHtmlToText) y /developer/[slug] el HTML sanitizado con estilos (ids en texto no traducibles)
```

**Servicios consumidos:** TipTap (rich-text-editor.tsx), lib/storage.ts (uploadImage), lib/actions.ts (saveDeveloperProfile), lib/sanitize-html.ts (sanitizeUserHtml), lib/developers.ts, lib/cities.ts, lib/countries.ts


### Flujo I: Broker edita su perfil (plataforma /app)

```
1. Broker navega a /app → sidebar "Broker Profile" (/app/broker)
2. Server page verifica sesión + role broker (otro role → redirect a /app)
3. Carga profile (user_profiles), getMyBroker(user.id) y cities del operating country
4. Form prefill: name (broker.name ?? company_name), slug auto, descripción legacy → HTML (toEditorHtml)
5. Edita la descripción con RichTextEditor (negrita, cursiva, H3, listas, blockquote, imagen)
6. Sube imagen de perfil → uploadImage() al bucket broker-images → se embebe como <img>
7. Sección "Credentials": RERA Broker Card / ID (bucket broker-images/rera), QR Code (bucket broker-images/qr, con preview), Agency ORN y checkbox de confirmación; se guardan vía saveBrokerProfile (ORN max 64 chars)
8. Save → sanitizeUserHtml() en cliente → saveBrokerProfile() (server action: getUser + validaciones + sanitización servidor + upsert)
9. Botón Save deshabilitado si no hay cambios; router.refresh() tras guardar
10. Si is_verified = false → banner "Pending verification..."
11. Público: /broker/[slug] muestra header circular, descripción y hasta 5 propiedades activas (solo si is_verified = true)
```

**Servicios consumidos:** TipTap (rich-text-editor.tsx), lib/storage.ts (uploadImage), lib/actions.ts (saveBrokerProfile), lib/sanitize-html.ts (sanitizeUserHtml), lib/brokers.ts, lib/cities.ts, lib/countries.ts

### Flujo J: Vendedor crea, edita y elimina propiedades (plataforma /app/properties)

```
1. Vendedor navega a /app → sidebar "Properties" (/app/properties)
2. Server page verifica sesión, carga getMyProperties(user.id) y renderiza PropertyList
3. PropertyList muestra tabla con 7 columnas: Property, Status, Price, Location, Specs, Created, Actions
4. Botón "Create Property" → /app/properties/new
5. NewPropertyPage carga ciudades del operating_country, amenities, subcategories, communities, y developments (solo developers); carga ownDeveloperName
6. PageHeader con back button "Back" → /app/properties
7. PropertyForm muestra 11 secciones: Basic Info, Location, Details, Pricing, Milestones, Development Details, Amenities, Images, Tags, Visibility
8. Slug se auto-genera desde Title (read-only); sqm se auto-calcula de sqft; deposit_amount se auto-calcula de price × deposit%
9. Sube cover image a property-images bucket; gallery images (hasta 10) al mismo bucket
10. Editar milestones con MilestonesEditor (CRUD dinámico); validación de total ≤ 100%
11. Sección Development Details: Development link (dropdown, solo developer), Development (texto), Development Area (sqft), Developer (auto-completado read-only para developer / editable para otros)
12. Save → saveProperty() (validación server-side + sanitización description + auto-set developer_id para developer + ownership check) → saveMilestones() → router.refresh()
13. Botón "Edit" en PropertyList → /app/properties/{id}/edit → mismo PropertyForm en modo edición con back button
14. Botón "Delete" en modo edición → AlertDialog "Are you sure?" → deleteProperty() (ownership check) → redirect a /app/properties
15. hasChanges compara cada campo; botón Save deshabilitado sin cambios
16. Botones full-width y apilados: Create Property + Cancel (creación) / Save + Delete (edición)
```

**Servicios consumidos:** lib/actions.ts (saveProperty, deleteProperty, saveMilestones), lib/properties.ts (getMyProperties, getMyProperty), lib/cities.ts, lib/property-amenities.ts, lib/property-subcategories.ts, lib/storage.ts (uploadImage), lib/sanitize-html.ts (sanitizeUserHtml), lib/utils.ts (slugify)

---

## 9. REGLAS DE NEGOCIO

1. **La moneda por defecto es USD** (global, no por locale). El usuario puede cambiarla y persiste 30 días.
2. **Las tasas de cambio son fijas en MVP.** No se consultan APIs externas. Se actualizan manualmente en `lib/exchange-rates.ts`.
3. **Los datos de propiedades del sitio público (listado y detalle) están conectados a Supabase.** La tabla `properties` se lee directamente. El dashboard de vendedores también lee de DB (`getMyProperties`). `lib/mock-properties.ts` fue eliminado.
4. **La búsqueda en homepage tiene UI pero no funcionalidad real.** Es placeholder visual.
5. **Los botones Contact y WhatsApp en PropertyCards y detalle de propiedad son placeholder.** No ejecutan consulta real (no hay endpoint ni conexión a DB).
6. **Las rutas de promotoras existen y leen de DB.** `/developers` y `/developer/[slug]` consultan Supabase (solo `is_verified = true`) desde el 05-Ago-2026. `/development/[slug]` sigue con mock data (no conectada a DB).
7. **El sitio se sirve siempre en inglés (locale `en`).** `defaultLocale = "en"` y `localePrefix = "never"`: las URLs no tienen prefijo de locale (`/`, `/properties`, `/property/[slug]`, etc.). Cualquier URL con prefijo de locale (`/es/...`, `/ar/...`) redirige (301) a la versión limpia en inglés. No hay selector de idioma visible para el usuario final; i18n (next-intl) está preservada pero inactiva.
8. **No hay geo-detección de idioma.** Se eliminó la detección geográfica y la cookie `NEXT_LOCALE`. El contenido se sirve siempre en inglés.
9. **Solo email/password en MVP.** Sin OAuth social.
10. **Usar `getUser()` en vez de `getClaims()`** para verificar sesión server-side (el JWT puede estar expirado aunque los claims se decodifiquen).
11. **Las propiedades del dashboard (`/app/properties`) se leen de Supabase via `getMyProperties()`.** El PropertyList es un componente real conectado a DB. SectionCards y DataTable del dashboard principal siguen con datos mock.
12. **Las páginas del dashboard de properties (`/app/properties`, `/app/properties/new`, `/app/properties/[id]/edit`) están implementadas y conectadas a DB.** Las sub-rutas `analytics` (Developer) y `clients` (Broker) siguen sin implementar.
13. **La tabla `user_profiles` se crea automáticamente al registrarse** vía trigger `handle_new_user()`. El role se extrae de `raw_user_meta_data->>'role'` (default: 'developer'). El onboarding se completa post-confirmación de email.
14. **El middleware de auth para el dashboard es independiente del i18n.** Las rutas `/app`, `/login` y `/signup` no tienen locale prefix y no pasan por next-intl.
15. **El confirm route handler redirige a rutas sin prefijo de locale.** Verifica OTP y `user_profiles.profile_completed`: redirige a `/auth/onboarding/{role}` o `/app`. No usa cookie `NEXT_LOCALE`.
16. **Los pricing plans están configurados pero no se aplican.** Son referencia para futura implementación de planes pagos.
17. **El role se almacena en dos lugares:** `raw_user_meta_data` de Supabase Auth (al registrarse) y `user_profiles.role` (tabla propia). El confirm route handler y el app layout leen de `user_profiles`.
18. **Los componentes usan campos planos para acceder a datos de tablas relacionadas.** `PropertyData` incluye campos "joined" (`developer_name`, `development_name`, etc.) que replican datos de `developers` y `developments`. Cuando se conecte a Supabase real, se resolverán vía `select` con joins o vistas materializadas.
19. **Auth forms con i18n preservada pero contenido en inglés.** Namespace `auth` en `messages/{locale}.json` con 7 locales, pero el contenido se sirve en inglés (`en`). Los form components ya no usan `useLocale()`.
20. **emailRedirectTo y redirectTo apuntan a rutas sin prefijo de locale.** El sign-up form construye `${origin}/auth/confirm` y el forgot-password form `${origin}/auth/update-password`. Sin `useLocale()`.
21. **Componentes organizados por dominio.** `site/` (público), `properties/` (listado/detalle), `auth/` (formularios), `shared/` (currency), `platform/` (dashboard). `ui/` solo primitivas shadcn.
22. **La ruta del dashboard es `/app`** (no `/dashboard`). Rename realizado para simplificar.
23. **El CTA "See properties" del detalle de comunidad apunta a `/properties-list?community={slug}`, ruta inexistente.** La lista real es `/properties` y no lee query params. ⚠️
24. **Las comunidades son contenido curado en DB, no user-generated.** Solo se escriben vía migración/seed (service_role). No hay INSERT/UPDATE desde cliente.
25. **Las traducciones de comunidades se resuelven con fallback locale → `DEFAULT_LOCALE` (`en`) → primera disponible.** Hoy solo existe la fila base 'ae' (inglés en todos los locales); las traducciones se agregan por fila en `community_translations`, no en los mensajes. ⚠️ Ver nota técnica de inconsistencia (DEFAULT_LOCALE `en` vs filas base `ae`).
26. **`developer_id` en communities está NULL** (el CSV de Webflow no traía developers). El seed no lo pisa en el `DO UPDATE`. El bloque "Main Developer" se reimplementará cuando haya datos.
27. **Las descripciones de comunidades usan `dangerouslySetInnerHTML` solo tras `sanitizeHtml()`.** No aplicar a contenido user-generated.
28. **Los iframes de Google Maps se renderizan solo si la URL pasa la validación** (host `google.com/maps` + path `/maps/`), con `sandbox` y `referrerPolicy="no-referrer"`.
29. **La migración 008 + seed de communities requieren ejecución manual en Supabase** (SQL Editor). Hasta entonces, las páginas de communities muestran vacío.
30. **Las descripciones de developer son user-generated HTML de TipTap.** Se sanitizan SIEMPRE con `sanitizeUserHtml()` en cliente y en servidor antes de persistir. No aplicar `sanitizeHtml()` (curado) ni renderizar sin sanitizar.
31. **Las imágenes de la descripción solo pueden apuntar al origin de Supabase Storage.** Los `<img>` con otro origen se eliminan en la sanitización (origin check del host de `NEXT_PUBLIC_SUPABASE_URL`).
32. **Una sola página de developer por usuario.** `UNIQUE(user_profile_id)`; INSERT/UPDATE solo del owner vía RLS (`developers_insert_own` / `developers_update_own`).
33. **El bucket `developer-images` es público para SELECT pero INSERT/DELETE solo en la carpeta propia.** Estructura `developer-images/{user_id}/{folder}/` (description, covers, logos).
34. **Las descripciones legacy `**bold**` conviven con el HTML.** Se convierten a HTML al editar (`toEditorHtml`) y se renderizan como texto con `<strong>` en el detalle si no son HTML.
35. **La card del listado muestra texto plano y el buscador filtra por texto visible.** `stripHtmlToText()` quita etiquetas y decodifica entidades.
36. **El botón Save del form de developer se deshabilita sin cambios.** Para registros existentes, website/email/phone no se rellenan desde `user_profiles` (no se pisan datos guardados).
37. **El CTA "See developer properties" apunta a `/properties-list?developer={slug}`, ruta inexistente.** Mismo problema que el CTA de comunidades. ⚠️
38. **Una sola página de broker por usuario.** `UNIQUE(user_profile_id)` en `broker_profiles`; INSERT/UPDATE solo del owner vía RLS (`broker_profiles_insert_own` / `broker_profiles_update_own`).
39. **La página pública del broker solo es visible para brokers verificados.** `getBrokerBySlug()` filtra por `is_verified = true`. El broker dueño puede ver su perfil sin verificar vía la política RLS `broker_profiles_select_own`.
40. **El sidebar de propiedad linka a `/broker/{slug}` o `/developer/{slug}` según `listed_by_type`.** La propiedad tiene campos `broker_name` y `broker_slug` que se resuelven al vender el broker. Si el broker no tiene perfil público (no verificado o no creado), el link puede no funcionar.
41. **Las descripciones de broker usan el mismo sanitizador que las de developer.** `sanitizeUserHtml()` con la misma allowlist. El componente `BrokerDescription` usa la clase `.rich-description` compartida en `globals.css`.
42. **El upload y gestión de propiedades (`/app/properties`) está implementado para los 3 roles.** El form PropertyForm tiene 11 secciones (componentizadas en `components/platform/property-form/`), incluye MilestonesEditor para plan de pago, Development Details con campos planos, auto-cálculos (sqm↔sqft, deposit_amount↔%), slug auto-generado, y gallery upload al bucket `property-images`. Las server actions (`saveProperty`, `deleteProperty`, `saveMilestones`) incluyen validaciones server-side y ownership checks (`listed_by_id = user.id`). Las descripciones se sanitizan con `sanitizeUserHtml()` antes de persistir.
43. **Los campos `development`, `development_area` y `developer` son columnas planas en la tabla `properties`** (migración 019). No se reusa la tabla `developments` para el nombre y área del desarrollo en la sección "Development Details". La FK `development_id` se mantiene para el vínculo opcional a un development existente (solo developer).
44. **Para el rol developer, `developer_id` se auto-setea** desde la tabla `developers` por `user_profile_id`, y `developer` se completa con el nombre del perfil. Para broker/private_seller, `developer_id` se fuerza a null y `developer` se guarda como texto plano.
45. **`community_total_area` queda hardcodeado a 0** en la resolución de datos de propiedades (`lib/properties.ts`). Pedido explícito del usuario de no tocarlo.
46. **Los forms de crear/editar propiedad tienen un back button** (`PageHeader` con `backHref="/app/properties"`) que lleva al listado. Los forms de broker y developer NO tienen back button.
47. **Los botones de acción de los forms son full-width y apilados** (uno debajo del otro). Creación: Create + Cancel. Edición (property): Save + Delete con AlertDialog. Broker/developer: solo Save (sin Delete).

---

## 10. SUPUESTOS Y RESTRICCIONES

**Supuestos:**
- Los inversores tienen acceso a internet y usan navegador web
- Los vendedores (developers, brokers, private sellers) tienen capacidad técnica para listar sus unidades (o reciben asistencia)
- El mercado Off-Plan es suficientemente grande como para justificar una plataforma global
- Los inversores están dispuestos a contactar a vendedores directamente sin agente de por medio
- El sitio se sirve siempre en inglés; i18n (next-intl) está preservada pero inactiva, sin selector de idioma ni geo-detección

**Restricciones:**
- Las tablas `properties`, `payment_plan_milestones`, `developers`, `developments` y `communities` se leen de Supabase en la UI pública y en el dashboard de vendedores. `lib/mock-properties.ts` fue eliminado. La tabla `developments` aún no tiene página de listado conectada a DB (usa mock data). `community_total_area` queda hardcodeado a 0 en la resolución de propiedades
- Sin mapa funcional en MVP (pendiente geolocalización)
- Sin pagos integrados en la plataforma
- Sin comparador de propiedades
- Sin app nativa mobile
- Solo email/password en auth
- Tasas de cambio fijas, no automáticas
- Sin modo offline
- La ruta `/development/[slug]` usa mock data (no conectada a DB); `/developer/[slug]` sí lee de DB
- Sin dashboard de inversor (favoritos, consultas)
- Los botones de contacto (WhatsApp, Phone) no ejecutan acciones reales
- La página principal del dashboard (`/app`) sigue con datos mock (SectionCards, DataTable). El listado de propiedades (`/app/properties`) ahora lee de Supabase
- Las sub-rutas del sidebar del dashboard `analytics` (Developer) y `clients` (Broker) no tienen páginas implementadas. `properties` (todos los roles) SÍ está implementado con CRUD completo
- Los pricing plans están configurados pero no se cobran ni se aplican
- La ruta `/app` no tiene page.tsx funcional (solo placeholder)
- La migración 008 + seed de communities no están ejecutadas en producción (requieren SQL Editor manual)
- Las traducciones de comunidades solo existen en locale 'ae' (el contenido se muestra en inglés en todos los locales)
- El CTA "See properties" de comunidades apunta a una ruta inexistente (`/properties-list?community={slug}`)

**⚠️ Nota técnica — Inconsistencia de datos detectada:**
- Las traducciones base de comunidades en `community_translations` (seed/migración 008) usan `locale = 'ae'` (contenido en inglés), mientras que el código ahora usa `DEFAULT_LOCALE = "en"`. La resolución cae por fallback a `translations[0]`, por lo que el contenido en inglés se muestra igual, pero no hay match directo. Pendiente decidir si renombrar el locale base a `en` o mantener `ae` como fallback de contenido. No se modifica dato alguno en esta tarea.

---

## 11. ROADMAP EVOLUTIVO

### ✅ Completado
- Homepage completa con hero, features, about, FAQ, contacto, footer
- Sistema i18n con next-intl preservado pero inactivo: sitio siempre en inglés, `defaultLocale = en`, `localePrefix = never`, sin geo-detección, sin cookie `NEXT_LOCALE`, sin selector de idioma
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
- Auth i18n: namespace `auth` con 7 locales (archivos de mensajes preservados; contenido servido en inglés `en`)
- Auth components con i18n preservada (sin `useLocale()`; contenido servido en inglés)
- Role labels traducidos en sign-up form
- `emailRedirectTo` y `forgot-password` redirectTo apuntan a rutas sin prefijo de locale
- `confirm/route.ts` redirige a rutas limpias (`/auth/onboarding/{role}`, `/app`) sin cookie `NEXT_LOCALE`
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
- Listado `/developers` y detalle `/developer/[slug]` conectados a Supabase (solo `is_verified`, búsqueda por texto visible, `lib/mock-developers-detail.ts` eliminado)
- Form de perfil de developer `/app/developer` con slug auto + copy URL, city select, cover/logo upload y Save con detección de cambios
- Editor rich text TipTap para la descripción de developer (negrita, cursiva, H3, listas, blockquote, imágenes)
- Upload de imágenes al bucket `developer-images/{userId}/description/` (migración 012)
- Sanitización user-generated `sanitizeUserHtml` (allowlist estricto + origin check) en cliente y servidor
- Migración 011: campos de página pública en `developers` (cover_image, city, on_time_completion, email, phone) + UNIQUE(user_profile_id) + políticas INSERT/UPDATE del owner
- Tabla `cities` curada + 50 ciudades de EAU (migración 013 + seed)
- `.developer-description` styles en globals.css; namespace `developer_detail` + `no_results` en `developers` traducidos a 7 locales
- Tabla `broker_profiles` con campos de página pública + RLS INSERT/UPDATE del owner (migración 014)
- Storage bucket `broker-images` (5MB, jpeg/png/webp) con RLS por carpeta del usuario (migración 014)
- Data access `lib/brokers.ts`: `getBrokerBySlug()`, `getMyBroker()`, tipo `BrokerDetailData`
- Página pública `/broker/[slug]` conectada a DB (solo `is_verified = true`): header circular, descripción HTML sanitizada + bold legacy, hasta 5 propiedades activas, stats
- Form de perfil de broker `/app/broker` (solo rol broker): `broker-form.tsx` + ImageUpload + RichTextEditor TipTap
- Server action `saveBrokerProfile` en `lib/actions.ts` con validaciones server-side
- Integración de `PropertySidebar` con `listedByType`: link condicional a `/broker/{slug}` o `/developer/{slug}`
- Campos `broker_name` y `broker_slug` en `PropertyData`
- Namespace `broker_detail` traducido en 7 locales (ae, ar, es, gb, pt, br, mx)
- Property upload form (`PropertyForm`) con 11 secciones: Basic Info, Location, Details, Pricing, Milestones, Development Details, Amenities, Images, Tags, Visibility
- `MilestonesEditor` CRUD para plan de pago con validación de total ≤ 100%
- `PropertyList` table con 7 columnas (property, status, price, location, specs, created, actions) en `/app/properties`
- Dashboard pages de propiedades: listing (`/app/properties`), create (`/app/properties/new`), edit (`/app/properties/[id]/edit`)
- Server actions: `saveProperty`, `deleteProperty`, `saveMilestones` con validaciones server-side y ownership checks
- Data access: `getMyProperties`, `getMyProperty` para queries del dashboard
- Namespace `property_form` traducido en 7 locales
- Fix `PropertyCard`: logo rendering condicional para evitar `src=""` vacío
- `primary.DEFAULT` agregado a Tailwind config para clases de utilidad `border-primary`, `bg-primary/10`, `text-primary`
- `lib/mock-properties.ts` eliminado — todas las fuentes de datos ahora son reales (Supabase)
- Migración 019: columnas `development`, `development_area`, `developer` en tabla `properties` (campos planos para la sección Development Details)
- PropertyForm componentizada en 11 secciones con archivos individuales en `components/platform/property-form/`
- Sección "Development Details" funcional: Development link (dropdown FK), Development (texto plano), Development Area (sqft), Developer (auto-completado para developer / editable para otros)
- Página de detalle de propiedad imprime datos de Development Details (nombre, área, developer con link condicional)
- `PageHeader` con back button en páginas de crear/editar propiedad (`/app/properties/new`, `/app/properties/[id]/edit`)
- Botones de acción full-width y apilados en PropertyForm (Create+Cancel / Save+Delete)
- AlertDialog de confirmación (Radix UI) para Delete en PropertyForm (reemplaza `confirm()` nativo)
- Componente `FormSection` wrapper para secciones del form (`components/platform/property-form/form-section.tsx`)
- `ownDeveloperName` como prop del PropertyForm (nombre del developer del perfil del usuario)

### 🔜 Siguientes pasos
- **Corto plazo:** Implementar páginas del sidebar: `/app/analytics` (Developer), `/app/clients` (Broker), `/app/settings` (todos)
- **Corto plazo:** Conectar `/development/[slug]` a la tabla `developments` (hoy usa mock data)
- **Corto plazo:** Conectar la búsqueda de homepage a resultados reales (navegación a `/properties-list` con query params)
- **Corto plazo:** Implementar envío real de consultas Contact y WhatsApp (conectar a backend/Supabase)
- **Mediano plazo:** Dashboard de inversor (favoritos, consultas)
- **Corto plazo:** Ejecutar migración 008 + seed de communities en Supabase (producción)
- **Corto plazo:** Conectar el CTA "See properties" de communities a `/properties` con query param `community`
- **Corto plazo:** Asignar `developer_id` a cada comunidad (dato pendiente en Webflow)
- **Mediano plazo:** Traducir comunidades a locales adicionales (hoy solo existe la fila base 'ae') — condicional a reactivar i18n
- **Mediano plazo:** Panel de administración completo para vendedores (gestión de propiedades, consultas)
- **Mediano plazo:** Mapa global con unidades geolocalizadas
- **Mediano plazo:** Conectar DataTable del dashboard a datos reales de propiedades
- **Mediano plazo:** Aplicar pricing plans (planes pagos según role y país)
- **Largo plazo:** Comparador lado a lado de propiedades
- **Largo plazo:** Calculadora de rentabilidad / ROI
- **Largo plazo:** Valoraciones y reseñas de vendedores
- **Largo plazo:** App nativa mobile (iOS / Android)
- **Corto plazo:** Página de listado de brokers `/brokers` (similar al listado de developers)
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
| Locale | Identificador de idioma/región (ej: en, ae, es, gb, br). El sitio se sirve siempre en `en` (default); los demás quedan dormidos en la config |
| RLS | Row Level Security — mecanismo de seguridad a nivel de fila en Supabase |
| user_profiles | Tabla unificada de perfiles con roles (reemplaza developer_profiles como tabla principal) |
| SectionCards | Componente de tarjetas de métricas en el dashboard |
| DataTable | Tabla interactiva con drag & drop, filtros, paginación y edición inline |
| Onboarding | Flujo post-registro donde el usuario completa los datos de su perfil según su role |
| Pricing Plans | Matriz de precios configurada por role × país para futuros planes pagos |
| Campos planos | Patrón de diseño donde `PropertyData` incluye datos "joined" de tablas relacionadas (`developer_name`, `development_name`, etc.) para evitar joins en tiempo de render |
| TipTap | Librería de editor rich text (ProseMirror) usada en los forms de developer y broker para la descripción |
| sanitizeUserHtml | Sanitizador HTML para contenido user-generated: allowlist estricto de tags y origin check de imágenes; se aplica en cliente y servidor |
| broker_profiles | Tabla de perfiles públicos de brokers con datos profesionales (migración 014), patrón similar a `developers` pero con campos específicos de broker |
| PropertyForm | Componente de formulario para crear/editar propiedades en el dashboard; 11 secciones (basic info, location, details, pricing, milestones, development details, amenities, images, tags, visibility) + back button + AlertDialog delete; client component con auto-cálculos, detección de cambios y secciones componentizadas en `components/platform/property-form/` |
| MilestonesEditor | Componente CRUD dinámico para gestionar hitos del plan de pago de una propiedad; incluye validación de total ≤ 100% y auto-cálculo de montos |
| PropertyList | Componente de tabla en el dashboard del vendedor que muestra las propiedades del usuario con 7 columnas (property, status, price, location, specs, created, actions) |
| Ownership check | Verificación server-side de que el usuario autenticado es el dueño de la entidad que intenta modificar (ej: `listed_by_id = user.id` en properties, `user_profile_id = user.id` en developers/brokers) |
| Migration 019 | Migración que agrega columnas planas `development`, `development_area` y `developer` a la tabla `properties` para la sección "Development Details" |
| localePrefix: never | Configuración de next-intl que elimina el prefijo de locale de las URLs; cualquier URL con prefijo (`/es/...`, `/ar/...`) redirige (301) a la versión limpia en inglés |
| DEFAULT_LOCALE = en | Locale default del sitio (inglés). Toda la UI pública se sirve en inglés; i18n preservada pero inactiva |
| community_translations | Tabla de traducciones por comunidad y locale; la fila base usa `locale = 'ae'` (contenido en inglés), pendiente decidir si renombrar a `en` |
