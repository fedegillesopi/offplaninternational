# CONTEXT — Off Plan International

## 1. DESCRIPCIÓN DEL PRODUCTO

**Off Plan International** es una plataforma global de listing de propiedades Off-Plan. Permite a inversores buscar, comparar y contactar directamente con promotoras verificadas, sin intermediarios ni presión comercial.

**Problema que resuelve:** Comprar propiedades Off-Plan es confuso, lento y manejado por agentes de ventas con información parcial. No existe un lugar único donde se listen unidades individuales con datos financieros completos.

**Usuarios:**
- **Inversor/comprador:** busca unidades Off-Plan filtradas por depósito, plan de pago, tamaño, ubicación, fecha de entrega y promotora.
- **Developer:** promotora que lista unidades individuales y recibe consultas directas sin coste de intermediarios.
- **Broker:** intermediario que lista propiedades de múltiples promotoras.
- **Private Seller:** propietario individual que vende su propiedad.

**Propuesta de valor:**
- Transparencia total: datos financieros completos por unidad.
- Sin agentes: contacto directo con la promotora.
- Unidades individuales, no solo proyectos.
- Búsqueda granular con múltiples filtros.

## 2. ESTADO ACTUAL DEL MVP

### Frontend público (i18n)
- [x] Homepage con hero, features, about, FAQ, contacto, footer
- [x] Navbar responsive con menú mobile, currency switcher y auth button
- [x] HeroHeader con búsqueda y dropdowns de filtro (categoría, precio, estado)
- [x] Sección FAQ con accordion
- [x] Banner de contacto
- [x] Footer con links de navegación, redes sociales, copyright
- [x] Sistema i18n con 7 locales y geo-detección
- [x] CurrencySwitcher en navbar con persistencia en cookie (NEXT_CURRENCY)
- [x] Sistema de moneda: formato por locale + mapa locale→moneda por defecto
- [x] Página de listado de propiedades (estructura + cards + filtros + cambio de moneda en vivo)
- [x] Sistema de conversión de moneda (exchange-rates fijas para MVP)
- [x] Hook compartido useClickOutside para dropdowns
- [x] PropertyCard server component con traducciones y CurrencyPrice integrado
- [x] Barra de filtros completa (Location, Category, Price Range, Status, + More Filters, Map View)
- [x] BackToHome botón reutilizable
- [x] Interfaz `PropertyData` extraída a `lib/types.ts` con campos expandidos
- [x] Mock data actualizado con 3 propiedades completas en `lib/mock-properties.ts`
- [x] Página de detalle de propiedad (ruta `/[locale]/property/[slug]`)
- [x] Galería de imágenes con navegación y thumbnails (property-gallery.tsx)
- [x] Sidebar con precio, links y botones de contacto (property-sidebar.tsx)
- [x] Tabla de detalles (subcategoría, fecha, estado, entrega) (property-details-table.tsx)
- [x] Grid de amenities con modal overlay + scroll lock (property-amenities-grid.tsx)
- [x] Tabla de plan de pago (property-payment-plan.tsx)
- [x] Tags de propiedad (property-tags.tsx)
- [x] Sección de propiedades relacionadas (related-properties.tsx)
- [x] Breadcrumb con separador "/" (breadcrumb.tsx)
- [x] Traducciones completas para namespace `property_detail` en 7 locales
- [x] Auth completo en `[locale]/auth/`: login, sign-up, forgot-password, update-password, confirm, error, sign-up-success

### Auth + Dashboard (nuevo sistema con roles)
- [x] Sistema de 3 roles: Developer, Broker, Private Seller
- [x] Tabla `user_profiles` con roles (reemplaza `developer_profiles`)
- [x] Sign-up con tabs URL-driven por rol (`/auth/sign-up/[role]`)
- [x] Onboarding post-confirmación con campos condicionales por rol (`/auth/onboarding/[role]`)
- [x] Confirm route que lee role de user_profiles y redirige a onboarding o app
- [x] Dashboard unificado en `/app` con sidebar basado en role
- [x] Pricing plans por role × país en `lib/pricing-plans.ts`
- [x] Legacy routes: `/login` y `/signup` redirigen al nuevo sistema
- [x] Navbar actualizada con links a `/auth/login` y `/auth/sign-up`
- [x] Sidebar reestructurada: NAV_BY_ROLE con Dashboard + Properties para todos, Settings al fondo, dropdown de usuario con logout
- [x] Protección de rutas via middleware
- [x] Auth i18n: namespace `auth` traducido a 7 locales (login, sign-up, forgot-password, update-password, back_to_home)
- [x] Auth components actualizados con `useTranslations("auth.*")` — login-form, sign-up-form, forgot-password-form, update-password-form
- [x] Role labels traducidos en sign-up form (`t("roles.${role}")`)
- [x] `emailRedirectTo` en sign-up incluye locale via `useLocale()`
- [x] `forgot-password-form` redirectTo incluye locale
- [x] `confirm/route.ts` lee cookie `NEXT_LOCALE` para redirects locale-aware (`/app`, `/auth/onboarding/`, `/auth/error`)
- [x] Componentes reorganizados en directorios por dominio: `site/`, `properties/`, `auth/`, `shared/`, `platform/`
- [x] Directorios vacíos listos para roles: `developers/`, `brokers/`, `private-sellers/`
- [x] Template cleanup: 13 archivos eliminados (hero, logos, deploy-button, env-var-warning, theme-switcher, section-cards, data-table, tutorial/*, protected/layout+page, ui/sidebar.tsx)
- [x] Route group `(auth)/` eliminada
- [x] shadcn defaults restaurados: Button (`h-9`/`h-10`), Input (`h-9`), secondary variant, custom spacing eliminado de globals.css y tailwind.config.ts
- [x] UI primitives creados: `textarea.tsx`, `dialog.tsx` (Radix UI)
- [x] Rename `/dashboard` → `/app` en todas las rutas y referencias

### Comunidades
- [x] Migración 008: tablas `communities` y `community_translations` (patrón 007)
- [x] Seed `supabase/seed/communities.sql`: 42 comunidades de Dubai + 42 traducciones locale 'ae' (upserts idempotentes)
- [x] Data access `lib/communities.ts`: `getCommunities(locale)` y `getCommunityBySlug(slug, locale)` con fallback de traducción locale → 'ae' → primera
- [x] Página de listado `/[locale]/communities` (server) con búsqueda client-side
- [x] Página de detalle `/[locale]/community/[slug]` (server) con `notFound()`, descripción HTML sanitizada y galería condicional
- [x] `CommunityCard` en `components/site/` (compartido con grid de communities)
- [x] Componentes por dominio: `components/communities/` (grid, header, info-card, gallery)
- [x] Sanitizador HTML allowlist `lib/sanitize-html.ts` (sin dependencias externas)
- [x] Validación de `google_map_url`: solo host google.com/maps y path `/maps/`; iframe con `sandbox` + `referrerPolicy="no-referrer"`
- [x] Namespace `communities` (con `no_results`) en los 7 mensajes; namespace `community_detail` existente
- [x] Estilos `.community-description` en `globals.css` (h4, p, ul/ol, blockquote)
- [x] Limpieza: eliminados `lib/mock-communities.ts` y tipo `CommunityData` de `lib/types.ts` (el tipo `Community` vive en `lib/communities.ts`)
- [x] Auditoría reviewer/security aprobada; hallazgos aplicados

### Pendiente
- [ ] ⚠️ Ejecutar migración 008 + seed en SQL Editor de Supabase (las páginas de communities muestran vacío hasta entonces)
- [ ] Traducir comunidades a otros locales (hoy solo existe fila en locale 'ae'; el contenido se muestra en inglés en todos los locales)
- [ ] Asignar `developer_id` a cada comunidad (hoy NULL; el bloque "Main Developer" del info-card se reimplementará cuando haya datos)
- [ ] ⚠️ CTA "See properties" de `community-info-card.tsx` apunta a `/properties-list?community={slug}` — ruta inexistente (la lista real es `/properties` y no lee query params)
- [ ] Página de listado de desarrollos: existe con mock data hardcodeado, búsqueda deshabilitada — falta conectar a DB
- [ ] Página de listado de promotoras: existe con mock data hardcodeado, búsqueda deshabilitada — falta conectar a DB
- [ ] Panel de administración para promotoras
- [ ] Mapa global con unidades geolocalizadas
- [ ] Reemplazar componentes de tutorial de Supabase starter kit
- [ ] Dashboard de favoritos y consultas del usuario
- [ ] `app/app/settings` page: existe como placeholder (solo heading), sin contenido implementado
- [ ] Market news: páginas de listado y detalle con mock data — falta conectar a DB

## 3. STACK TECNOLÓGICO

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.2.6 | Framework principal (App Router) |
| TypeScript | ~5 | Lenguaje |
| React | 19.0.0 | UI |
| Tailwind CSS | 3.4.1 | Estilos |
| tailwindcss-animate | 1.0.7 | Animaciones Tailwind |
| tailwind-merge | 3.3.0 | Merge de clases condicionales |
| clsx | 2.1.1 | Condicionales de clase |
| class-variance-authority (cva) | 0.7.1 | Variantes de componentes |
| next-intl | 4.12.0 | Internacionalización (i18n) |
| next-themes | 0.4.6 | Temas (dark/light) |
| Supabase (@supabase/ssr) | 0.6.0 | Autenticación + backend |
| Supabase (@supabase/supabase-js) | 2.49.0 | Cliente Supabase |
| @radix-ui/react-checkbox | 1.3.1 | Checkbox accesible |
| @radix-ui/react-dropdown-menu | 2.1.14 | Dropdown menu |
| @radix-ui/react-label | 2.1.6 | Label accesible |
| @radix-ui/react-slot | 1.2.2 | Composición de componentes |
| radix-ui | 1.4.3 | Paquete monolítico Radix UI |
| lucide-react | 0.511.0 | Iconos |
| @tabler/icons-react | 3.44.0 | Iconos (dashboard y data table) |
| @tanstack/react-table | 8.21.3 | Manejo de tabla de datos |
| @dnd-kit/core | 6.3.1 | Drag & drop |
| @dnd-kit/modifiers | 9.0.0 | Modificadores drag & drop |
| @dnd-kit/sortable | 10.0.0 | Sortable drag & drop |
| @dnd-kit/utilities | 3.2.2 | Utilidades drag & drop |
| recharts | 3.8.0 | Gráficos (charts) |
| sonner | 2.0.7 | Toast notifications |
| vaul | 1.1.2 | Drawer component |
| zod | 4.4.3 | Validación de esquemas |
| @tailwindcss/container-queries | 0.1.1 | Container queries en Tailwind |
| ESLint | 9 | Linter |
| eslint-config-next | 15.3.1 | Config ESLint para Next.js |
| PostCSS | 8 | Procesador CSS |
| pnpm | — | Package manager |

## 4. ESQUEMA DE BASE DE DATOS

### user_profiles

Creada por migración `supabase/migrations/002_user_profiles.sql`. Reemplaza a `developer_profiles`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, references auth.users(id) ON DELETE CASCADE | UUID del usuario auth |
| role | text | NOT NULL, CHECK (role IN ('developer', 'broker', 'private_seller')) | Rol del usuario |
| full_name | text | NOT NULL DEFAULT '' | Nombre completo |
| email | text | NOT NULL | Email del usuario |
| phone | text | NOT NULL DEFAULT '' | Telefono |
| company_name | text | NOT NULL DEFAULT '' | Nombre de la empresa (developer/broker) |
| company_website | text | NOT NULL DEFAULT '' | URL de la empresa (developer/broker) |
| operating_country | text | NOT NULL DEFAULT '' | Pais de operacion: 'AE', 'PT', 'MX', etc. (developer/broker) |
| license_number | text | NOT NULL DEFAULT '' | Numero de licencia (broker) |
| country_of_residence | text | NOT NULL DEFAULT '' | Pais de residencia (private_seller) |
| profile_completed | boolean | NOT NULL DEFAULT false | Si completo el onboarding |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Triggers:**
- `trigger_set_updated_at_user_profiles`: actualiza `updated_at` automaticamente en cada UPDATE (renombrada en migración 007)
- `handle_new_user`: inserta perfil con role de `raw_user_meta_data->>'role'` (default 'developer') al crear usuario en `auth.users`

**Politicas RLS:**
- SELECT: solo propio perfil (`auth.uid() = id`)
- INSERT: solo propio perfil
- UPDATE: solo propio perfil

**Migracion de datos:**
- `002_user_profiles.sql` migra datos de `developer_profiles` a `user_profiles` con role='developer'

### developer_profiles (LEGACY - no usar)

La tabla `developer_profiles` fue reemplazada por `user_profiles`. La migracion `002_user_profiles.sql` migra los datos existentes. No se recomienda usar esta tabla en nuevo codigo.

### developers

Creada por migración `supabase/migrations/007_developers_developments_properties_rebuild.sql`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del developer |
| name | text | NOT NULL | Nombre de la promotora |
| slug | text | NOT NULL, UNIQUE | Slug unico |
| logo_url | text | nullable | URL del logo |
| website | text | nullable | Sitio web |
| description | text | nullable | Descripcion |
| country | text | nullable | Pais de operacion |
| is_verified | boolean | NOT NULL DEFAULT false | Developer verificado |
| user_profile_id | uuid | FK → user_profiles(id) ON DELETE SET NULL | ID del perfil de usuario asociado |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:** `slug`, `user_profile_id`, `country`

**Trigger:** `trigger_set_updated_at_developers`

**Políticas RLS:**
- SELECT público: developers verificados (`is_verified = true`)
- SELECT propio: developer ve su propio registro (`auth.uid() = user_profile_id`)
- No hay INSERT/UPDATE desde cliente (solo service_role)

### developments

Creada por migración `supabase/migrations/007_developers_developments_properties_rebuild.sql`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del desarrollo |
| name | text | NOT NULL | Nombre del desarrollo |
| slug | text | NOT NULL, UNIQUE | Slug unico |
| developer_id | uuid | FK → developers(id) ON DELETE SET NULL | Developer asociado |
| description | text | nullable | Descripcion |
| country | text | nullable | Pais |
| city | text | nullable | Ciudad |
| community | text | nullable | Zona o barrio |
| cover_image | text | nullable | Imagen principal |
| images | text[] | nullable | Lista de imagenes |
| amenities | text[] | nullable | Amenities del desarrollo |
| handover_date | date | nullable | Fecha estimada de entrega |
| is_active | boolean | NOT NULL DEFAULT true | Desarrollo activo |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:** `slug`, `developer_id`, `country`, `city`

**Trigger:** `trigger_set_updated_at_developments`

**Políticas RLS:**
- SELECT público: developments activos (`is_active = true`)

### properties

Creada por migración `supabase/migrations/007_developers_developments_properties_rebuild.sql` (reemplaza 003).

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID de la propiedad |
| listed_by_id | uuid | NOT NULL, FK → user_profiles(id) ON DELETE CASCADE | ID del vendedor |
| listed_by_type | text | NOT NULL, CHECK IN ('developer', 'broker', 'private_seller') | Tipo de vendedor |
| developer_id | uuid | FK → developers(id) ON DELETE SET NULL | Developer constructor (opcional) |
| development_id | uuid | FK → developments(id) ON DELETE SET NULL | Desarrollo/proyecto (opcional) |
| status | text | NOT NULL DEFAULT 'available', CHECK IN ('available', 'sold', 'reserved', 'off_market') | Estado |
| country | text | NOT NULL | Pais |
| city | text | NOT NULL | Ciudad |
| community | text | nullable | Zona o barrio |
| address | text | nullable | Direccion |
| title | text | NOT NULL | Titulo |
| slug | text | NOT NULL, UNIQUE(listed_by_id, slug) | Slug unico por seller |
| description | text | nullable | Descripcion |
| property_type | text | NOT NULL, CHECK IN ('apartment', 'villa', 'townhouse', 'penthouse', 'duplex') | Tipo |
| bedrooms | integer | nullable | Dormitorios |
| bathrooms | integer | nullable | Banos |
| area_sqft | numeric | nullable | Area en pies cuadrados |
| area_sqm | numeric | nullable | Area en metros cuadrados |
| floor | integer | nullable | Piso |
| has_balcony | boolean | DEFAULT false | Tiene balcon |
| has_garden | boolean | DEFAULT false | Tiene jardin |
| price | numeric | NOT NULL | Precio |
| currency | text | NOT NULL DEFAULT 'USD', CHECK IN ('AED', 'USD', 'EUR', 'GBP') | Moneda |
| deposit_percentage | numeric | nullable | Porcentaje de deposito |
| deposit_amount | numeric | nullable | Monto del deposito |
| has_post_handover | boolean | DEFAULT false | Tiene plan post-entrega |
| handover_date | date | nullable | Fecha de entrega |
| payment_plan_months | integer | nullable | Meses del plan de pago |
| amenities | text[] | nullable | Lista de amenities |
| images | text[] | nullable | URLs de imagenes |
| cover_image | text | nullable | URL de imagen principal |
| tags | text[] | nullable | Tags |
| is_featured | boolean | DEFAULT false | Propiedad destacada |
| is_active | boolean | DEFAULT true | Propiedad activa |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:**
- `listed_by_id`, `listed_by_type`, `developer_id`, `development_id`, `status`, `country`, `city`, `property_type`, `is_active`
- Compuesto: `(listed_by_id, is_active)` — query del dashboard

**Trigger:**
- `trigger_set_updated_at_properties`: actualiza `updated_at` automáticamente en cada UPDATE

**Políticas RLS:**
- SELECT público: propiedades activas (`is_active = true`)
- SELECT privado: seller ve todas sus propiedades (`auth.uid() = listed_by_id`)
- INSERT: seller inserta sus propiedades, verificando `listed_by_type = role` (subquery a user_profiles)
- UPDATE/DELETE: solo seller dueño (`auth.uid() = listed_by_id`)

### payment_plan_milestones

Creada por migración `supabase/migrations/007_developers_developments_properties_rebuild.sql` (reemplaza 004).

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del hito |
| property_id | uuid | NOT NULL, FK → properties(id) ON DELETE CASCADE | ID de la propiedad |
| milestone_name | text | NOT NULL | Nombre del hito (ej: 'On Booking') |
| percentage | numeric | NOT NULL, CHECK (>= 0 AND <= 100) | Porcentaje del total |
| amount | numeric | nullable | Monto en moneda de la propiedad |
| due_date | date | nullable | Fecha de vencimiento |
| description | text | nullable | Descripcion |
| sort_order | integer | NOT NULL DEFAULT 0 | Orden de los hitos |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |

**Índice:** `property_id`

**Políticas RLS:**
- SELECT público: milestones de propiedades activas
- INSERT/UPDATE/DELETE: seller dueño de la propiedad

### subscriptions (inactiva en beta)

Creada por migración `supabase/migrations/006_subscriptions.sql`. Tabla preparada para integración futura con Stripe.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID de la suscripción |
| user_id | uuid | NOT NULL, FK → user_profiles(id) ON DELETE CASCADE | ID del usuario |
| role | text | NOT NULL | Role al momento de suscribirse |
| plan_name | text | NOT NULL | Nombre del plan |
| country | text | NOT NULL | País de operación |
| status | text | NOT NULL DEFAULT 'active', CHECK IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete') | Estado |
| stripe_customer_id | text | nullable | ID de cliente en Stripe |
| stripe_subscription_id | text | nullable | ID de suscripción en Stripe |
| stripe_price_id | text | nullable | ID del precio en Stripe |
| current_period_start | timestamptz | nullable | Inicio del periodo actual |
| current_period_end | timestamptz | nullable | Fin del periodo actual |
| cancel_at_period_end | boolean | DEFAULT false | Cancelar al fin del periodo |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:** `user_id`, `status`, `stripe_customer_id`, `stripe_subscription_id`

**Trigger:** `set_updated_at_subscriptions`

**Políticas RLS:**
- SELECT: usuario lee su propia suscripción
- INSERT/UPDATE: solo service_role (Stripe webhook)

### communities

Creada por migración `supabase/migrations/008_communities.sql`. Contenido curado (importado de CSV de Webflow), no user-generated.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID de la comunidad |
| slug | text | NOT NULL, UNIQUE | Slug unico |
| country | text | nullable | Pais (AE) |
| city | text | nullable | Ciudad (Dubai) |
| location | text | nullable | Zona (NULL en el seed actual) |
| average_price_range | text | nullable | Rango de precio como texto ("600K – 1.5M AED") |
| highlight_image | text | nullable | URL imagen destacada |
| images | text[] | nullable | URLs de imagenes adicionales |
| tags | text[] | nullable | Community tags (SEO/investor personas) |
| google_map_url | text | nullable | URL de iframe de Google Maps (validada en runtime) |
| developer_id | uuid | FK → developers(id) ON DELETE SET NULL | Developer asociado (NULL en el seed; no se toca en el upsert) |
| is_active | boolean | NOT NULL DEFAULT true | Comunidad activa |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:** `slug`, `country`, `city`, `developer_id`, `is_active`

**Trigger:** `trigger_set_updated_at_communities` (con `DROP TRIGGER IF EXISTS` para idempotencia)

**Políticas RLS:**
- SELECT público: comunidades activas (`is_active = true`)
- No hay INSERT/UPDATE desde cliente (contenido curado, solo service_role/seed)

### community_translations

Creada por migración `supabase/migrations/008_communities.sql`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID de la traduccion |
| community_id | uuid | NOT NULL, FK → communities(id) ON DELETE CASCADE | Comunidad asociada |
| locale | text | NOT NULL | Locale (ae, gb, ar, es, mx, br, pt) |
| name | text | NOT NULL | Nombre traducido |
| short_description | text | nullable | Descripcion corta traducida |
| description | text | nullable | Descripcion HTML (sanitizada en runtime) |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Constraints:** `UNIQUE (community_id, locale)` — una traducción por comunidad y locale

**Índices:** `community_id`, `locale`

**Trigger:** `trigger_set_updated_at_community_translations` (idempotente)

**Políticas RLS:**
- SELECT público: solo traducciones de comunidades activas (subquery a `communities.is_active`)

### Storage: property-images

Bucket creado por migración `supabase/migrations/005_storage_property_images.sql`.

- **Público:** true
- **Tamaño máximo:** 5MB
- **MIME types:** image/jpeg, image/png, image/webp
- **Estructura:** `property-images/{user_id}/{filename}`
- **Políticas:** SELECT público, INSERT/DELETE solo en carpeta del usuario autenticado

### Tablas de Supabase (gestionadas por Supabase)
- `auth.users`, `auth.sessions`, `auth.mfa_factors`, etc. — auth estandar de Supabase

### Pendiente
Definir tablas de `favorites` e `inquiries`.

## 5. ESTRUCTURA DE ARCHIVOS

```
offplaninternational/
├── AGENTS.md                          # Instrucciones para agentes de opencode
├── proxy.ts                           # Middleware combinado (i18n + geo + auth)
├── next.config.ts                     # Next config con plugin next-intl
├── tailwind.config.ts                 # Tailwind config (shadcn-compatible, sin custom spacing)
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencias
├── pnpm-lock.yaml
├── .env.example                       # Variables de entorno de ejemplo
├── .gitignore                         # Incluye /webflow-databases/
├── webflow-databases/                 # CSV exportado de Webflow (origen de datos, NO versionado)
├── app/
│   ├── layout.tsx                     # Root layout (fonts Host Grotesk + Roboto)
│   ├── globals.css                    # CSS variables, Tailwind base (shadcn-compatible)
│   ├── app/                           # Plataforma de vendedores (sin i18n, requiere auth)
│   │   ├── layout.tsx                 # Layout con sidebar + header + auth guard
│   │   ├── page.tsx                   # Pagina principal (placeholder)
│   │   ├── properties/page.tsx        # Listado de propiedades del usuario
│   │   ├── profile/page.tsx           # Perfil del usuario
│   │   └── settings/page.tsx          # Settings (placeholder, solo heading)
│   └── [locale]/
│       ├── layout.tsx                 # NextIntlClientProvider + CurrencyProvider wrapper
│       ├── page.tsx                   # Homepage (composicion de componentes)
│       ├── auth/
│       │   ├── login/page.tsx         # Login form (i18n via getTranslations)
│       │   ├── sign-up/
│       │   │   ├── page.tsx           # Redirect a /auth/sign-up/developer
│       │   │   └── [role]/page.tsx    # Sign-up con tabs por rol (i18n via getTranslations)
│       │   ├── onboarding/
│       │   │   └── [role]/page.tsx    # Onboarding post-confirmacion con campos condicionales
│       │   ├── confirm-email/page.tsx # "Revisa tu email" + resend
│       │   ├── confirm-client/page.tsx
│       │   ├── payment/page.tsx       # Seleccion de plan post-signup
│       │   ├── forgot-password/page.tsx
│       │   ├── update-password/page.tsx
│       │   ├── confirm/route.ts       # Callback de confirmacion (lee NEXT_LOCALE cookie)
│       │   └── error/page.tsx
│       ├── properties/page.tsx        # Listado de propiedades con filtros + cards (mock)
│       ├── property/[slug]/page.tsx   # Detalle de propiedad
│       ├── communities/page.tsx       # Listado de comunidades (DB + busqueda client)
│       ├── community/[slug]/page.tsx  # Detalle de comunidad (descripcion HTML sanitizada)
│       ├── developers/page.tsx        # Listado de developers
│       ├── developer/[slug]/page.tsx  # Detalle de developer
│       ├── developments/page.tsx      # Listado de developments
│       ├── development/[slug]/page.tsx # Detalle de development
│       ├── market-news/page.tsx       # Listado de market news
│       ├── market-news/[slug]/page.tsx # Detalle de market news
│       ├── contact/page.tsx           # Pagina de contacto
│       ├── terms/page.tsx             # Terminos y condiciones
│       └── privacy/page.tsx           # Politica de privacidad
├── components/
│   ├── site/                          # Componentes del sitio público
│   │   ├── navbar.tsx                 # Navbar responsive (client)
│   │   ├── hero-header.tsx            # Hero con busqueda + filtros (client)
│   │   ├── features-section.tsx       # Seccion de caracteristicas
│   │   ├── about-section.tsx          # Seccion "sobre nosotros"
│   │   ├── faq-section.tsx            # FAQ con accordion items
│   │   ├── accordion-item.tsx         # Componente accordion (client)
│   │   ├── contact-banner.tsx         # Banner de contacto
│   │   ├── contact-form-embed.tsx     # Formulario de contacto
│   │   ├── footer.tsx                 # Footer (server, async)
│   │   ├── breadcrumb.tsx             # Breadcrumb con separador "/"
│   │   ├── back-to-home.tsx           # Boton reutilizable con flecha (client)
│   │   ├── community-card.tsx         # Card de comunidad (server)
│   │   ├── developer-card.tsx         # Card de developer
│   │   ├── development-card.tsx       # Card de development
│   │   ├── market-news-card.tsx       # Card de noticia (variantes sm/md/lg)
│   │   ├── market-news-highlight-card.tsx # Noticia destacada
│   │   └── market-news-section.tsx    # Seccion de noticias
│   ├── communities/                   # Componentes de comunidades
│   │   ├── communities-grid.tsx       # Grid + busqueda client-side (useState/useMemo)
│   │   ├── community-header.tsx       # Imagen destacada + iframe del mapa
│   │   ├── community-info-card.tsx    # Rango de precio + CTA "see properties" (server)
│   │   └── community-gallery.tsx      # Galeria con lightbox (client)
│   ├── developers/                    # Componentes de developers
│   │   ├── developer-header.tsx
│   │   └── developer-info-card.tsx
│   ├── developments/                  # Componentes de developments
│   │   ├── development-header.tsx
│   │   └── development-info-card.tsx
│   ├── properties/                    # Componentes de propiedades
│   │   ├── property-card.tsx          # Card de propiedad horizontal (server, async)
│   │   ├── property-gallery.tsx       # Galeria de imagenes (client)
│   │   ├── property-sidebar.tsx       # Sidebar con precio + botones (server)
│   │   ├── property-details-table.tsx # Tabla de detalles (server)
│   │   ├── property-amenities-grid.tsx # Grid de amenities con modal (client)
│   │   ├── property-payment-plan.tsx  # Tabla de plan de pago (server)
│   │   ├── property-tags.tsx          # Tags de propiedad (server)
│   │   ├── property-filters.tsx       # Barra de filtros completa (client)
│   │   └── related-properties.tsx     # Seccion de propiedades relacionadas (server)
│   ├── auth/                          # Componentes de autenticacion
│   │   ├── login-form.tsx             # Formulario login (useTranslations)
│   │   ├── sign-up-form.tsx           # Formulario registro con tabs de rol (useTranslations)
│   │   ├── forgot-password-form.tsx   # Formulario reset password (useTranslations)
│   │   ├── update-password-form.tsx   # Formulario actualizar password (useTranslations)
│   │   ├── auth-button.tsx            # Boton auth contextual (server)
│   │   └── logout-button.tsx          # Cerrar sesion (client)
│   ├── shared/                        # Componentes compartidos
│   │   ├── currency-provider.tsx      # Context provider de moneda (client)
│   │   ├── currency-switcher.tsx      # Dropdown de seleccion de moneda (client)
│   │   ├── currency-price.tsx         # Precio con conversion en vivo (client)
│   │   └── primary-cta-link.tsx       # Link CTA primario con flecha (client)
│   ├── platform/                      # Componentes de la plataforma vendedores
│   │   ├── app-sidebar.tsx            # Sidebar del dashboard con NAV_BY_ROLE
│   │   └── site-header.tsx            # Header del dashboard con sidebar trigger
│   ├── brokers/                       # Componentes especificos de Broker (vacio)
│   ├── private-sellers/               # Componentes especificos de Private Seller (vacio)
│   └── ui/                            # Componentes base (shadcn-style)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx                 # shadcn defaults (h-9/h-10)
│       ├── card.tsx (CardAction incluido)
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx                 # Radix UI dialog
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx (incluye variant="destructive")
│       ├── input.tsx                  # shadcn default (h-9)
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx               # Textarea (shadcn pattern)
│       ├── toggle.tsx
│       ├── toggle-group.tsx
│       └── tooltip.tsx
├── hooks/
│   ├── use-click-outside.ts           # Hook compartido para cerrar dropdowns
│   └── use-mobile.ts                  # Hook responsive (mobile breakpoint 768px)
├── i18n/
│   ├── routing.ts                     # Config de locales y routing (next-intl)
│   ├── request.ts                     # Carga de mensajes por locale
│   └── navigation.ts                  # Helpers Link, redirect, usePathname, useRouter
├── messages/                          # Traducciones por locale (7 archivos)
│   ├── ae.json (default, incluye namespace `auth`)
│   ├── ar.json
│   ├── br.json
│   ├── es.json
│   ├── gb.json
│   ├── mx.json
│   └── pt.json
├── supabase/
│   ├── migrations/
│   │   ├── 001_developer_profiles.sql  # Migracion legacy (reemplazada por 002)
│   │   ├── 002_user_profiles.sql       # Tabla unificada con roles + migracion de datos
│   │   ├── 003_properties.sql          # Tabla properties (LEGACY, reemplazada por 007)
│   │   ├── 004_payment_plan_milestones.sql  # Milestones (LEGACY, reemplazada por 007)
│   │   ├── 005_storage_property_images.sql  # Bucket de imagenes en Supabase Storage
│   │   ├── 006_subscriptions.sql       # Tabla de suscripciones (inactiva en beta)
│   │   ├── 007_developers_developments_properties_rebuild.sql  # Developers, Developments, Properties rebuild, Milestones rebuild
│   │   └── 008_communities.sql         # Communities + community_translations (PENDIENTE de ejecutar)
│   └── seed/
│       └── communities.sql             # 42 comunidades + 42 traducciones 'ae' (upserts, PENDIENTE de ejecutar)
├── docs/
│   ├── CONTEXT.md                     # Este archivo
│   └── PRD.md                         # Product Requirements Document (agente analista)
├── lib/
│   ├── communities.ts                 # Data access + tipo Community (getCommunities, getCommunityBySlug)
│   ├── sanitize-html.ts               # Sanitizador HTML allowlist (descripciones de communities)
│   ├── currency.ts                    # Tipos, monedas, formatPrice, mapa locale->moneda
│   ├── currency-server.ts             # Lectura de cookie de moneda server-side
│   ├── exchange-rates.ts              # Tasas fijas + convertPrice() para MVP
│   ├── filter-options.ts              # Opciones de filtros centralizadas
│   ├── mock-properties.ts             # Mock data de propiedades (3 unidades)
│   ├── mock-developments.ts           # Mock data de developments
│   ├── mock-developers-detail.ts      # Mock data de detalle de developers
│   ├── mock-market-news.ts            # Mock data de market news
│   ├── pricing-plans.ts               # Pricing matrix por role x pais
│   ├── types.ts                       # UserRole, UserProfile, PropertyData, Developer, etc.
│   ├── utils.ts                       # cn() helper, hasEnvVars
│   └── supabase/
│       ├── client.ts                  # Cliente Supabase browser
│       ├── server.ts                  # Cliente Supabase server
│       └── middleware.ts              # Auth middleware con locale-aware redirects
├── public/
│   └── images/                        # Assets del sitio
└── .opencode/
    ├── agents/
    │   ├── reviewer.md
    │   ├── security.md
    │   ├── docwriter.md
    │   └── analista.md
    └── package.json
```

## 6. DECISIONES TÉCNICAS TOMADAS

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-05-21 | next-intl v4 con `localePrefix: "as-needed"` | El locale default (ae) no aparece en URL, evitando redirects innecesarios para EAU |
| 2026-05-21 | `proxy.ts` en lugar de `middleware.ts` | Next.js 16 cambió el API de middleware; proxy combina locale routing + geo + auth |
| 2026-05-21 | Geo-detección por headers CDN (Vercel/Cloudflare/AWS) | Sin costo adicional, sin dependencias externas; en local se usa default locale |
| 2026-05-21 | `getUser()` en vez de `getClaims()` para verificar sesión | El JWT puede estar expirado aunque los claims se decodifiquen |
| 2026-05-21 | Navegación i18n: `Link` y `redirect` desde `@/i18n/navigation` | next-intl requiere estos wrappers para resolver paths con/sin prefijo de locale |
| 2026-05-21 | Confirm route usa `redirect` de `next/navigation` (no de i18n) | Callback de Supabase sin locale prefix; el middleware lo resuelve automáticamente |
| 2026-05-21 | Custom spacing scale (0-10 mapeado a 4px-80px) | Diseño custom que no se alinea con la escala default de Tailwind |
| 2026-05-21 | CSS variables para colores + Tailwind extendido | Consistencia entre globals.css y clases de utilidad |
| 2026-05-27 | CurrencyContext + cookie `NEXT_CURRENCY` para moneda seleccionada | El usuario puede elegir AED/USD/EUR/GBP y persiste 30 días |
| 2026-05-27 | CurrencyPrice como client component separado | Reactividad sin convertir toda la card a client |
| 2026-05-27 | `exchange-rates.ts` con tasas fijas (no API externa) | Simplifica el MVP; evita dependencias externas |
| 2026-06-03 | Interfaz `PropertyData` extraída a `lib/types.ts` | Elimina tipos duplicados; unifica el modelo de datos |
| 2026-06-03 | Ruta de detalle como `/[locale]/property/[slug]` (slug, no id) | URLs legibles para humanos y SEO |
| 2026-06-03 | Agentes reviewer/security/analista creados | Sesiones dedicadas de revisión de código, seguridad y análisis funcional |
| 2026-06-04 | Dashboard fuera de `[locale]` (sin i18n) | El dashboard es funcional, no de contenido; simplifica la implementación |
| 2026-06-04 | `(auth)` route group para login/signup sin i18n | Rutas de auth que no necesitan traducción; el middleware redirige aquí |
| 2026-06-04 | Sidebar shadcn completa con persistencia en cookie `sidebar_state` | Componente robusto con colapso, offcanvas mobile y contexto compartido |
| 2026-06-04 | Data table con @tanstack/react-table + @dnd-kit/sortable | Tabla con drag-and-drop nativo, paginación, column visibility, sorting |
| 2026-06-04 | `developer_profiles` con trigger on_auth_user_created | Garantiza que cada usuario registrado tenga su perfil sin logica extra en cliente |
| 2026-06-04 | RLS en developer_profiles con policy por `auth.uid()` | Seguridad a nivel BD: cada usuario solo ve/edita su propio perfil |
| 2026-06-04 | Middleware maneja dos sistemas de rutas: dashboard/auth y locale | Las rutas dashboard/login/signup van a auth middleware; el resto a i18n + geo + auth |
| 2026-06-22 | Tabla `user_profiles` reemplaza `developer_profiles` | Soporte para 3 roles (developer, broker, private_seller) con campos condicionales |
| 2026-06-22 | Sistema de 3 roles con tabs URL-driven | `/auth/sign-up/[role]` permite seleccionar rol durante registro con navegacion limpia |
| 2026-06-22 | Onboarding post-confirmacion con campos condicionales | Perfiles diferenciados: developer/broker necesitan company data, private_seller necesita country_of_residence |
| 2026-06-22 | Confirm route lee `user_profiles` y redirige segun `profile_completed` | Flujo completo: signup -> email confirm -> onboarding (si profile_completed=false) -> dashboard |
| 2026-06-22 | Sidebar con NAV_BY_ROLE | Navegacion condicional: developer ve Properties/Analytics, broker ve Listings/Clients, private_seller ve My Property |
| 2026-06-22 | Pricing plans por role x pais | Matriz de precios diferenciada: developer/broker pagan, private_seller es gratuito |
| 2026-06-22 | proxy.ts ejecuta updateSession() antes de intlMiddleware() en auth routes | Asegura que la sesion este actualizada antes del routing de locale |
| 2026-06-22 | Legacy routes redirigen | `/login` -> `/auth/login`, `/signup` -> `/auth/sign-up/developer`; mantiene compatibilidad con URLs existentes |
| 2026-07-23 | Migración 007: tablas `developers`, `developments`, rebuild `properties` y `payment_plan_milestones` | Separa entidades de negocio: developer (promotora), development (proyecto), property (unidad). Renombra `seller_id/seller_type` a `listed_by_id/listed_by_type`. Agrega CHECK en percentage, ownership vía subquery en milestones. Renombra función trigger a `trigger_set_updated_at_*` para consistencia |
| 2026-07-23 | Campos flat en `PropertyData` (`developer_name`, `city`, `community`, etc.) | Evita joins anidados en server components; el mock data y la interfaz incluyen campos joined planos que en producción vendrán de queries con JOINs |
| 2026-07-23 | Tipos `PropertyStatus`, `PropertyType`, `PropertyCurrency` extraídos en `lib/types.ts` | Unifica restricciones de BD con tipos TypeScript; facilita autocomplete y validación |
| 2026-07-27 | Rename `/dashboard` → `/app` | Ruta más corta y clara para la plataforma de vendedores; separa conceptualmente del sitio público |
| 2026-07-27 | Componentes reorganizados en directorios por dominio (`site/`, `properties/`, `auth/`, `shared/`, `platform/`) | Escalabilidad: facilita encontrar componentes y agregar nuevos sin ensuciar la raíz de `components/` |
| 2026-07-27 | Directorios vacíos `developers/`, `brokers/`, `private-sellers/` | Preparados para componentes específicos por role cuando se implementen |
| 2026-07-27 | Template cleanup: 13 archivos eliminados + `(auth)/` route group + `ui/sidebar.tsx` | Elimina código muerto del starter kit de Supabase; reduce confusión |
| 2026-07-27 | shadcn defaults restaurados: Button (`h-9`/`h-10`), Input (`h-9`), custom spacing eliminado | Base sólida para UI consistente; evita overrides innecesarios que dificultan Upgrades |
| 2026-07-27 | Auth i18n: namespace `auth` traducido a 7 locales + auth components con `useTranslations` | Formularios de auth completamente traducidos; elimina texto hardcodeado en inglés |
| 2026-07-27 | `emailRedirectTo` y `forgot-password` redirectTo incluyen locale via `useLocale()` | Los links de email mantienen el locale del usuario; evitan perder contexto al confirmar |
| 2026-07-27 | `confirm/route.ts` lee cookie `NEXT_LOCALE` para redirects locale-aware | El usuario mantiene su locale al ser redirigido tras confirmar email o completar onboarding |
| 2026-07-27 | UI primitives creados: `textarea.tsx` (shadcn pattern), `dialog.tsx` (Radix UI) | Completan el set de componentes base para formularios y modales |
| 2026-07-31 | Migración 008: tablas `communities` y `community_translations` con patrón idéntico a 007 | Consistencia: RLS select público, triggers updated_at con `DROP TRIGGER IF EXISTS` (idempotentes), FK developer_id → developers ON DELETE SET NULL, UNIQUE(community_id, locale) |
| 2026-07-31 | Comunidades como contenido curado en DB (no mock ni user-generated) | 42 comunidades de Dubai importadas de CSV de Webflow; el tipo `Community` vive en `lib/communities.ts` (eliminado `CommunityData` de `lib/types.ts`) |
| 2026-07-31 | `webflow-databases/` ignorado en git | El CSV exportado de Webflow es origen de datos, no se versiona; el seed SQL es el artefacto versionado |
| 2026-07-31 | Traducciones por fila en `community_translations` con fallback locale → 'ae' → primera disponible | El contenido base (42 filas 'ae') se muestra en inglés en todos los locales; las traducciones se agregan por fila sin tocar código |
| 2026-07-31 | Sanitizador HTML allowlist custom (`lib/sanitize-html.ts`) en vez de librería (sanitize-html/DOMPurify) | Sin dependencias nuevas; el HTML proviene de contenido curado por el equipo; allowlist de tags y bloqueo de tags peligrosos + neutralización de entidades (`&#x3c;` → `&amp;lt;`) |
| 2026-07-31 | Descripción de comunidad con `dangerouslySetInnerHTML` sobre `sanitizeHtml()` | El contenido es HTML rico (h4/p/strong/ul/blockquote) del CSV; se sanitiza en render para eliminar scripts/iframes/entidades peligrosas |
| 2026-07-31 | Validación de `google_map_url` en runtime: solo hosts google.com/maps y path `/maps/` | Un iframe malicioso es un vector de XSS; solo se renderiza si la URL es de Google Maps, devolviendo null si no |
| 2026-07-31 | Iframe del mapa con `sandbox="allow-scripts allow-same-origin allow-popups"` y `referrerPolicy="no-referrer"` | Reduce superficie de ataque del embed de terceros; hallazgo de auditoría security |
| 2026-07-31 | Bloque "Main Developer" eliminado del info-card (developer_id siempre NULL) | El CSV de Webflow no traía developers reales; se reimplementará cuando haya datos. El seed NO incluye developer_id en el DO UPDATE para no pisar asignaciones manuales |

## 7. FLUJOS PRINCIPALES

### 7.1 Deteccion de locale + geo-redirect

1. Usuario llega a `/` sin locale prefix
2. `proxy.ts` revisa cookie `NEXT_LOCALE`
3. Si existe cookie y no es default -> redirige a `/{locale}`
4. Si no existe cookie -> lee headers CDN (`x-vercel-ip-country`, etc.)
5. Si pais detectado tiene locale mapeado y no es default -> redirige a `/{locale}` y setea cookie por 30 dias
6. Sino -> next-intl middleware sirve default locale (ae)

### 7.2 Registro de usuario (nuevo sistema con roles)

1. Usuario navega a `/[locale]/auth/sign-up/developer` (o /broker o /private_seller)
2. `sign-up-form.tsx` muestra tabs para seleccionar rol (URL-driven)
3. Al cambiar tab, se navega a `/auth/sign-up/{role}` y se resetea el form
4. Usuario completa: full name, email, password, repeat password
5. `signUp()` envia `role` y `full_name` en `raw_user_meta_data`
6. Trigger `handle_new_user` en BD crea perfil en `user_profiles` con el role
7. Redirige a `/auth/confirm-email?email=...` (reemplazó a la vieja `/auth/sign-up-success`)

### 7.3 Confirmacion de email + onboarding

1. Usuario hace click en link de confirmacion de email (con locale en URL)
2. `/auth/confirm` route handler verifica OTP con Supabase
3. Lee cookie `NEXT_LOCALE` (fallback: `ae`)
4. Lee `role` y `profile_completed` de `user_profiles`
5. Si `profile_completed = false` -> redirige a `/{locale}/auth/onboarding/{role}`
6. Si `profile_completed = true` -> redirige a `/{locale}/app`

### 7.4 Onboarding post-confirmacion

1. Usuario accede a `/auth/onboarding/{role}`
2. Page carga config segun role (titulo, icono, descripcion)
3. Campos condicionales:
   - **Developer/Broker:** company name, company website, operating country
   - **Broker:** license number (adicional)
   - **Private Seller:** country of residence
   - **Todos:** phone number
4. Al enviar, actualiza `user_profiles` con `profile_completed = true`
5. Redirige a `/dashboard`

### 7.5 Login

1. Usuario completa formulario en `/auth/login` (textos traducidos via useTranslations)
2. `login-form.tsx` llama a `signInWithPassword()`
3. Si exito -> redirige a `/app`
4. Si error -> se muestra mensaje en rojo

### 7.6 Proteccion de rutas (middleware)

1. `proxy.ts` detecta rutas `/app`, `/login`, `/signup` y las deriva a `updateSession()`
2. Para rutas `/auth/*` o `/protected/*`, ejecuta `updateSession()` primero y luego `intlMiddleware()`
3. `updateSession()` en `lib/supabase/middleware.ts`:
   - Si no hay usuario y ruta es `/app` -> redirect a `/auth/login`
   - Si hay usuario y ruta es `/auth/login` o `/auth/sign-up` -> redirect a `/app`
4. El layout de app tambien verifica sesion server-side con `createClient()` como fallback

### 7.7 Dashboard

1. Usuario autenticado accede a `/app`
2. `app/app/layout.tsx` verifica sesion, obtiene perfil de `user_profiles` (full_name, email, role), renderiza SidebarProvider + AppSidebar + SiteHeader + children
3. `app-sidebar.tsx` muestra navegacion condicional segun role:
   - **Developer:** Dashboard, Properties, Analytics
   - **Broker:** Dashboard, Listings, Clients
   - **Private Seller:** Dashboard, My Property
4. Todos ven Settings en NavSecondary
5. `app/app/page.tsx` muestra placeholder

### 7.8 Navegacion en sidebar

1. AppSidebar muestra logo, NavMain (items por role), NavSecondary (Settings), NavUser (avatar + logout)
2. Sidebar es simple layout flex (no usa shadcn SidebarProvider)
3. NAV_BY_ROLE define items por role: Dashboard + Properties para todos, plus role-specific items
4. NavUser muestra dropdown con nombre, email y boton de logout

### 7.9 Data Table

1. Componente cliente que recibe array de datos con schema zod
2. Usa `@tanstack/react-table` para manejo de estado (sorting, pagination, column visibility, row selection, column filters)
3. Drag-and-drop de filas via `@dnd-kit/sortable` con restriccion vertical
4. Tabs para Outlook, Past Performance, Key Personnel, Focus Documents
5. Columna de acciones con menu contextual (Edit, Make a copy, Delete)
6. Edicion inline de campos Target y Limit
7. Selector de reviewer con opciones mock
8. Drawer con detalle expandido (header, chart recharts AreaChart, formulario de edicion)

### 7.10 Busqueda en homepage

1. Usuario ingresa texto en campo de busqueda y/o selecciona filtros (categoria, precio, estado)
2. Los filtros son client-side (estado local con useState)
3. No hay action de busqueda implementada -- los dropdowns y el input existen pero no disparan navegacion ni API call

Inconsistencia: La busqueda en hero-header tiene UI completa pero no ejecuta ninguna accion al buscar o seleccionar filtros.

### 7.11 Listado de propiedades

1. Usuario navega a `/properties` (sin locale prefix; el middleware resuelve el locale)
2. Layout con Navbar, BackToHome, heading "All Properties", PropertyFilters, grid de PropertyCards y Footer
3. PropertyFilters es client component con dropdowns individuales + "+ More Filters" + "Map View"
4. PropertyCard es server component async con traducciones y CurrencyPrice integrado
5. CurrencyPrice usa `useCurrency()` del context y llama a `convertPrice()` + `formatPrice()`
6. Mock data: 3 propiedades en `lib/mock-properties.ts`

### 7.12 Detalle de propiedad

1. Usuario navega a `/[locale]/property/[slug]`
2. Server component async que busca propiedad en mock data por slug
3. Layout con Navbar, Breadcrumb, dos columnas (gallery + sidebar), y secciones inferiores
4. Columna izquierda: PropertyGallery, PropertyDetailsTable, PropertyAmenitiesGrid, PropertyPaymentPlan, PropertyTags, RelatedProperties
5. Columna derecha (sticky): PropertySidebar con precio, links, botones Contact y WhatsApp
6. Todos los textos usan namespace `property_detail` traducido a 7 locales

### 7.13 Listado de comunidades

1. Usuario navega a `/[locale]/communities` (requiere migración 008 + seed ejecutados)
2. `communities/page.tsx` (server) llama a `getCommunities(locale)` con el Supabase server client
3. `getCommunities` hace `select("*, community_translations(*)")` filtrando `is_active = true`; resuelve la traducción con fallback locale → 'ae' → primera; ordena con `localeCompare(locale)`
4. `CommunitiesGrid` (client) renderiza el input de búsqueda y las cards; filtra por nombre, ciudad, location y tags con `useState`/`useMemo`
5. Sin resultados muestra `t("communities.no_results")`
6. `CommunityCard` linkea a `/community/{slug}` (via `@/i18n/navigation`)

### 7.14 Detalle de comunidad

1. Usuario navega a `/[locale]/community/[slug]`
2. `community/[slug]/page.tsx` (server) llama a `getCommunityBySlug(slug, locale)` con `.maybeSingle()`; si no existe o está inactiva → `notFound()`
3. Descripción HTML se pasa por `sanitizeHtml()` antes de `dangerouslySetInnerHTML` (solo si hay descripción)
4. `CommunityHeader` muestra imagen destacada (placeholder con nombre si no hay) + iframe del mapa si `google_map_url` pasó la validación de host/path
5. `CommunityInfoCard` (sticky, server) muestra `average_price_range` y CTA "See properties"
6. Galería con `CommunityGallery` (lightbox con keyboard nav, scroll lock) solo si hay imágenes

## 8. VARIABLES DE ENTORNO

| Variable | Ámbito | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pública | API key pública (anon key) de Supabase |

No hay otras variables de entorno definidas actualmente. El middleware consulta `hasEnvVars` desde `lib/utils.ts` para omitir verificación de auth si no hay variables configuradas.

## 9. CONVENCIONES DE CÓDIGO

- **Componentes:** export nombrado (`export function Componente()`)
- **Estilos:** `cn()` de `lib/utils.ts` para merge de clases Tailwind
- **Server Components por defecto:** solo usar `"use client"` cuando sea necesario (event handlers, hooks, estado)
- **Navegación i18n:** usar `Link` y `redirect` desde `@/i18n/navigation`, no de `next/link` ni `next/navigation`
- **Traducciones en Server:** `getTranslations()` de `next-intl/server`
- **Traducciones en Client:** `useTranslations()` de `next-intl`
- **Nombres de archivo:** kebab-case (ej: `hero-header.tsx`)
- **Sin comentarios en código** a menos que se solicite explícitamente
- **Variables de entorno** via `process.env`, tipadas como string con `!`
- **UI primitives:** estilo shadcn, usando `cva()` para variantes y `cn()` para merge
- **Auth:** `getUser()` para verificar sesión server-side (no `getClaims()`)
- **Git:** No hacer commit a menos que se solicite explícitamente
- **Supabase client:** Crear nueva instancia por funcion en server (no variables globales)
- **Dashboard/sin i18n:** las rutas `app/app` no usan next-intl; los componentes son hardcodeados en ingles. Auth forms sí usan i18n (namespace `auth`)
- **Sidebar:** layout flex simple con NAV_BY_ROLE; dropdown de usuario con logout
- **Roles:** tipo `UserRole` definido en `lib/types.ts` como `"developer" | "broker" | "private_seller"`
- **Tipos de propiedad:** `PropertyStatus`, `PropertyType`, `PropertyCurrency` definidos en `lib/types.ts`, alineados con CHECK constraints de BD
- **Interfaces de dominio:** `Developer`, `Development`, `PaymentPlanMilestone` en `lib/types.ts` — reflejan tablas de BD 1:1
- **PropertyData:** interfaz flat con campos joined (`developer_name`, `developer_logo`, `city`, `community`, etc.) — no usar objetos anidados
- **user_profiles:** tabla unica para todos los roles; campos condicionales se llenan en onboarding
- **Auth forms:** login-form, sign-up-form, forgot-password-form, update-password-form usan `useTranslations("auth.*")` para i18n; emailRedirectTo y redirectTo incluyen locale via `useLocale()`
- **Component organization:** componentes en directorios por dominio (`site/`, `properties/`, `auth/`, `shared/`, `platform/`, `communities/`, `developers/`, `developments/`); `ui/` solo primitivas shadcn
- **Auth namespace:** `auth` en `messages/{locale}.json` con secciones: login, sign_up, forgot_password, update_password, back_to_home
- **Comunidades:** tipo `Community` e interfaz de data access en `lib/communities.ts` (no en `lib/types.ts`); funciones async con Supabase server client y fallback de traducción locale → 'ae' → primera
- **HTML curado:** descripciones de communities se renderizan con `dangerouslySetInnerHTML` SIEMPRE pasando antes por `sanitizeHtml()` de `lib/sanitize-html.ts`; no aplicar a user-generated content
- **URLs de mapas:** validar con el patrón de `lib/communities.ts` (host google.com/maps + path `/maps/`) antes de usarlas en iframes; usar `sandbox` y `referrerPolicy="no-referrer"` en el iframe
- **Contenido de communities:** se muestra en inglés en todos los locales (traducción base 'ae'); para traducir, insertar fila en `community_translations`, no hardcodear en mensajes
- **Migraciones Supabase:** numeradas secuencialmente (`008_...`); triggers updated_at con `DROP TRIGGER IF EXISTS` para idempotencia; seed en `supabase/seed/` con upserts (`ON CONFLICT`)
