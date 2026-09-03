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
- [x] Sistema i18n con 7 locales (los demás dormidos; el sitio se sirve siempre en inglés)
- [x] Sitio forzado en inglés (`defaultLocale: "en"`, `localePrefix: "never"`); otros locales dormidos, sin prefijo de URL ni geo-detección; cualquier URL con prefijo de locale se redirige (301)
- [x] CurrencySwitcher en navbar con persistencia en cookie (NEXT_CURRENCY)
- [x] Sistema de moneda: formato por locale + mapa locale→moneda por defecto
- [x] Página de listado de propiedades (estructura + cards + filtros + cambio de moneda en vivo)
- [x] Sistema de conversión de moneda (exchange-rates fijas para MVP)
- [x] Hook compartido useClickOutside para dropdowns
- [x] PropertyCard server component con traducciones y CurrencyPrice integrado
- [x] Barra de filtros completa (Location, Category, Price Range, Status, + More Filters, Map View)
- [x] BackToHome botón reutilizable
- [x] Interfaz `PropertyData` extraída a `lib/types.ts` con campos expandidos
- [x] Mock data actualizado con 3 propiedades completas en `lib/mock-properties.ts` ⚠️ ELIMINADO — reemplazado por queries a DB via `lib/properties.ts`
- [x] Página de detalle de propiedad (ruta `/[locale]/property/[slug]`)
- [x] Galería de imágenes con navegación y thumbnails (property-gallery.tsx)
- [x] Sidebar con precio, links y botones de contacto (property-sidebar.tsx)
- [x] Tabla de detalles (subcategoría, fecha, estado, entrega) (property-details-table.tsx)
- [x] Grid de amenities con modal overlay + scroll lock (property-amenities-grid.tsx)
- [x] ⚠️ Tabla de plan de pago `property-payment-plan.tsx` ELIMINADA (junto a los milestones, migración 017)
- [x] Tags de propiedad (property-tags.tsx)
- [x] Sección de propiedades relacionadas (related-properties.tsx)
- [x] Breadcrumb con separador "/" (breadcrumb.tsx)
- [x] Traducciones completas para namespace `property_detail` en 7 locales
- [x] Detalle de propiedad renderiza Development Details (development, área total, developer) con links condicionales: `listed_by_type === 'developer'` → `/developer/{slug}`; development con slug → `/development/{slug}`
- [x] Auth completo en `[locale]/auth/`: login, sign-up, forgot-password, update-password, confirm, error, sign-up-success

### Auth + Dashboard (nuevo sistema con roles)
- [x] Sistema de 3 roles: Developer, Broker, Private Seller
- [x] Tabla `user_profiles` con roles (reemplaza `developer_profiles`)
- [x] Sign-up con tabs URL-driven por rol (`/auth/sign-up/[role]`)
- [x] Onboarding post-confirmación con campos condicionales por rol (`/auth/onboarding/[role]`)
- [x] Confirm route que lee role de user_profiles y redirige a onboarding o app
- [x] Dashboard unificado en `/app` con sidebar basado en role
- [x] Pricing plans por role × país en `lib/pricing-plans.ts` ⚠️ SIN USO EN CÓDIGO — reemplazado por el mock de tiers por perfil en `lib/plans.ts` (ver debajo)
- [x] Mock UI de planes por perfil (sin Stripe): `lib/plans.ts` con `getPlansForRole`, `getPlan`, `getMaxProperties`, `PLANS`, tipos `PlanTier`/`Plan`. Cada perfil (developer/broker/private_seller) tiene plan Free (sin Stripe, 10 propiedades) + 3 tiers de pago (developer/broker = Free/Starter/Pro/Enterprise; private_seller = Free/Single/Starter/Pro). Los planes NO varían por país
- [x] `components/auth/payment-page.tsx` (client) muestra los tiers con la cantidad disponible; `app/[locale]/auth/payment/page.tsx` (server) resuelve el role y delega. Elegir cualquier tier navega a `/app` (sin Stripe ni persistencia)
- [x] `docs/STRIPE-PLANS.md` documenta el paso a paso de implementación futura de Stripe (migración propuesta `023_plans_and_subscriptions.sql`)
- [x] Legacy routes: `/login` y `/signup` redirigen al nuevo sistema
- [x] Navbar actualizada con links a `/auth/login` y `/auth/sign-up`
- [x] Sidebar reestructurada: NAV_BY_ROLE con Dashboard + Properties para todos, Settings al fondo, dropdown de usuario con logout
- [x] Protección de rutas via middleware
- [x] Auth i18n: namespace `auth` traducido a 7 locales (login, sign-up, forgot-password, update-password, back_to_home)
- [x] Auth components actualizados con `useTranslations("auth.*")` — login-form, sign-up-form, forgot-password-form, update-password-form
- [x] Role labels traducidos en sign-up form (`t("roles.${role}")`)
- [x] `emailRedirectTo` en sign-up incluye locale via `useLocale()`
- [x] `forgot-password-form` redirectTo incluye locale
- [x] `confirm/route.ts` redirige a paths sin prefijo de locale (`/app`, `/auth/onboarding/`, `/auth/error`); ya no lee cookie `NEXT_LOCALE`
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
- [x] Data access `lib/communities.ts`: `getCommunities(locale)` y `getCommunityBySlug(slug, locale)` con fallback de traducción locale → 'en' → primera (DEFAULT_LOCALE = "en" desde 02-sep-2026; antes 'ae')
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

### Developers (página pública + plataforma)
- [x] Migración 011: campos de página pública en `developers` (`cover_image`, `city`, `on_time_completion`, `email`, `phone`) + `UNIQUE(user_profile_id)` + políticas RLS INSERT/UPDATE del owner
- [x] Migración 012: bucket `developer-images` (público, 5MB, jpeg/png/webp) con RLS por carpeta del usuario
- [x] Migración 013: tabla `cities` + seed por país (dropdown del form)
- [x] Data access `lib/developers.ts`: `getDevelopers()`, `getDeveloperBySlug()`, `getMyDeveloper()` (tipos `DeveloperCardData`/`DeveloperDetailData` en el mismo archivo)
- [x] Listado `/[locale]/developers` conectado a DB (`is_verified = true`) con búsqueda client-side (`DevelopersGrid` filtra por texto visible sin tags)
- [x] Detalle `/[locale]/developer/[slug]` conectado a DB con `notFound()` si no existe/inactivo
- [x] `DeveloperDescription` renderiza HTML sanitizado (`sanitizeUserHtml()`) con fallback legacy `**bold**`
- [x] Form `/app/developer` (solo rol developer): `developer-form.tsx` + `ImageUpload` (cover/logo) + `RichTextEditor` TipTap
- [x] Editor rich text TipTap v3.29.2: Bold, Italic, H3, listas, blockquote e imagen; guarda HTML sanitizado en `developers.description` (reemplaza `<textarea>` + `**bold**`)
- [x] Server action `saveDeveloperProfile` en `lib/actions.ts` con validaciones server-side (website auto-prefija `https://`, slug regex, límites MAX_DESCRIPTION/NAME/EMAIL/PHONE, on_time_completion 0–100)
- [x] `sanitizeUserHtml()` (allowlist user-generated) + núcleo `processHtml` compartido con `sanitizeHtml()` en `lib/sanitize-html.ts`
- [x] Helpers `isHtmlText()` y `stripHtmlToText()` en `lib/utils.ts` (resúmenes y búsqueda sin tags)
- [x] Auditorías reviewer/security aplicadas: XSS `javascript:` en website corregido (`safeWebsite`), XSS por tag truncado, origin-check de imágenes (`img` solo hostname de Supabase Storage)

### Tablas de referencia (curadas)
- [x] Migración 009: tablas `community_tags` y `property_amenities` + seeds (`supabase/seed/community_tags.sql`, `property_amenities.sql`)
- [x] Migración 010: tabla `property_subcategories` + seed (`supabase/seed/property_subcategories.sql`)
- [x] Data access: `lib/community-tags.ts`, `lib/property-amenities.ts`, `lib/property-subcategories.ts`

### Broker Profile (página pública + plataforma)
- [x] Migración 014: tabla `broker_profiles` + bucket `broker-images` + RLS (SELECT público para verificados, SELECT/INSERT/UPDATE propio)
- [x] Interfaz `BrokerProfile` en `lib/types.ts` + campos `broker_name`/`broker_slug` en `PropertyData`
- [x] Data access `lib/brokers.ts`: `getBrokerBySlug(slug)` (filtra `is_verified = true`) + `getMyBroker(userProfileId)` + tipo `BrokerDetailData`
- [x] Server action `saveBrokerProfile` en `lib/actions.ts` con validaciones server-side (slug regex, límites, personal_url auto-prefija `https://`, closed_transactions 0–100000)
- [x] Form `/app/broker` (solo rol broker): `broker-form.tsx` + `ImageUpload` (profile image, bucket `broker-images`) + `RichTextEditor` (bucket `broker-images`)
- [x] Página pública `/[locale]/broker/[slug]`: broker header + descripción + propiedades activas del broker (query a `properties` filtrando `listed_by_type = 'broker'`)
- [x] `BrokerHeader`: imagen de perfil, nombre, URL personal, stats (active properties, closed transactions), botones Email/WhatsApp
- [x] `BrokerDescription`: render HTML sanitizado con `sanitizeUserHtml()` + fallback legacy `**bold**` via `splitBold()` (misma estructura que `DeveloperDescription`)
- [x] `lib/storage.ts`: parámetro `bucket` opcional (default `developer-images`)
- [x] `ImageUpload` y `RichTextEditor`: prop `bucket` para dirigir uploads al bucket correcto
- [x] Sidebar actualizada: `NAV_BY_ROLE.broker` incluye link a `/app/broker` (Broker Profile)
- [x] `PropertySidebar`: props `sellerName`, `sellerSlug`, `listedByType` para link condicional a `/broker/{slug}` o `/developer/{slug}`
- [x] Detalle de propiedad pasa datos de seller condicionalmente según `listed_by_type`
- [x] `splitBold()` extraída a `lib/rich-text.tsx` (compartida entre `BrokerDescription` y `DeveloperDescription`)
- [x] `slugify()` y `toEditorHtml()` extraídas a `lib/utils.ts` (compartidas entre `broker-form.tsx` y `developer-form.tsx`)
- [x] `.rich-description` en `globals.css` renombrada desde `.developer-description` (compartida entre developer y broker)
- [x] Namespace `broker_detail` traducido a los 7 locales
- [x] Migración 022: credenciales del broker en `broker_profiles` (`rera_card_url`, `qr_code_url`, `agency_orn`, `details_confirmed`)
- [x] Onboarding broker (`app/[locale]/auth/onboarding/[role]/page.tsx`): RERA Broker Card / ID (imagen obligatoria, bucket `broker-images/rera`), QR Code (imagen opcional, bucket `broker-images/qr`), Agency ORN (texto), checkbox "I confirm these details are up to date". El campo texto `license_number` fue reemplazado por la imagen RERA. Onboarding hace upsert en `broker_profiles` (crea el row con name/slug desde company_name/full_name si no existe)
- [x] Broker-profile form (`components/platform/broker-form.tsx`): sección "Credentials" con los mismos 4 campos + preview destacada del QR
- [x] `saveBrokerProfile` (lib/actions.ts) recibe y valida los 4 campos (ORN máx 64 chars). `BrokerProfile` en `lib/types.ts` incluye los 4 campos
- [x] Bucket `broker-images` con carpetas `rera/` y `qr/` (reutilizado, decisión de mantenerlo así por ahora)

### Property Upload & Management (plataforma)
- [x] Server actions `saveProperty`, `deleteProperty` en `lib/actions.ts` con validaciones server-side y ownership checks
- [x] Data access `lib/properties.ts`: `getPropertyBySlug`, `getRelatedProperties`, `getProperties`, `getMyProperties`, `getMyProperty` con JOINs a `developers`, `broker_profiles`, `user_profiles`, `developments`
- [x] `PropertyForm` (client) orquestador de estado (~482 líneas) con UI dividida en 8 sub-componentes en `components/platform/property-form/`: Basic Information, Location, Property Details (Details + Pricing), Development Details, Tags, Amenities, Images, Visibility. Patrón controlado: el estado vive en el padre; cada sección recibe value/onChange por props
- [x] Campos "Development Details": `development` (texto libre), `development_area` (área total), `developer` (nombre) — para rol developer se auto-completa desde `developers.name` (prop `ownDeveloperName`, read-only); broker/private_seller editan el texto libre
- [x] `PropertyList` (server) tabla con 7 columnas: Property, Status, Price, Location, Specs, Created, Actions
- [x] Dashboard pages: listado `/app/properties`, crear `/app/properties/new`, editar `/app/properties/[id]/edit` (con `PageHeader` y botón back a `/app/properties`)
- [x] Auto-cálculo de `area_sqm` desde `area_sqft` y `deposit_amount` desde `deposit_percentage` en el form
- [x] Upload de imágenes a `property-images` bucket (cover image + gallery, máx 10)
- [x] Amenities y subcategories se cargan desde tablas de referencia (grouped by category)
- [x] Input de development (solo rol developer, de su propio developer, con validación server-side); para el resto se fuerza `development_id = null`
- [x] `slugify()` para autogenerar slug desde título + botón copy de URL pública
- [x] `hasChanges` tracking para habilitar/deshabilitar botón Save
- [x] Eliminado `lib/mock-properties.ts` (ya no se usa mock data)
- [x] Namespace `property_form` traducido a los 7 locales
- [x] `primary.DEFAULT` agregado a Tailwind config para clases de utilidad (`bg-primary`, `text-primary`)
- [x] `PropertyCard` fix: renderizado condicional del logo del developer para evitar `src` vacío
- [x] UI de acciones: botones full-width apilados (Create/Save + Cancel en new a `/app/properties`; Delete en edit con `AlertDialog` de confirmación, reemplaza el `confirm()` nativo)
- [x] `PageHeader` (ui) con botón back fijo "Back" + ArrowLeft, usado en new/edit (NO en broker/developer por decisión del usuario)
- [x] `AlertDialog` (ui, basado en `radix-ui` unificado, patrón shadcn como `sheet.tsx`)
- [x] `broker-form` y `developer-form`: botones full-width + botón Cancel en modo create (a `/app`); NO tienen botón Delete (no hay server action de delete para broker/developer)

### Pendiente
- [ ] Traducir comunidades a otros locales (hoy solo existe fila en locale 'ae'; el contenido se muestra en inglés en todos los locales)
- [ ] Asignar `developer_id` a cada comunidad (hoy NULL; el bloque "Main Developer" del info-card se reimplementará cuando haya datos)
- [ ] ⚠️ CTA "See properties" de `community-info-card.tsx` apunta a `/properties-list?community={slug}` — ruta inexistente (la lista real es `/properties` y no lee query params)
- [ ] ⚠️ CTA "See properties" de `developer-info-card.tsx` apunta a `/properties-list?developer={slug}` — ruta inexistente (mismo problema que el de communities; documentado en `docs/DEVELOPER-PAGE-FORM.md`)
- [ ] Página de listado de desarrollos: existe con mock data hardcodeado, búsqueda deshabilitada — falta conectar a DB
- [ ] Panel de administración para promotoras
- [ ] Mapa global con unidades geolocalizadas
- [ ] Reemplazar componentes de tutorial de Supabase starter kit
- [ ] Dashboard de favoritos y consultas del usuario
- [ ] `app/app/settings` page: existe como placeholder (solo heading), sin contenido implementado
- [ ] Market news: páginas de listado y detalle con mock data — falta conectar a DB
- [ ] Pagos reales con Stripe pendientes: `auth/payment` es mock visual (sin Stripe ni persistencia de plan); `lib/pricing-plans.ts` quedó sin uso. Implementación documentada en `docs/STRIPE-PLANS.md` (migración propuesta `023_plans_and_subscriptions.sql`)

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
| @tiptap/extension-image | 3.29.2 | Imágenes en el editor rich text (TipTap) |
| @tiptap/extension-placeholder | 3.29.2 | Placeholder del editor rich text (TipTap) |
| @tiptap/pm | 3.29.2 | ProseMirror core (peer de @tiptap/react) |
| @tiptap/react | 3.29.2 | Editor rich text (bindings React, v3) |
| @tiptap/starter-kit | 3.29.2 | Extensiones base de TipTap (bold, italic, headings, lists, blockquote) |
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

Creada por migración `supabase/migrations/007_developers_developments_properties_rebuild.sql` y ampliada por `011_developers_page_fields.sql`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del developer |
| name | text | NOT NULL | Nombre de la promotora |
| slug | text | NOT NULL, UNIQUE | Slug unico |
| logo_url | text | nullable | URL del logo |
| website | text | nullable | Sitio web |
| description | text | nullable | Descripcion (HTML sanitizado desde 08-2026; legacy `**bold**` soportado) |
| cover_image | text | nullable | Imagen de portada (migración 011) |
| city | text | nullable | Ciudad (migración 011) |
| on_time_completion | integer | nullable, validado 0–100 en server action | % de entregas a tiempo (migración 011) |
| email | text | nullable | Email publico (migración 011) |
| phone | text | nullable | Telefono publico (migración 011) |
| country | text | nullable | Pais de operacion |
| is_verified | boolean | NOT NULL DEFAULT false | Developer verificado |
| user_profile_id | uuid | FK → user_profiles(id) ON DELETE SET NULL, UNIQUE (migración 011) | ID del perfil de usuario asociado (una sola pagina por usuario) |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:** `slug`, `user_profile_id`, `country`

**Trigger:** `trigger_set_updated_at_developers`

**Políticas RLS:**
- SELECT público: developers verificados (`is_verified = true`)
- SELECT propio: developer ve su propio registro (`auth.uid() = user_profile_id`)
- INSERT: propio con `WITH CHECK (auth.uid() = user_profile_id)` (migración 011, para el form de `/app/developer`)
- UPDATE: propio con `USING (auth.uid() = user_profile_id)` (migración 011)

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

Creada por migración `supabase/migrations/007_developers_developments_properties_rebuild.sql` (reemplaza 003). Ampliada/modificada por 015 (subcategory), 016 (drop property_type), 017 (drop payment_plan_months), 018 (drop has_balcony/has_garden), 019 (development fields), 020 (RLS).

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
| subcategory | text | nullable (migración 015) | Subcategoria (de tabla property_subcategories) |
| development | text | nullable (migración 019) | Nombre del desarrollo (texto libre, los 3 perfiles) |
| development_area | numeric | nullable (migración 019) | Area total del desarrollo (numero libre) |
| developer | text | nullable (migración 019) | Nombre del developer (texto plano para broker/private_seller; para rol developer se auto-completa desde developers.name) |
| bedrooms | integer | nullable | Dormitorios |
| bathrooms | integer | nullable | Banos |
| area_sqft | numeric | nullable | Area en pies cuadrados |
| area_sqm | numeric | nullable | Area en metros cuadrados |
| floor | integer | nullable | Piso |
| price | numeric | NOT NULL | Precio |
| currency | text | NOT NULL DEFAULT 'USD', CHECK IN ('AED', 'USD', 'EUR', 'GBP') | Moneda |
| deposit_percentage | numeric | nullable | Porcentaje de deposito |
| deposit_amount | numeric | nullable | Monto del deposito |
| has_post_handover | boolean | DEFAULT false | Tiene plan post-entrega |
| handover_date | date | nullable | Fecha de entrega |
| amenities | text[] | nullable | Lista de amenities |
| images | text[] | nullable | URLs de imagenes |
| cover_image | text | nullable | URL de imagen principal |
| tags | text[] | nullable | Tags |
| is_featured | boolean | DEFAULT false | Propiedad destacada |
| is_active | boolean | DEFAULT true | Propiedad activa |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Columnas eliminadas (migraciones 016–018):** `property_type` (016, la clasificación ahora viene solo de `subcategory`), `payment_plan_months` (017), `has_balcony` y `has_garden` (018, capturadas vía amenities con slugs `balcony`, `private-garden`, `landscaped-gardens`, `rooftop-garden`).

**Índices:**
- `listed_by_id`, `listed_by_type`, `developer_id`, `development_id`, `status`, `country`, `city`, `is_active`
- Compuesto: `(listed_by_id, is_active)` — query del dashboard
- ⚠️ `idx_properties_property_type` eliminado en 016 (junto con la columna `property_type`)

**Trigger:**
- `trigger_set_updated_at_properties`: actualiza `updated_at` automáticamente en cada UPDATE

**Políticas RLS:**
- SELECT público: propiedades activas (`is_active = true`)
- SELECT privado: seller ve todas sus propiedades (`auth.uid() = listed_by_id`)
- INSERT (migración 020 reforzada): `listed_by_id = auth.uid()`, `listed_by_type = role` (subquery a user_profiles), y coherencia de `developer_id`: rol developer → `developer_id` debe ser SU propio `developers.id` (`user_profile_id = auth.uid()`); broker/private → `developer_id` debe ser NULL
- UPDATE (migración 020 reforzada): dueño (`auth.uid() = listed_by_id`), además de la misma coherencia de `listed_by_type` y `developer_id` en el WITH CHECK
- DELETE: solo seller dueño (`auth.uid() = listed_by_id`)

### payment_plan_milestones (ELIMINADA)

⚠️ La tabla `payment_plan_milestones` fue **eliminada** por la migración `supabase/migrations/017_drop_payment_plan_milestones.sql` (junto con la columna `payment_plan_months` de `properties`). La sección de Payment Plan Milestones y la lógica de mortgage no se mantuvieron (decisión de producto: no bien pensada, se replanteará en el futuro). Se mantiene `has_post_handover` como información adicional simple. Ya no existe `MilestonesEditor` ni la server action `saveMilestones` en el código. Documentación previa de esta tabla (en secciones 7 de flujos y en PRD.md) queda obsoleta.

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

### community_tags y property_amenities

Creadas por migración `supabase/migrations/009_community_tags_amenities.sql`. Tablas de referencia curadas (tags de comunidad y amenities de propiedad), seeds en `supabase/seed/community_tags.sql` y `property_amenities.sql`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID |
| slug | text | NOT NULL, UNIQUE | Slug unico |
| name | text | NOT NULL | Nombre |
| icon_url | text | nullable | URL del icono (solo property_amenities) |
| category | text | nullable | Categoria |
| is_active | boolean | NOT NULL DEFAULT true | Activo |
| created_at / updated_at | timestamptz | DEFAULT now() | Timestamps |

**RLS:** SELECT público (`is_active = true`). Data access: `lib/community-tags.ts`, `lib/property-amenities.ts`.

### property_subcategories

Creada por migración `supabase/migrations/010_property_subcategories.sql`. Seed en `supabase/seed/property_subcategories.sql`. Mismas columnas que las tablas anteriores (`id`, `slug` UNIQUE, `name`, `category`, `is_active`, timestamps).

**RLS:** SELECT público (`is_active = true`). Data access: `lib/property-subcategories.ts`.

### cities

Creada por migración `supabase/migrations/013_cities.sql`. Ciudades curadas por país para el dropdown del form de developer. Seed en `supabase/seed/cities.sql`.

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID |
| country | text | NOT NULL | Pais (AE, AR, BR, ES, GB, ID, ME, MX, PT) |
| name | text | NOT NULL | Nombre de la ciudad |
| created_at / updated_at | timestamptz | DEFAULT now() | Timestamps |

**Constraints:** `UNIQUE (country, name)`

**RLS:** SELECT público (sin filtro). Data access: `lib/cities.ts` (`getCitiesByCountry`).

### broker_profiles

Creada por migración `supabase/migrations/014_broker_profile.sql` y ampliada por `022_broker_credentials.sql`. Perfil público del broker (accesible solo desde property detail pages, no hay listing page).

| Columna | Tipo | Constraints | Descripcion |
|---|---|---|---|
| id | uuid | PK, default gen_random_uuid() | ID del perfil |
| user_profile_id | uuid | NOT NULL, UNIQUE, FK → user_profiles(id) ON DELETE CASCADE | Perfil de usuario asociado (un solo perfil por broker) |
| name | text | NOT NULL | Nombre del broker |
| slug | text | NOT NULL, UNIQUE | Slug unico |
| profile_image | text | nullable | URL de imagen de perfil |
| personal_url | text | nullable | URL personal del broker |
| description | text | nullable | Descripcion (HTML sanitizado via TipTap) |
| country | text | nullable | Pais de operacion |
| city | text | nullable | Ciudad |
| email_public | text | nullable | Email publico |
| phone | text | nullable | Telefono |
| whatsapp | text | nullable | Numero de WhatsApp |
| closed_transactions | integer | DEFAULT 0 | Transacciones cerradas (auto-declarado, no calculado) |
| rera_card_url | text | nullable (migración 022) | URL de la imagen de la RERA Broker Card / ID (bucket broker-images/rera) |
| qr_code_url | text | nullable (migración 022) | URL de la imagen del QR Code (bucket broker-images/qr) |
| agency_orn | text | nullable (migración 022) | Agency ORN (Office Registration Number), máx 64 chars validado en server action |
| details_confirmed | boolean | NOT NULL DEFAULT false (migración 022) | Checkbox "I confirm these details are up to date" |
| is_verified | boolean | NOT NULL DEFAULT false | Broker verificado (controla visibilidad publica) |
| created_at | timestamptz | DEFAULT now() | Fecha de creacion |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualizacion |

**Índices:** `slug`, `user_profile_id`

**Trigger:** `trigger_set_updated_at_broker_profiles`

**Políticas RLS:**
- SELECT público: brokers verificados (`is_verified = true`)
- SELECT propio: broker ve su propio perfil sin filtro de verificación (`auth.uid() = user_profile_id`)
- INSERT: propio con `WITH CHECK (auth.uid() = user_profile_id)`
- UPDATE: propio con `USING (auth.uid() = user_profile_id)`

### Storage: property-images

Bucket creado por migración `supabase/migrations/005_storage_property_images.sql`.

- **Público:** true
- **Tamaño máximo:** 5MB
- **MIME types:** image/jpeg, image/png, image/webp
- **Estructura:** `property-images/{user_id}/{filename}`
- **Políticas:** SELECT público, INSERT/DELETE solo en carpeta del usuario autenticado

### Storage: developer-images

Bucket creado por migración `supabase/migrations/012_developer_images_bucket.sql`. Imágenes de la página de developer (cover, logo y las embebidas en la descripción).

- **Público:** true
- **Tamaño máximo:** 5MB
- **MIME types:** image/jpeg, image/png, image/webp
- **Estructura:** `developer-images/{user_id}/{folder}/{timestamp}-{rand}.{ext}` con carpetas `covers/`, `logos/` y `description/`
- **Políticas:** SELECT público, INSERT/DELETE solo en carpeta del usuario autenticado (`(storage.foldername(name))[1] = auth.uid()::text`)
- **Upload:** `lib/storage.ts` → `uploadImage(file, userId, folder, bucket?)` (usado por `ImageUpload` y por el editor TipTap; bucket configurable, default `developer-images`)

### Storage: broker-images

Bucket creado por migración `supabase/migrations/014_broker_profile.sql`. Imágenes del perfil del broker (profile image y las embebidas en la descripción).

- **Público:** true
- **Tamaño máximo:** 5MB
- **MIME types:** image/jpeg, image/png, image/webp
- **Estructura:** `broker-images/{user_id}/{folder}/{timestamp}-{rand}.{ext}` con carpetas `profile/`, `description/`, `rera/` y `qr/` (las dos últimas añadidas por la migración 022, para las credenciales del broker)
- **Políticas:** SELECT público, INSERT/DELETE solo en carpeta del usuario autenticado (`(storage.foldername(name))[1] = auth.uid()::text`)
- **Upload:** `lib/storage.ts` → `uploadImage(file, userId, folder, "broker-images")` (via prop `bucket` en `ImageUpload` y `RichTextEditor`)

### Tablas de Supabase (gestionadas por Supabase)
- `auth.users`, `auth.sessions`, `auth.mfa_factors`, etc. — auth estandar de Supabase

### Pendiente
Definir tablas de `favorites` e `inquiries`.

## 5. ESTRUCTURA DE ARCHIVOS

```
offplaninternational/
├── AGENTS.md                          # Instrucciones para agentes de opencode
├── proxy.ts                           # Middleware combinado (i18n + auth + strip de prefijo de locale)
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
│   │   ├── properties/
│   │   │   ├── page.tsx               # Listado de propiedades del usuario (PropertyList table)
│   │   │   ├── new/page.tsx           # Crear propiedad (PropertyForm + datos de referencia)
│   │   │   └── [id]/edit/page.tsx     # Editar propiedad (PropertyForm + PageHeader back)
│   │   ├── developer/page.tsx         # Developer Profile (form con editor TipTap, solo rol developer)
│   │   ├── broker/page.tsx            # Broker Profile (form con editor TipTap, solo rol broker)
│   │   ├── profile/page.tsx           # Perfil del usuario
│   │   └── settings/page.tsx          # Settings (placeholder, solo heading)
│   └── [locale]/                      # Segmento de locale (next-intl resuelve "en" sin prefijo en la URL; `localePrefix: "never"`)
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
│       │   ├── payment/page.tsx       # Seleccion de plan post-onboarding (server: resuelve role y delega en PaymentPage)
│       │   ├── forgot-password/page.tsx
│       │   ├── update-password/page.tsx
│       │   ├── confirm/route.ts       # Callback de confirmacion (redirige sin prefijo de locale)
│       │   └── error/page.tsx
│       ├── properties/page.tsx        # Listado de propiedades con filtros + cards (DB via getProperties)
│       ├── property/[slug]/page.tsx   # Detalle de propiedad
│       ├── communities/page.tsx       # Listado de comunidades (DB + busqueda client)
│       ├── community/[slug]/page.tsx  # Detalle de comunidad (descripcion HTML sanitizada)
│       ├── developers/page.tsx        # Listado de developers (DB, is_verified + busqueda client)
│       ├── developer/[slug]/page.tsx  # Detalle de developer (DB, descripcion HTML sanitizada)
│       ├── broker/[slug]/page.tsx     # Detalle de broker (DB, header + descripcion + propiedades activas)
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
│   │   ├── developer-card.tsx         # Card de developer (descripcion sin tags via stripHtmlToText)
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
│   │   ├── developer-description.tsx  # Render HTML sanitizado + fallback legacy **bold**
│   │   ├── developer-header.tsx
│   │   ├── developer-info-card.tsx    # Info + CTA "See properties" (safeWebsite en href)
│   │   └── developers-grid.tsx        # Grid + busqueda client-side (stripHtmlToText)
│   ├── developments/                  # Componentes de developments
│   │   ├── development-header.tsx
│   │   └── development-info-card.tsx
│   ├── properties/                    # Componentes de propiedades
│   │   ├── property-card.tsx          # Card de propiedad horizontal (server, async)
│   │   ├── property-gallery.tsx       # Galeria de imagenes (client)
│   │   ├── property-sidebar.tsx       # Sidebar con precio + links condicionales (dev/developer) + botones (server)
│   │   ├── property-description.tsx   # Descripcion de la propiedad (server)
│   │   ├── property-details-table.tsx # Tabla de detalles (server)
│   │   ├── property-amenities-grid.tsx # Grid de amenities con modal (client)
│   │   ├── property-tags.tsx          # Tags de propiedad (server)
│   │   ├── property-filters.tsx       # Barra de filtros completa (client)
│   │   └── related-properties.tsx     # Seccion de propiedades relacionadas (server)
│   ├── auth/                          # Componentes de autenticacion
│   │   ├── login-form.tsx             # Formulario login (useTranslations)
│   │   ├── sign-up-form.tsx           # Formulario registro con tabs de rol (useTranslations)
│   │   ├── forgot-password-form.tsx   # Formulario reset password (useTranslations)
│   │   ├── update-password-form.tsx   # Formulario actualizar password (useTranslations)
│   │   ├── payment-page.tsx           # Mock UI de planes por perfil (client, usa lib/plans.ts, sin Stripe)
│   │   ├── auth-button.tsx            # Boton auth contextual (server)
│   │   └── logout-button.tsx          # Cerrar sesion (client)
│   ├── shared/                        # Componentes compartidos
│   │   ├── currency-provider.tsx      # Context provider de moneda (client)
│   │   ├── currency-switcher.tsx      # Dropdown de seleccion de moneda (client)
│   │   ├── currency-price.tsx         # Precio con conversion en vivo (client)
│   │   └── primary-cta-link.tsx       # Link CTA primario con flecha (client)
│   ├── platform/                      # Componentes de la plataforma vendedores
│   │   ├── app-sidebar.tsx            # Sidebar del dashboard con NAV_BY_ROLE (incl. Developer Profile, Broker Profile)
│   │   ├── developer-form.tsx         # Form de la pagina de developer (client, TipTap + ImageUpload)
│   │   ├── broker-form.tsx            # Form de la pagina de broker (client, TipTap + ImageUpload, bucket broker-images)
│   │   ├── property-form.tsx          # Form de creacion/edicion de propiedades (client, orquestador de estado, ~482 lineas)
│   │   ├── property-form/             # Sub-componentes de PropertyForm (patrón controlado value/onChange)
│   │   │   ├── form-section.tsx            # FormSection con heading
│   │   │   ├── basic-information-section.tsx
│   │   │   ├── location-section.tsx
│   │   │   ├── property-details-section.tsx # Details + Pricing
│   │   │   ├── development-details-section.tsx # Development + Development Area + Developer (+ Links fusionado)
│   │   │   ├── tags-section.tsx
│   │   │   ├── amenities-section.tsx
│   │   │   ├── images-section.tsx
│   │   │   └── visibility-section.tsx       # Save/Create + Cancel/Delete (AlertDialog)
│   │   ├── property-list.tsx          # Tabla de propiedades del usuario (7 columnas, links a edit)
│   │   ├── image-upload.tsx           # Upload de cover/logo (bucket configurable via prop)
│   │   ├── profile-form.tsx           # Form de perfil de usuario
│   │   ├── rich-text-editor.tsx       # Editor rich text TipTap (client, bucket configurable via prop)
│   │   └── site-header.tsx            # Header del dashboard con sidebar trigger
│   ├── brokers/                       # Componentes especificos de Broker
│   │   ├── broker-header.tsx          # Header de pagina publica (imagen, nombre, stats, contacto)
│   │   └── broker-description.tsx     # Render HTML sanitizado + fallback legacy **bold**
│   ├── private-sellers/               # Componentes especificos de Private Seller (vacio)
│   └── ui/                            # Componentes base (shadcn-style)
│       ├── avatar.tsx
│       ├── alert-dialog.tsx           # AlertDialog (radix-ui unificado, patrón shadcn)
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
│       ├── page-header.tsx           # Header con boton back "Back" + ArrowLeft (usado en new/edit properties)
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
│   ├── en.json (default, incluye namespace `auth`)
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
│   │   ├── 008_communities.sql         # Communities + community_translations
│   │   ├── 009_community_tags_amenities.sql  # Tablas de referencia community_tags + property_amenities
│   │   ├── 010_property_subcategories.sql    # Tabla de referencia property_subcategories
│   │   ├── 011_developers_page_fields.sql    # Campos pagina developer + RLS INSERT/UPDATE del owner
│   │   ├── 012_developer_images_bucket.sql   # Bucket developer-images (5MB, jpeg/png/webp)
│   │   ├── 013_cities.sql              # Tabla cities (dropdown del form de developer)
│   │   ├── 014_broker_profile.sql      # Tabla broker_profiles + bucket broker-images + RLS
│   │   ├── 015_property_subcategory.sql # Columna subcategory en properties
│   │   ├── 016_drop_property_type.sql  # Elimina columna property_type (la clasificación ahora viene de subcategory)
│   │   ├── 017_drop_payment_plan_milestones.sql  # Elimina tabla payment_plan_milestones + columna payment_plan_months
│   │   ├── 018_drop_balcony_garden.sql # Elimina columnas has_balcony y has_garden (capturadas via amenities)
│   │   ├── 019_properties_development_fields.sql # Campos development, development_area, developer en properties (EJECUTADA)
│   │   ├── 020_enforce_developer_id_rls.sql  # Refuerza RLS INSERT/UPDATE de properties para coherencia de developer_id (EJECUTADA)
│   │   └── 022_broker_credentials.sql    # Credenciales del broker (rera_card_url, qr_code_url, agency_orn, details_confirmed en broker_profiles)
│   └── seed/
│       ├── communities.sql             # 42 comunidades + 42 traducciones 'ae' (upserts)
│       ├── community_tags.sql          # Tags de comunidad curados
│       ├── property_amenities.sql      # Amenities de propiedad curados
│       ├── property_subcategories.sql  # Subcategorias de propiedad curadas
│       └── cities.sql                  # Ciudades por pais (AE, AR, BR, ES, GB, ID, ME, MX, PT)
├── docs/
│   ├── CONTEXT.md                     # Este archivo
│   ├── PRD.md                         # Product Requirements Document (agente analista)
│   ├── DEVELOPER-PAGE-FORM.md         # Plan del form de pagina de developer (migraciones 011-013 + TipTap)
│   ├── ONBOARDING-FLOW.md             # Plan del flujo de onboarding por rol
│   ├── STRIPE-PLANS.md                # Paso a paso de implementacion futura de Stripe (migracion propuesta 023_plans_and_subscriptions.sql)
│   └── TIPTAP-PLAN.md                 # Plan de integracion del editor TipTap
├── lib/
│   ├── actions.ts                     # Server actions: saveDeveloperProfile, saveBrokerProfile, saveProperty, deleteProperty (validacion + sanitizacion)
│   ├── brokers.ts                     # Data access de brokers (getBrokerBySlug, getMyBroker) + tipo BrokerDetailData
│   ├── cities.ts                      # getCitiesByCountry (dropdown del form)
│   ├── communities.ts                 # Data access + tipo Community (getCommunities, getCommunityBySlug)
│   ├── community-tags.ts              # Data access de community_tags
│   ├── content/                       # Contenido estatico de paginas legales (privacy, terms)
│   ├── countries.ts                   # getCountryCode/getCountryLabel
│   ├── developers.ts                  # Data access de developers (getDevelopers, getDeveloperBySlug, getMyDeveloper)
│   ├── properties.ts                  # Data access de propiedades (getPropertyBySlug, getRelatedProperties, getProperties, getMyProperties, getMyProperty); JOINs a developers, broker_profiles, user_profiles, developments; toPropertyData resuelve campos flat (development/developer/area)
│   ├── property-amenities.ts          # Data access de property_amenities
│   ├── property-subcategories.ts      # Data access de property_subcategories
│   ├── rich-text.tsx                  # splitBold() — render de **bold** legacy (JSX, compartida con developers/brokers)
│   ├── sanitize-html.ts               # Sanitizador HTML allowlist (sanitizeHtml curado + sanitizeUserHtml user-generated)
│   ├── storage.ts                     # uploadImage(file, userId, folder, bucket?) — bucket configurable (default developer-images)
│   ├── currency.ts                    # Tipos, monedas, formatPrice, mapa locale->moneda
│   ├── currency-server.ts             # Lectura de cookie de moneda server-side
│   ├── exchange-rates.ts              # Tasas fijas + convertPrice() para MVP
│   ├── filter-options.ts              # Opciones de filtros centralizadas
│   ├── mock-developments.ts           # Mock data de developments
│   ├── mock-market-news.ts            # Mock data de market news
│   ├── plans.ts                       # Catálogo de planes por perfil (mock UI sin Stripe): getPlansForRole, getPlan, getMaxProperties, PLANS, tipos PlanTier/Plan
│   ├── pricing-plans.ts               # Pricing matrix por role x pais ⚠️ SIN USO EN CODIGO (reemplazado por lib/plans.ts)
│   ├── types.ts                       # UserRole, UserProfile, PropertyData, Developer, BrokerProfile, etc.
│   ├── utils.ts                       # cn(), hasEnvVars, isHtmlText, stripHtmlToText, slugify, toEditorHtml
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
| 2026-05-21 | next-intl v4 con `localePrefix: "as-needed"` ⚠️ OBSOLETO (02-sep-2026: ahora `"never"`) | Se sirve siempre en inglés; ningún prefijo de locale en URLs |
| 2026-05-21 | `proxy.ts` en lugar de `middleware.ts` | Next.js 16 cambió el API de middleware; proxy combina locale routing + auth |
| 2026-05-21 | Geo-detección por headers CDN (Vercel/Cloudflare/AWS) ⚠️ ELIMINADO (02-sep-2026) | El sitio se sirve siempre en inglés; ya no se detecta país para elegir locale |
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
| 2026-07-23 | Tipos `PropertyStatus`, `PropertyCurrency` extraídos en `lib/types.ts` (⚠️ `PropertyType` eliminado con la columna `property_type`, migración 016) | Unifica restricciones de BD con tipos TypeScript; facilita autocomplete y validación |
| 2026-07-27 | Rename `/dashboard` → `/app` | Ruta más corta y clara para la plataforma de vendedores; separa conceptualmente del sitio público |
| 2026-07-27 | Componentes reorganizados en directorios por dominio (`site/`, `properties/`, `auth/`, `shared/`, `platform/`) | Escalabilidad: facilita encontrar componentes y agregar nuevos sin ensuciar la raíz de `components/` |
| 2026-07-27 | Directorios vacíos `developers/`, `brokers/`, `private-sellers/` | Preparados para componentes específicos por role cuando se implementen |
| 2026-07-27 | Template cleanup: 13 archivos eliminados + `(auth)/` route group + `ui/sidebar.tsx` | Elimina código muerto del starter kit de Supabase; reduce confusión |
| 2026-07-27 | shadcn defaults restaurados: Button (`h-9`/`h-10`), Input (`h-9`), custom spacing eliminado | Base sólida para UI consistente; evita overrides innecesarios que dificultan Upgrades |
| 2026-07-27 | Auth i18n: namespace `auth` traducido a 7 locales + auth components con `useTranslations` | Formularios de auth completamente traducidos; elimina texto hardcodeado en inglés |
| 2026-07-27 | `emailRedirectTo` y `forgot-password` redirectTo incluyen locale via `useLocale()` ⚠️ OBSOLETO (02-sep-2026) | Los links de email mantenían el locale del usuario al confirmar. Con el sitio siempre en inglés (`localePrefix: never`) el `useLocale()` devuelve `en` y los redirects van sin prefijo; el middleware los resuelve |
| 2026-07-27 | `confirm/route.ts` lee cookie `NEXT_LOCALE` para redirects locale-aware ⚠️ OBSOLETO (02-sep-2026) | El usuario mantiene su locale al ser redirigido tras confirmar email o completar onboarding. Ahora el sitio es siempre inglés y `NEXT_LOCALE` se eliminó; los redirects van sin prefijo |
| 2026-07-27 | UI primitives creados: `textarea.tsx` (shadcn pattern), `dialog.tsx` (Radix UI) | Completan el set de componentes base para formularios y modales |
| 2026-07-31 | Migración 008: tablas `communities` y `community_translations` con patrón idéntico a 007 | Consistencia: RLS select público, triggers updated_at con `DROP TRIGGER IF EXISTS` (idempotentes), FK developer_id → developers ON DELETE SET NULL, UNIQUE(community_id, locale) |
| 2026-07-31 | Comunidades como contenido curado en DB (no mock ni user-generated) | 42 comunidades de Dubai importadas de CSV de Webflow; el tipo `Community` vive en `lib/communities.ts` (eliminado `CommunityData` de `lib/types.ts`) |
| 2026-07-31 | `webflow-databases/` ignorado en git | El CSV exportado de Webflow es origen de datos, no se versiona; el seed SQL es el artefacto versionado |
| 2026-07-31 | Traducciones por fila en `community_translations` con fallback locale → 'en' → primera disponible (⚠️ antes 'ae', default cambiado a 'en' el 02-sep-2026) | El contenido base (42 filas 'ae') se muestra en inglés en todos los locales; las traducciones se agregan por fila sin tocar código |
| 2026-07-31 | Sanitizador HTML allowlist custom (`lib/sanitize-html.ts`) en vez de librería (sanitize-html/DOMPurify) | Sin dependencias nuevas; el HTML proviene de contenido curado por el equipo; allowlist de tags y bloqueo de tags peligrosos + neutralización de entidades (`&#x3c;` → `&amp;lt;`) |
| 2026-07-31 | Descripción de comunidad con `dangerouslySetInnerHTML` sobre `sanitizeHtml()` | El contenido es HTML rico (h4/p/strong/ul/blockquote) del CSV; se sanitiza en render para eliminar scripts/iframes/entidades peligrosas |
| 2026-07-31 | Validación de `google_map_url` en runtime: solo hosts google.com/maps y path `/maps/` | Un iframe malicioso es un vector de XSS; solo se renderiza si la URL es de Google Maps, devolviendo null si no |
| 2026-07-31 | Iframe del mapa con `sandbox="allow-scripts allow-same-origin allow-popups"` y `referrerPolicy="no-referrer"` | Reduce superficie de ataque del embed de terceros; hallazgo de auditoría security |
| 2026-07-31 | Bloque "Main Developer" eliminado del info-card (developer_id siempre NULL) | El CSV de Webflow no traía developers reales; se reimplementará cuando haya datos. El seed NO incluye developer_id en el DO UPDATE para no pisar asignaciones manuales |
| 2026-08-05 | Migraciones 009–010: tablas de referencia `community_tags`, `property_amenities`, `property_subcategories` + seeds curados | Datos curados como referencia (patrón communities); RLS select público por `is_active`; data access en `lib/*.ts` por dominio |
| 2026-08-05 | Migraciones 011–013 para la página pública de developer + form `/app/developer` | Campos flat en `developers` (patrón `PropertyData`): `cover_image`, `city`, `on_time_completion`, `email`, `phone`; `UNIQUE(user_profile_id)` (una página por usuario); RLS INSERT/UPDATE del owner; bucket `developer-images`; tabla `cities` curada para dropdowns |
| 2026-08-05 | Editor rich text TipTap v3.29.2 para `developers.description` (HTML sanitizado) en vez de `<textarea>` + `**bold**` | UX de formato rico (Bold, Italic, H3, listas, blockquote, imagen) sin markdown manual; el HTML se persiste en `developers.description` (TEXT, sin migración de columna); `immediatelyRender: false` para SSR |
| 2026-08-05 | Server action `saveDeveloperProfile` en `lib/actions.ts` (módulo separado) | Un server action no puede vivir en un módulo que importe `next/headers` junto a exports usados por client: Next arrastra `lib/supabase/server.ts` al bundle cliente y rompe `pnpm build` |
| 2026-08-05 | `sanitizeUserHtml()` (allowlist user-generated) + núcleo `processHtml` compartido con `sanitizeHtml()` | Allowlist mínimo (p, strong, em, br, ul/ol/li, blockquote, h2, h3, img); `img` restringida al origin https de Supabase Storage; corrige XSS por tag truncado (todo `<`/`>` del texto se escapa) y neutraliza entidades; se aplica en cliente y servidor |
| 2026-08-05 | Sin columna `short_description` ni tabla para imágenes de la descripción | La card del listado hace strip de tags (`stripHtmlToText()` en `lib/utils.ts`); las imágenes quedan embebidas como `<img src>` en el HTML de `description` (bucket `developer-images/{userId}/description/`) |
| 2026-08-05 | Datos legacy `**bold**` siguen renderizando (fallback en `DeveloperDescription`) y se convierten a HTML al editar (`toEditorHtml`) | Compatibilidad total sin migrar datos existentes |
| 2026-08-05 | Prefill del form condicional por `isNew` (solo developers nuevos toman website/email/phone de `user_profiles`) | Corrige bug del botón Save siempre habilitado: los rows existentes no prefillan campos nullables, así `hasChanges` compara contra el valor real |
| 2026-08-05 | `safeWebsite()` en `developer-info-card.tsx` (href solo si es URL http(s) válida, sino `<span>`) | Hallazgo de auditoría security: evita `javascript:` en href |
| 2026-08-06 | Broker profiles accesibles solo desde property detail pages (no hay listing page de brokers) | Los brokers se descubren a través de las propiedades que listan, no como entidad independiente |
| 2026-08-06 | Bucket `broker-images` separado de `developer-images` | Aísla datos de storage por rol; permite políticas RLS independientes y gestión de cuota separada |
| 2026-08-06 | `is_verified` controla visibilidad pública; brokers no verificados solo ven su propio perfil en dashboard | Misma estructura que developers: el admin aprueba antes de publicar |
| 2026-08-06 | `closed_transactions` es auto-declarado por el broker (no calculado) | No hay sistema de tracking de transacciones en MVP; se calculará automáticamente en el futuro |
| 2026-08-06 | `slugify()` y `toEditorHtml()` extraídas a `lib/utils.ts` (compartidas entre broker y developer forms) | Evita duplicación de utilidades; ambos forms necesitan las mismas transformaciones |
| 2026-08-06 | `splitBold()` en `lib/rich-text.tsx` (necesita JSX, separada de `lib/utils.ts`) | La función retorna `React.ReactNode[]` y no puede vivir en un archivo de utilidades puras sin imports de React |
| 2026-08-06 | `.rich-description` en `globals.css` compartida entre developer y broker (renombrada desde `.developer-description`) | Misma estilización para renders de HTML de usuarios; evita CSS duplicado |
| 2026-08-06 | `safeUrl()` en `broker-header.tsx` para validar `personal_url` en href | Misma seguridad que `safeWebsite()`: evita `javascript:` en href |
| 2026-08-06 | PropertySidebar recibe `sellerName`, `sellerSlug`, `listedByType` como props | Permite link condicional a `/broker/{slug}` o `/developer/{slug}` sin hardcodear en el componente |
| 2026-08-25 | ~~Server actions `saveProperty`, `deleteProperty`, `saveMilestones` en `lib/actions.ts`~~ ⚠️ OBSOLETO: `saveMilestones` eliminado (migración 017) | Mismo módulo que las acciones de developer/broker; validación server-side completa y ownership checks vía `listed_by_id = user.id` |
| 2026-08-25 | `PropertyForm` como client component con 10 secciones y useState por campo | Patrón consistente con developer-form y broker-form; permite auto-cálculos reactivos (area_sqm, deposit_amount) sin form library. ⚠️ Actualizado en 2026-sep: ahora es orquestador de estado con secciones extraídas a sub-componentes |
| 2026-08-25 | ~~`MilestonesEditor` como componente client separado~~ ⚠️ ELIMINADO (migración 017) | Reutilizable dentro de PropertyForm; maneja CRUD + reordenamiento + validación de porcentaje total ≤ 100 |
| 2026-08-25 | `PropertyList` como server component con tabla HTML nativa | Más simple que @tanstack/react-table para el dashboard del usuario; no necesita sorting/pagination/drag-drop |
| 2026-08-25 | Data access en `lib/properties.ts` con JOINs (developers, broker_profiles, user_profiles, developments) | Unifica la query de propiedades en una función `toPropertyData()` reutilizable por todas las funciones de data access. ⚠️ El JOIN a `payment_plan_milestones` se eliminó (migración 017) |
| 2026-08-25 | ~~`saveMilestones` usa delete-all + insert (no upsert)~~ ⚠️ OBSOLETO: `saveMilestones` eliminado (migración 017) | Los milestones se reemplazan completos; simplifica la lógica vs. reconciliar ids existentes |
| 2026-08-25 | Eliminación de `lib/mock-properties.ts` | La data de propiedades ahora viene de Supabase; el mock ya no era necesario |
| 2026-08-25 | `primary.DEFAULT` en Tailwind config | Permite clases como `bg-primary`, `text-primary`, `border-primary` que antes no resolvían sin la key DEFAULT |
| 2026-08-25 | `property_form` como namespace de traducciones en los 7 locales | Todos los labels y mensajes del form están traducidos; consistencia con auth, broker_detail, communities |
| 2026-08-25 | Fix `PropertyCard` logo renderizado condicionalmente | Evita error de `next/image` con `src=""` cuando el developer no tiene logo_url |
| 2026-08-25 | Form carga datos de referencia (cities, amenities, subcategories, developments) en Server Components | Las páginas new/edit son server components que pre-cargan datos y los pasan como props al PropertyForm client |
| 2026-09-02 | Migración 019: campos flat `development`, `development_area`, `developer` en `properties` | Sección "Development Details" sin depender de JOINs; `developer` es texto plano para broker/private_seller, y para rol developer se auto-completa desde `developers.name` (el vínculo fuerte sigue siendo `developer_id`) |
| 2026-09-02 | `SavePropertyPayload` quita `developer_id` (el server lo resuelve) | Evita body manipulation: el server deriva `developer_id`/`developer_name` desde `developers` (por `user_profile_id = user.id`) en ambas ramas INSERT y UPDATE; para no-developer fuerza `developer_id = null` y usa `developer` plano del form |
| 2026-09-02 | Migración 020: política RLS de `properties` exige coherencia de `developer_id` | Complementa la validación server-side: rol developer debe usar SU propio `developers.id`; broker/private deben tener `developer_id` NULL. Evita spoofing de marca/propiedades ajenas |
| 2026-09-02 | `toNumNull()` acepta strings numéricas | Corrige payloads del form que envían valores como string; normaliza a number o null |
| 2026-09-02 | `PropertyRow`/`toPropertyData` resuelven `developer_name`/`development_name`/`development_total_area` desde campos flat con fallback a JOIN | `developer_name` = `row.developer ?? dev?.name`; `development_name` = `row.development ?? devt?.name`; `development_total_area` = `row.development_area ?? 0`. `community_total_area` queda hardcodeado a 0 (pedido del usuario, no se toca) |
| 2026-09-02 | Componentización de `PropertyForm`: 8 sub-componentes en `components/platform/property-form/` con patrón controlado (estado en el padre, value/onChange por props) | Reduce el archivo principal de ~927 a ~482 líneas; cada sección es un componente independiente; la sección "Links" se fusionó dentro de Development Details; orden: Basic → Location → Details → Development → Tags → Amenities → Images → Visibility |
| 2026-09-02 | `PageHeader` (ui) con botón back fijo "Back" + ArrowLeft en new/edit; NO en broker/developer | Decisión del usuario: el back solo aplica a la creación/edición de propiedades (navegación a `/app/properties`) |
| 2026-09-02 | `AlertDialog` (ui) basado en `radix-ui` unificado (patrón shadcn como `sheet.tsx`) | Reemplaza el `confirm()` nativo del Delete de propiedades con un diálogo accesible y consistente |
| 2026-09-02 | Botones full-width apilados en visibility-section / broker-form / developer-form; Cancel solo en modo create | UX consistente en todos los forms; broker/developer no tienen Delete (no existe server action de delete para esos perfiles) |
| 2026-09-02 | Sitio forzado en inglés: `defaultLocale: "en"`, `localePrefix: "never"` | Decisión de producto: siempre inglés por ahora. Se mantiene next-intl y los 7 archivos de mensajes (dormidos); `messages/ae.json` renombrado a `messages/en.json` |
| 2026-09-02 | Eliminada geo-detección y cookie `NEXT_LOCALE` del proxy; `stripLocalePrefix()` redirige (301) cualquier `/<locale>/...` a `/...` | Sin locale en URLs; cualquier prefijo legacy (incl. `/en/` y `/ae/`) se normaliza a la versión limpia antes del `intlMiddleware` |
| 2026-09-02 | Auth callbacks/redirects sin prefijo de locale (`/app`, `/auth/*`); `auth-callback-client` y `confirm/route` ya no leen `NEXT_LOCALE` | Como el sitio es siempre `en` y no hay prefijo, los redirects van directo sin locale; el middleware de next-intl y `stripLocalePrefix` resuelven cualquier prefijo legacy |
| 2026-09-02 | `DEFAULT_LOCALE = "en"` en `lib/properties.ts` y `lib/communities.ts`; condiciones `locale === "ae" || "en" || "gb" ? "en" : ...` en privacy/terms/confirm-email | Sincroniza los defaults de data access con el nuevo default `en`; `ae`/`gb` se mantienen mapeados a inglés para compatibilidad |
| 2026-09-02 | `locale = "en"` (constante) en `/app/properties/new` y `/app/properties/[id]/edit` | Las páginas del dashboard son standalone (sin i18n); se reemplazó la lectura de `cookies()`/`NEXT_LOCALE` por la constante `"en"` |
| 2026-09-03 | Planes por perfil en tiers (mock UI sin Stripe): `lib/plans.ts` + `components/auth/payment-page.tsx`; `lib/pricing-plans.ts` (role × país) queda SIN uso | Decisión de producto: los planes son por perfil, no por país. Cada perfil (developer/broker/private_seller) tiene plan Free (sin Stripe, 10 propiedades) + 3 tiers de pago; se muestra un mock visual de los tiers con la cantidad disponible sin persistencia ni pago real. Stripe se implementará luego (paso a paso en `docs/STRIPE-PLANS.md`, migración propuesta `023_plans_and_subscriptions.sql`) |
| 2026-09-03 | Credenciales de broker en `broker_profiles` (migración 022: `rera_card_url`, `qr_code_url`, `agency_orn`, `details_confirmed`) | El onboarding del broker y el broker-form capturan credenciales (RERA card + QR + ORN + confirmación). RERA card y QR como imágenes (buckets `broker-images/rera` y `/qr`); `license_number` (campo texto) fue reemplazado por la imagen RERA |
| 2026-09-03 | Reutilizar el bucket `broker-images` para las carpetas `rera/` y `qr/` (en vez de crear buckets nuevos) | Se mantuvo el bucket existente (público, 5MB, jpeg/png/webp) ya configurado con RLS por carpeta del usuario; se agregaron las carpetas dentro del mismo bucket |

## 7. FLUJOS PRINCIPALES

### 7.1 Routing de locale (siempre inglés, sin prefijo)

1. Usuario llega a `/` o a cualquier ruta pública sin prefijo de locale
2. `proxy.ts` evalúa si es ruta standalone (`/app`, `/login`, `/signup`) → `updateSession` (auth), o ruta auth/protected/pública
3. Para rutas públicas y auth: `stripLocalePrefix(pathname)` elimina el prefijo de locale si existe (`/<locale>/...` → `/...`) y redirige (301)
4. `intlMiddleware` (next-intl) sirve todo con `defaultLocale: "en"` y `localePrefix: "never"` (no agrega prefijo a ningún Link)
5. ⚠️ Ya no hay geo-detección ni cookie `NEXT_LOCALE` (eliminadas 02-sep-2026)

### 7.2 Registro de usuario (nuevo sistema con roles)

1. Usuario navega a `/auth/sign-up/developer` (o /broker o /private_seller) — sin prefijo de locale (siempre inglés)
2. `sign-up-form.tsx` muestra tabs para seleccionar rol (URL-driven)
3. Al cambiar tab, se navega a `/auth/sign-up/{role}` y se resetea el form
4. Usuario completa: full name, email, password, repeat password
5. `signUp()` envia `role` y `full_name` en `raw_user_meta_data`
6. Trigger `handle_new_user` en BD crea perfil en `user_profiles` con el role
7. Redirige a `/auth/confirm-email?email=...` (reemplazó a la vieja `/auth/sign-up-success`)

### 7.3 Confirmacion de email + onboarding

1. Usuario hace click en link de confirmacion de email (sin locale en URL)
2. `/auth/confirm` route handler verifica OTP con Supabase
3. Lee `role` y `profile_completed` de `user_profiles` (ya no lee cookie `NEXT_LOCALE`)
4. Si `profile_completed = false` -> redirige a `/auth/onboarding/{role}`
5. Si `profile_completed = true` -> redirige a `/app`

### 7.4 Onboarding post-confirmacion

1. Usuario accede a `/auth/onboarding/{role}`
2. Page carga config segun role (titulo, icono, descripcion)
3. Campos condicionales:
   - **Developer/Broker:** company name, company website, operating country
   - **Broker (adicional):** RERA Broker Card / ID (imagen obligatoria, bucket `broker-images/rera`), QR Code (imagen opcional, bucket `broker-images/qr`), Agency ORN (texto, máx 64 chars), checkbox "I confirm these details are up to date". ⚠️ El campo texto `license_number` fue reemplazado por la imagen RERA
   - **Private Seller:** country of residence
   - **Todos:** phone number
4. Al enviar, actualiza `user_profiles` con `profile_completed = true`
5. Si el rol es broker, hace upsert en `broker_profiles`: si el row no existe lo crea (name/slug desde company_name o full_name) y persiste las 4 credenciales; si existe, las actualiza
6. Redirige a `/auth/payment` (selección de plan)

### 7.4a Selección de plan (payment, mock sin Stripe)

1. Usuario llega a `/auth/payment` post-onboarding (requiere auth)
2. `payment/page.tsx` (server) lee `user_profiles.role` del usuario autenticado y delega en `PaymentPage`
3. `PaymentPage` (client) usa `getPlansForRole(role)` de `lib/plans.ts` y muestra los tiers del perfil (Free + 3 de pago) con la cantidad de propiedades disponible
4. Al elegir un tier y pulsar "Continue with {plan}", navega a `/app` (sin Stripe ni persistencia; TODO pendiente)

### 7.5 Login

1. Usuario completa formulario en `/auth/login` (textos traducidos via useTranslations)
2. `login-form.tsx` llama a `signInWithPassword()`
3. Si exito -> redirige a `/app`
4. Si error -> se muestra mensaje en rojo

### 7.6 Proteccion de rutas (middleware)

1. `proxy.ts` detecta rutas `/app`, `/login`, `/signup` (standalone) y las deriva a `updateSession()`
2. Para rutas `/auth/*` o `/protected/*`, ejecuta `updateSession()` primero y luego `intlMiddleware()`
3. Para el resto de rutas públicas: `stripLocalePrefix()` elimina el prefijo de locale (301) y pasa a `intlMiddleware()`
4. `updateSession()` en `lib/supabase/middleware.ts`:
   - Si no hay usuario y ruta es `/app` -> redirect a `/auth/login`
   - Si hay usuario y ruta es `/login` o `/signup` -> redirect a `/app`
   - Si no hay usuario y ruta es `/auth/*` protegida (onboarding, etc.) o `/protected/*` -> redirect a `/auth/login`
5. El layout de app tambien verifica sesion server-side con `createClient()` como fallback

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
6. Data: `getProperties()` de `lib/properties.ts` conecta a Supabase (propiedades activas, con JOINs)

### 7.12 Detalle de propiedad

1. Usuario navega a `/property/[slug]` (sin prefijo de locale)
2. Server component async que busca propiedad en DB via `getPropertyBySlug(slug)` de `lib/properties.ts`
3. Si no existe o no está activa → `notFound()`
4. Layout con Navbar, Breadcrumb, dos columnas (gallery + sidebar), y secciones inferiores
5. Columna izquierda: PropertyGallery, PropertyDetailsTable, sección de Development Details (nombre del development con link condicional a `/development/{slug}`, área total, developer con link condicional a `/developer/{slug}` si `listed_by_type === 'developer'`), Development Amenities, PropertyTags, RelatedProperties
6. Columna derecha (sticky): PropertySidebar con precio, links (Development + seller con link condicional según `listed_by_type`), botones Contact y WhatsApp
7. Todos los textos usan namespace `property_detail` traducido a 7 locales
8. ⚠️ La sección `PropertyPaymentPlan` fue eliminada junto con los payment plan milestones (migración 017); ya no existe en el detalle

### 7.13 Listado de comunidades

1. Usuario navega a `/communities` (requiere migración 008 + seed ejecutados)
2. `communities/page.tsx` (server) llama a `getCommunities(locale)` con el Supabase server client
3. `getCommunities` hace `select("*, community_translations(*)")` filtrando `is_active = true`; resuelve la traducción con fallback locale → 'en' → primera; ordena con `localeCompare(locale)`
4. `CommunitiesGrid` (client) renderiza el input de búsqueda y las cards; filtra por nombre, ciudad, location y tags con `useState`/`useMemo`
5. Sin resultados muestra `t("communities.no_results")`
6. `CommunityCard` linkea a `/community/{slug}` (via `@/i18n/navigation`)

### 7.14 Detalle de comunidad

1. Usuario navega a `/community/[slug]`
2. `community/[slug]/page.tsx` (server) llama a `getCommunityBySlug(slug, locale)` con `.maybeSingle()`; si no existe o está inactiva → `notFound()`
3. Descripción HTML se pasa por `sanitizeHtml()` antes de `dangerouslySetInnerHTML` (solo si hay descripción)
4. `CommunityHeader` muestra imagen destacada (placeholder con nombre si no hay) + iframe del mapa si `google_map_url` pasó la validación de host/path
5. `CommunityInfoCard` (sticky, server) muestra `average_price_range` y CTA "See properties"
6. Galería con `CommunityGallery` (lightbox con keyboard nav, scroll lock) solo si hay imágenes

### 7.15 Página pública de developer (creación/edición del owner)

1. Usuario con rol `developer` autenticado accede a `/app/developer`
2. `app/app/developer/page.tsx` (server) verifica sesión y rol; carga `getMyDeveloper(user.id)` (row en `developers` por `user_profile_id`) + `getCitiesByCountry(operating_country)`
3. `DeveloperForm` (client): si no existe row → modo "Create Profile" (prefill de website/email/phone desde `user_profiles`); si existe → modo "Save Changes" (sin prefill de campos nullables)
4. Slug autogenerado desde Company Name (read-only) + botón copy de la URL pública
5. Descripción editada con `RichTextEditor` (TipTap): toolbar Bold/Italic/H3/listas/blockquote/imagen; la imagen se sube a `developer-images/{userId}/description/` y se inserta como `<img>` (botón deshabilitado durante upload)
6. Save llama a `saveDeveloperProfile` (server action en `lib/actions.ts`): valida server-side (website auto-prefija `https://`, slug regex `^[a-z0-9-]+$`, límites de longitud, on_time_completion 0–100), sanitiza con `sanitizeUserHtml()` y hace INSERT o UPDATE en `developers` (RLS del owner)
7. `router.refresh()`; la página pública (`/developer/[slug]`) solo muestra rows con `is_verified = true`

### 7.16 Render de la descripción del developer/broker (pública)

1. Detalle `/developer/[slug]` o `/broker/[slug]` (server): `getDeveloperBySlug`/`getBrokerBySlug` filtra `is_verified = true`; `notFound()` si no existe
2. `DeveloperDescription`/`BrokerDescription` detecta si el texto es HTML (`isHtmlText`) → sanitiza con `sanitizeUserHtml()` y renderiza con `dangerouslySetInnerHTML` (clase `.rich-description` en globals.css)
3. Si es texto plano legacy con `**bold**` → `splitBold()` de `lib/rich-text.tsx` split y render con `<strong>` (misma visual)
4. En el listado de developer (`DeveloperCard`, `DevelopersGrid`) se usa `stripHtmlToText()` para mostrar y filtrar texto sin tags

### 7.17 Creación/edición del perfil de broker (plataforma)

1. Usuario con rol `broker` autenticado accede a `/app/broker`
2. `app/app/broker/page.tsx` (server) verifica sesión y rol; carga `getMyBroker(user.id)` + `getCitiesByCountry(operating_country)` + `getCountryCode`/`getCountryLabel`
3. `BrokerForm` (client): si no existe row → modo "Create Profile" (prefill de email/phone desde `user_profiles`, name desde `company_name`); si existe → modo "Save Changes"
4. Slug autogenerado desde Name (read-only) + botón copy de la URL pública (`/broker/{slug}`)
5. Descripción editada con `RichTextEditor` (TipTap, bucket `broker-images`): toolbar Bold/Italic/H3/listas/blockquote/imagen
6. Profile image subida a `broker-images/{userId}/profile/` via `ImageUpload`
7. Save llama a `saveBrokerProfile` (server action en `lib/actions.ts`): valida server-side (slug regex, límites, personal_url auto-prefija `https://`, closed_transactions 0–100000, ORN máx 64 chars), sanitiza con `sanitizeUserHtml()` y hace INSERT o UPDATE en `broker_profiles` (RLS del owner)
8. Sección "Credentials" del form: RERA Broker Card / ID (bucket `broker-images/rera`), QR Code (bucket `broker-images/qr`, con preview destacada de la imagen del QR), Agency ORN (texto) y checkbox "I confirm these details are up to date"; los 4 campos se incluyen en el payload y en el `hasChanges`
9. `router.refresh()`; la página pública solo muestra rows con `is_verified = true`
10. Si `is_verified = false` se muestra banner amarillo "Pending verification" en el form

### 7.18 Página pública del broker

1. Usuario navega a `/broker/[slug]` (accesible desde el link en PropertySidebar cuando `listed_by_type = 'broker'`)
2. `broker/[slug]/page.tsx` (server): `getBrokerBySlug(slug)` filtra `is_verified = true`; `notFound()` si no existe
3. Query a `properties` contando y listando las últimas 5 propiedades activas del broker (`listed_by_id = broker.userProfileId AND listed_by_type = 'broker'`)
4. `BrokerHeader` muestra: imagen de perfil (placeholder con inicial si no hay), nombre, link a URL personal (validado con `safeUrl`), stats (active properties, closed transactions), botones Email/WhatsApp
5. Si hay descripción: sección "About {name}" con `BrokerDescription` (HTML sanitizado + fallback `**bold**`)
6. Si hay propiedades: sección "Active Properties" con link "View all" + grid de las últimas 5 `PropertyCard`
7. Todos los textos usan namespace `broker_detail` traducido a 7 locales

### 7.19 Listado de propiedades del usuario (dashboard)

1. Usuario autenticado accede a `/app/properties`
2. `properties/page.tsx` (server): verifica sesión, llama a `getMyProperties(user.id)` (todas las propiedades del usuario, incluyendo inactivas)
3. `PropertyList` (server) renderiza tabla HTML con 7 columnas: Property (title + type), Status (badge con color), Price, Location (city · community), Specs (beds/baths/sqft), Created, Actions (link Edit)
4. Si no hay propiedades: empty state con CTA "Create your first property"
5. Botón "Create Property" en el header enlaza a `/app/properties/new`

### 7.20 Creación de propiedad (dashboard)

1. Usuario accede a `/app/properties/new`
2. `new/page.tsx` (server): verifica sesión, carga profile + cities (por operating_country) + amenities + subcategories + developments (solo si es developer), resuelve `ownDeveloperName` (si rol developer) + `PageHeader` con back a `/app/properties`
3. `PropertyForm` (client) orquestador de estado con 8 secciones: Basic Information, Location, Property Details (Details + Pricing), Development Details, Tags, Amenities, Images, Visibility (ver 7.22 para el detalle de cada sección)
4. Save llama a `saveProperty` (server action): validación server-side completa, slug auto-generado desde título, ownership check vía listed_by_id
5. Redirige a `/app/properties` (listado)

### 7.21 Edición de propiedad (dashboard)

1. Usuario accede a `/app/properties/[id]/edit` (desde el botón Edit en PropertyList)
2. `[id]/edit/page.tsx` (server): verifica sesión, carga property vía `getMyProperty(user.id, id)` (ownership check) + datos de referencia, resuelve `ownDeveloperName` + `PageHeader` con back a `/app/properties`
3. Si la propiedad no existe o no pertenece al usuario: redirect a `/app/properties`
4. `PropertyForm` (client) en modo edición: pre-carga todos los campos desde `PropertyData`
5. Botón Save deshabilitado hasta que `hasChanges` detecte modificaciones
6. Botón Delete disponible: `AlertDialog` de confirmación → `deleteProperty(property.id)` → redirect al listado

### 7.22 PropertyForm arquitectura (componentizada)

El archivo principal `property-form.tsx` es un **orquestador de estado** (~482 líneas); cada sección vive en `components/platform/property-form/` como sub-componente controlado (recibe value/onChange por props):

1. **Basic Information** (`basic-information-section.tsx`): title (auto-genera slug), slug (read-only + copy URL), description (textarea), subcategory (select grouped), status (select)
2. **Location** (`location-section.tsx`): country (read-only, from user profile), city (select from cities table), community (text), address (text)
3. **Property Details** (`property-details-section.tsx`, incluye Details + Pricing): bedrooms, bathrooms, floor, area sqft (auto-calc sqm), area sqm, price, currency (AED/USD/EUR/GBP), deposit % (auto-calc amount), deposit amount, handover date, post handover checkbox
4. **Development Details** (`development-details-section.tsx`, incluye la sección "Links" fusionada): development (texto libre), development_area (área total), development_id (dropdown solo para rol developer, de su propio developer), developer (texto, read-only auto-completado con `ownDeveloperName` para rol developer, editable para broker/private_seller)
5. **Tags** (`tags-section.tsx`): text input + Enter to add, chips with delete
6. **Amenities** (`amenities-section.tsx`): toggle chips grouped by category, loaded from `property_amenities` table
7. **Images** (`images-section.tsx`): cover image via ImageUpload (bucket `property-images`), gallery images upload (max 10, grid preview with delete)
8. **Visibility** (`visibility-section.tsx`): is_active checkbox + botones full-width apilados (Save/Create + Cancel en new a `/app/properties`; Delete en edit con `AlertDialog` de confirmación)

**State management**: `useState` por campo individual (no form library). Auto-cálculos: sqft→sqm (×0.092903), deposit%→amount (×price/100). `hasChanges` compara snapshot del property vs. estado actual para habilitar Save.

**Save flow**: `saveProperty` retorna `{ id, error }` → `router.refresh()` + redirect a listado (solo en creación).

**Delete flow**: `AlertDialog` de confirmación → `deleteProperty(property.id)` → redirect a listado. (Reemplazó el `confirm()` nativo.)

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
- **Sitio en inglés forzado:** `defaultLocale: "en"` y `localePrefix: "never"`; ningún locale en la URL. No usar geo-detección ni cookie `NEXT_LOCALE`. Los otros locales quedan dormidos en routing (archivos de mensajes intactos)
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
- **Tipos de propiedad:** `PropertyStatus`, `PropertyCurrency` definidos en `lib/types.ts`, alineados con CHECK constraints de BD (⚠️ `PropertyType` eliminado con la columna `property_type`, migración 016)
- **Interfaces de dominio:** `Developer`, `Development` en `lib/types.ts` — reflejan tablas de BD 1:1. ⚠️ `PaymentPlanMilestone` eliminada (migración 017)
- **PropertyData:** interfaz flat con campos joined (`developer_name`, `developer_logo`, `city`, `community`, `developer`, `development`, `development_area`, `development_name`, `development_total_area`, etc.) — no usar objetos anidados
- **user_profiles:** tabla unica para todos los roles; campos condicionales se llenan en onboarding
- **Auth forms:** login-form, sign-up-form, forgot-password-form, update-password-form usan `useTranslations("auth.*")` para i18n; emailRedirectTo y redirectTo apuntan sin prefijo de locale (el `useLocale()` devuelve `en` y el middleware/tipos resuelven el resto)
- **Component organization:** componentes en directorios por dominio (`site/`, `properties/`, `auth/`, `shared/`, `platform/`, `communities/`, `developers/`, `developments/`); `ui/` solo primitivas shadcn
- **Auth namespace:** `auth` en `messages/{locale}.json` con secciones: login, sign_up, forgot_password, update_password, back_to_home
- **Comunidades:** tipo `Community` e interfaz de data access en `lib/communities.ts` (no en `lib/types.ts`); funciones async con Supabase server client y fallback de traducción locale → 'en' → primera (DEFAULT_LOCALE = "en" desde 02-sep-2026)
- **HTML curado:** descripciones de communities se renderizan con `dangerouslySetInnerHTML` SIEMPRE pasando antes por `sanitizeHtml()` de `lib/sanitize-html.ts`
- **HTML user-generated:** descripciones de developers (TipTap) se sanitizan con `sanitizeUserHtml()` de `lib/sanitize-html.ts` — en el form (cliente) y en la server action (servidor) antes de persistir, y en render con `dangerouslySetInnerHTML`; las imágenes solo apuntan al origin de Supabase Storage
- **Descripciones de developers:** legacy `**bold**` sigue soportado en render; al editar se convierte a HTML (`toEditorHtml`); resúmenes de card y búsqueda usan `stripHtmlToText()` de `lib/utils.ts`
- **Server actions:** vivir en `lib/actions.ts` (módulo separado) — no mezclar exports de client con módulos que importan `next/headers` (Next arrastra `lib/supabase/server.ts` al bundle cliente)
- **URLs de mapas:** validar con el patrón de `lib/communities.ts` (host google.com/maps + path `/maps/`) antes de usarlas en iframes; usar `sandbox` y `referrerPolicy="no-referrer"` en el iframe
- **Contenido de communities:** se muestra en inglés en todos los locales (traducción base guardada en locale 'ae'); para traducir, insertar fila en `community_translations`, no hardcodear en mensajes. ⚠️ Inconsistencia potencial: el code default (`DEFAULT_LOCALE = "en"`) no coincide con las filas base (locale 'ae'); como no existen filas 'en', el fallback cae a primera disponible ('ae') y se muestra en inglés. Para alinear, habría que actualizar el seed a locale 'en'
- **Migraciones Supabase:** numeradas secuencialmente (`014_...`); triggers updated_at con `DROP TRIGGER IF EXISTS` para idempotencia; seed en `supabase/seed/` con upserts (`ON CONFLICT`)
- **Forms de profile:** importar `slugify` y `toEditorHtml` de `lib/utils.ts`; usar `RichTextEditor` con prop `bucket` para dirigir uploads al bucket correcto
- **Descripciones rich-text:** importar `splitBold` de `lib/rich-text.tsx` (necesita JSX); usar clase CSS `.rich-description` para renders de HTML de usuarios
- **Bucket de storage:** pasar como prop a `ImageUpload` y `RichTextEditor` (default `developer-images`; broker usa `broker-images`)
- **Broker profiles:** accesibles solo desde property detail pages (no listing page); `is_verified` controla visibilidad pública; `closed_transactions` auto-declarado
- **Property management:** forms de creación/edición en `/app/properties/*`; data access en `lib/properties.ts` con JOINs (developers, broker_profiles, user_profiles, developments); server actions con ownership checks (`listed_by_id = user.id`); PropertyForm es orquestador de estado con sub-componentes en `property-form/` (patrón controlado: estado en el padre, value/onChange por props); auto-cálculos de sqft↔sqm y deposit%→amount; `PageHeader` con back en new/edit
- **Milestones de pago:** ⚠️ ELIMINADO (migración 017): tabla `payment_plan_milestones` y server action `saveMilestones` eliminados; `MilestonesEditor` ya no existe en el código
- **Dashboard tables:** PropertyList usa HTML table nativa (no @tanstack/react-table); SimpleList es suficiente para listados del usuario sin sorting/pagination/drag-drop
- **Traducciones de forms:** namespace `property_form` en los 7 locales; todos los labels y mensajes del form de propiedades traducidos
- **Tailwind primary.DEFAULT:** agregado para que clases de utilidad como `bg-primary`, `text-primary`, `border-primary` resuelvan correctamente
- **PropertyForm componentes:** sub-componentes en `components/platform/property-form/` como `FormSection`, `BasicInformationSection`, `LocationSection`, `PropertyDetailsSection`, `DevelopmentDetailsSection`, `TagsSection`, `AmenitiesSection`, `ImagesSection`, `VisibilitySection`; el padre maneja el estado y pasa value/onChange; ordén de secciones: Basic → Location → Details → Development → Tags → Amenities → Images → Visibility
- **Development Details:** `development`, `development_area`, `developer` son campos flat en `properties`; para rol developer, `developer` se auto-completa desde `developers.name` (prop `ownDeveloperName`); para broker/private_seller es texto libre editable; el vínculo a developers vía `developer_id` lo resuelve el server en ambas ramas INSERT y UPDATE
- **Botones de actions:** full-width apilados (`w-full space-y-3`); Cancel solo en modo create (redirige a `/app` o `/app/properties`); Delete solo en properties (usa `AlertDialog` de `ui/alert-dialog.tsx`); broker y developer NO tienen Delete
- **PageHeader:** `ui/page-header.tsx` con `backHref` opcional; solo usado en `/app/properties/new` y `/app/properties/[id]/edit`; broker/developer no lo usan (decisión del usuario)
- **AlertDialog para Delete:** en vez de `confirm()` nativo, se usa `AlertDialog` de `radix-ui` (patrón shadcn como `sheet.tsx`) en `visibility-section.tsx`
- **Planes/pricing:** usar `lib/plans.ts` (catálogo de tiers por perfil, mock sin Stripe) para `getPlansForRole`/`getPlan`/`getMaxProperties`; NO usar `lib/pricing-plans.ts` (role × país, sin uso en código). El mock de `/auth/payment` (payment-page.tsx) muestra los tiers; la implementación real con Stripe sigue `docs/STRIPE-PLANS.md`
- **Credenciales de broker:** viven en `broker_profiles` (migración 022): `rera_card_url`, `qr_code_url` (imágenes en el bucket `broker-images` carpetas `rera/` y `qr/`), `agency_orn` (texto, máx 64 chars validado en `saveBrokerProfile`) y `details_confirmed` (booleano). Tanto el onboarding como el broker-form los capturan; incluir estos campos en cualquier payload/actualización de broker
