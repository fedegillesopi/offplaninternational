# CONTEXT — Off Plan International

## 1. DESCRIPCIÓN DEL PRODUCTO

**Off Plan International** es una plataforma global de listing de propiedades Off-Plan. Permite a inversores buscar, comparar y contactar directamente con promotoras verificadas, sin intermediarios ni presión comercial.

**Problema que resuelve:** Comprar propiedades Off-Plan es confuso, lento y manejado por agentes de ventas con información parcial. No existe un lugar único donde se listen unidades individuales con datos financieros completos.

**Usuarios:**
- **Inversor/comprador:** busca unidades Off-Plan filtradas por depósito, plan de pago, tamaño, ubicación, fecha de entrega y promotora.
- **Promotora (developer):** lista unidades individuales y recibe consultas directas sin coste de intermediarios.

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

### Auth + Dashboard (nuevo)
- [x] Auth simplificado en `(auth)/login` y `(auth)/signup` (sin i18n, hardcodeado en inglés)
- [x] Dashboard en `app/dashboard/` con sidebar shadcn
- [x] Data table completa con drag-and-drop, paginación, sorting, column visibility
- [x] Section cards con métricas mock
- [x] `developer_profiles` table en Supabase con migración 001
- [x] Creación automática de perfil al registrarse (trigger en auth.users)
- [x] Protección de rutas dashboard via middleware

### Pendiente
- [ ] Página de listado de desarrollos
- [ ] Página de listado de promotoras
- [ ] Página de listado de comunidades
- [ ] Panel de administración para promotoras
- [ ] Mapa global con unidades geolocalizadas
- [ ] Migrar formularios de auth a traducciones (actualmente hardcodeados en inglés)
- [ ] Reemplazar componentes de tutorial de Supabase starter kit
- [ ] Dashboard de favoritos y consultas del usuario
- [ ] `app/dashboard/settings` page (ruta definida en sidebar pero sin página implementada)

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

### developer_profiles

Creada por migración `supabase/migrations/001_developer_profiles.sql`.

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | uuid | PK, references auth.users(id) ON DELETE CASCADE | UUID del usuario auth |
| full_name | text | NOT NULL | Nombre completo (vacio al crear, se completa en onboarding) |
| company_name | text | NOT NULL | Nombre de la empresa (vacio al crear) |
| operating_country | text | NOT NULL | Código ISO 2 letras: 'AE', 'PT', 'MX', etc. (vacio al crear) |
| email | text | NOT NULL | Email del usuario |
| created_at | timestamptz | DEFAULT now() | Fecha de creación |
| updated_at | timestamptz | DEFAULT now() | Fecha de actualización |

**Triggers:**
- `set_updated_at`: actualiza `updated_at` automáticamente en cada UPDATE
- `on_auth_user_created`: inserta perfil con valores vacíos al crear usuario en `auth.users`

**Políticas RLS:**
- SELECT: solo propio perfil (`auth.uid() = id`)
- INSERT: solo propio perfil
- UPDATE: solo propio perfil

**Función helper:**
- `public.update_updated_at_column()`: setea `updated_at = now()`
- `public.handle_new_user()`: inserta registro en developer_profiles al crearse un auth.users

### Tablas de Supabase (gestionadas por Supabase)
- `auth.users`, `auth.sessions`, `auth.mfa_factors`, etc. — auth estándar de Supabase

### ⚠️ Pendiente
Definir tablas de `properties`, `developers`, `developments`, `communities`, `favorites`, `inquiries`.

## 5. ESTRUCTURA DE ARCHIVOS

```
offplaninternational/
├── AGENTS.md                          # Instrucciones para agentes de opencode
├── proxy.ts                           # Middleware combinado (i18n + geo + auth)
├── next.config.ts                     # Next config con plugin next-intl
├── tailwind.config.ts                 # Tailwind config custom (spacing, colors, fonts, container-queries)
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencias
├── pnpm-lock.yaml
├── .env.example                       # Variables de entorno de ejemplo
├── app/
│   ├── layout.tsx                     # Root layout (fonts Host Grotesk + Roboto)
│   ├── globals.css                    # CSS variables, Tailwind base, sidebar vars
│   ├── (auth)/                        # Route group auth (sin i18n)
│   │   ├── login/page.tsx             # Login form (client, hardcodeado inglés)
│   │   └── signup/page.tsx            # Signup form (client, hardcodeado inglés)
│   ├── dashboard/                     # Dashboard (sin i18n, requiere auth)
│   │   ├── layout.tsx                 # Layout con sidebar + header + auth guard
│   │   ├── page.tsx                   # Página principal dashboard
│   │   └── data.json                  # Mock data para data table (68 registros)
│   └── [locale]/
│       ├── layout.tsx                 # NextIntlClientProvider + CurrencyProvider wrapper
│       ├── page.tsx                   # Homepage (composición de componentes)
│       ├── auth/                      # Auth con i18n
│       │   ├── login/page.tsx
│       │   ├── sign-up/page.tsx
│       │   ├── sign-up-success/page.tsx
│       │   ├── forgot-password/page.tsx
│       │   ├── update-password/page.tsx
│       │   ├── confirm/route.ts       # Callback de confirmación de email
│       │   └── error/page.tsx
│       ├── properties/
│       │   └── properties-list/
│       │       └── page.tsx           # Listado de propiedades con filtros + cards
│       ├── property/
│       │   └── [slug]/
│       │       └── page.tsx           # Detalle de propiedad
│       └── protected/                 # Ruta protegida (tutorial starter kit)
│           ├── layout.tsx
│           └── page.tsx
├── components/
│   ├── app-sidebar.tsx                # Sidebar del dashboard (shadcn)
│   ├── nav-main.tsx                   # Navegación principal sidebar (client)
│   ├── nav-secondary.tsx              # Navegación secundaria sidebar (client)
│   ├── nav-user.tsx                   # Dropdown de usuario + logout en sidebar (client)
│   ├── site-header.tsx                # Header del dashboard con sidebar trigger
│   ├── section-cards.tsx              # Grid de 4 cards con métricas
│   ├── data-table.tsx                 # Data table completa (tanstack + dnd-kit + recharts)
│   ├── back-to-home.tsx               # Botón reutilizable con flecha (client)
│   ├── breadcrumb.tsx                 # Breadcrumb con separador "/" y links i18n
│   ├── currency-price.tsx             # Precio con conversión en vivo (client)
│   ├── currency-provider.tsx          # Context provider de moneda (client)
│   ├── currency-switcher.tsx          # Dropdown de selección de moneda (client)
│   ├── navbar.tsx                     # Navbar responsive (client)
│   ├── hero-header.tsx                # Hero con búsqueda + filtros (client)
│   ├── features-section.tsx           # Sección de características
│   ├── about-section.tsx              # Sección "sobre nosotros"
│   ├── faq-section.tsx                # FAQ con accordion items
│   ├── accordion-item.tsx             # Componente accordion (client)
│   ├── contact-banner.tsx             # Banner de contacto
│   ├── footer.tsx                     # Footer (server, async)
│   ├── auth-button.tsx                # Botón auth contextual (server)
│   ├── logout-button.tsx              # Cerrar sesión (client)
│   ├── login-form.tsx                 # Formulario login (client)
│   ├── sign-up-form.tsx               # Formulario registro (client)
│   ├── forgot-password-form.tsx       # Formulario reset password (client)
│   ├── update-password-form.tsx       # Formulario actualizar password (client)
│   ├── property-card.tsx              # Card de propiedad horizontal (server, async)
│   ├── property-filters.tsx           # Barra de filtros completa (client)
│   ├── property-gallery.tsx           # Galería de imágenes (client)
│   ├── property-sidebar.tsx           # Sidebar con precio + botones (server)
│   ├── property-details-table.tsx     # Tabla de detalles (server)
│   ├── property-amenities-grid.tsx    # Grid de amenities con modal (client)
│   ├── property-payment-plan.tsx      # Tabla de plan de pago (server)
│   ├── property-tags.tsx              # Tags de propiedad (server)
│   ├── related-properties.tsx         # Sección de propiedades relacionadas (server)
│   ├── ui/                            # Componentes base (shadcn-style + custom)
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx (CardAction incluido)
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx (incluye variant="destructive")
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx (726 líneas, full sidebar con context y cookie)
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toggle.tsx
│   │   ├── toggle-group.tsx
│   │   └── tooltip.tsx
│   └── tutorial/                      # Componentes del starter kit (a reemplazar)
│       ├── code-block.tsx
│       ├── connect-supabase-steps.tsx
│       ├── fetch-data-steps.tsx
│       ├── sign-up-user-steps.tsx
│       ├── tutorial-step.tsx
│       ├── hero.tsx
│       ├── next-logo.tsx
│       ├── supabase-logo.tsx
│       ├── deploy-button.tsx
│       ├── env-var-warning.tsx
│       └── theme-switcher.tsx
├── hooks/
│   ├── use-click-outside.ts           # Hook compartido para cerrar dropdowns
│   └── use-mobile.ts                  # Hook responsive (mobile breakpoint 768px)
├── i18n/
│   ├── routing.ts                     # Config de locales y routing (next-intl)
│   ├── request.ts                     # Carga de mensajes por locale
│   └── navigation.ts                  # Helpers Link, redirect, usePathname, useRouter
├── messages/                          # Traducciones por locale (7 archivos)
│   ├── ae.json (default)
│   ├── ar.json
│   ├── br.json
│   ├── es.json
│   ├── gb.json
│   ├── mx.json
│   └── pt.json
├── supabase/
│   └── migrations/
│       └── 001_developer_profiles.sql  # Migración inicial: tabla, triggers, RLS
├── docs/
│   ├── CONTEXT.md                     # Este archivo
│   └── PRD.md                         # Product Requirements Document (agente analista)
├── lib/
│   ├── currency.ts                    # Tipos, monedas, formatPrice, mapa locale→moneda
│   ├── currency-server.ts             # Lectura de cookie de moneda server-side
│   ├── exchange-rates.ts              # Tasas fijas + convertPrice() para MVP
│   ├── filter-options.ts              # Opciones de filtros centralizadas
│   ├── mock-properties.ts             # Mock data de propiedades (3 unidades)
│   ├── types.ts                       # Interfaz PropertyData
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
| 2026-06-04 | `developer_profiles` con trigger on_auth_user_created | Garantiza que cada usuario registrado tenga su perfil sin lógica extra en cliente |
| 2026-06-04 | RLS en developer_profiles con policy por `auth.uid()` | Seguridad a nivel BD: cada usuario solo ve/edita su propio perfil |
| 2026-06-04 | Middleware maneja dos sistemas de rutas: dashboard/auth y locale | Las rutas dashboard/login/signup van a auth middleware; el resto a i18n + geo + auth |

## 7. FLUJOS PRINCIPALES

### 7.1 Detección de locale + geo-redirect

1. Usuario llega a `/` sin locale prefix
2. `proxy.ts` revisa cookie `NEXT_LOCALE`
3. Si existe cookie y no es default → redirige a `/{locale}`
4. Si no existe cookie → lee headers CDN (`x-vercel-ip-country`, etc.)
5. Si país detectado tiene locale mapeado y no es default → redirige a `/{locale}` y setea cookie por 30 días
6. Sino → next-intl middleware sirve default locale (ae)

### 7.2 Registro de usuario (nuevo sistema `(auth)/signup`)

1. Usuario completa formulario en `/signup`
2. `signup/page.tsx` llama a `supabase.auth.signUp()` con email + password
3. El trigger `on_auth_user_created` inserta automáticamente un perfil vacío en `developer_profiles`
4. Inmediatamente después, la página hace un UPDATE a `developer_profiles` con company_name y operating_country
5. Redirige a `/dashboard`

### 7.3 Login (nuevo sistema `(auth)/login`)

1. Usuario completa formulario en `/login`
2. `login/page.tsx` llama a `supabase.auth.signInWithPassword()`
3. Si éxito → redirige a `/dashboard`
4. Si error → se muestra mensaje en rojo

### 7.4 Protección de rutas (dashboard + auth)

1. `proxy.ts` detecta rutas `/dashboard`, `/login`, `/signup` y las deriva a `updateSession()`
2. `updateSession()` en `lib/supabase/middleware.ts`:
   - Si no hay usuario y ruta es `/dashboard` → redirect a `/login`
   - Si hay usuario y ruta es `/login` o `/signup` → redirect a `/dashboard`
3. El layout de dashboard también verifica sesión server-side con `createClient()` como fallback

### 7.5 Dashboard

1. Usuario autenticado accede a `/dashboard`
2. `dashboard/layout.tsx` verifica sesión, obtiene perfil de `developer_profiles`, renderiza SidebarProvider + AppSidebar + SiteHeader + children
3. `dashboard/page.tsx` muestra:
   - Saludo con email del usuario
   - SectionCards (4 cards con métricas mock: Revenue, New Customers, Active Accounts, Growth Rate)
   - DataTable (tabla con 68 filas mock, drag-and-drop reorder, column visibility, paginación, inline editing)

### 7.6 Registro de usuario (sistema legacy `[locale]/auth/sign-up`)

1. Usuario completa formulario en `/[locale]/auth/sign-up`
2. `sign-up-form.tsx` llama a `supabase.auth.signUp()` con email + password
3. Supabase envía email de confirmación con redirect a `/auth/confirm`
4. Tras confirmar, usuario puede acceder a rutas protegidas

### 7.7 Navegación en sidebar

1. AppSidebar muestra logo, NavMain (Dashboard), NavSecondary (Settings), NavUser (avatar + logout)
2. Sidebar es collapsible tipo "offcanvas" (se superpone al contenido)
3. En mobile, sidebar se abre como Sheet
4. Estado de sidebar persiste en cookie `sidebar_state` por 7 días

### 7.8 Data Table

1. Componente cliente que recibe array de datos con schema zod
2. Usa `@tanstack/react-table` para manejo de estado (sorting, pagination, column visibility, row selection, column filters)
3. Drag-and-drop de filas via `@dnd-kit/sortable` con restricción vertical
4. Tabs para Outlook, Past Performance, Key Personnel, Focus Documents
5. Columna de acciones con menú contextual (Edit, Make a copy, Delete)
6. Edición inline de campos Target y Limit
7. Selector de reviewer con opciones mock
8. Drawer con detalle expandido (header, chart recharts AreaChart, formulario de edición)

### 7.9 Búsqueda en homepage

1. Usuario ingresa texto en campo de búsqueda y/o selecciona filtros (categoría, precio, estado)
2. Los filtros son client-side (estado local con useState)
3. No hay action de búsqueda implementada — los dropdowns y el input existen pero no disparan navegación ni API call

⚠️ **Inconsistencia:** La búsqueda en hero-header tiene UI completa pero no ejecuta ninguna acción al buscar o seleccionar filtros.

### 7.10 Listado de propiedades

1. Usuario navega a `/properties-list` (sin locale prefix; el middleware resuelve el locale)
2. Layout con Navbar, BackToHome, heading "All Properties", PropertyFilters, grid de PropertyCards y Footer
3. PropertyFilters es client component con dropdowns individuales + "+ More Filters" + "Map View"
4. PropertyCard es server component async con traducciones y CurrencyPrice integrado
5. CurrencyPrice usa `useCurrency()` del context y llama a `convertPrice()` + `formatPrice()`
6. Mock data: 3 propiedades en `lib/mock-properties.ts`

### 7.11 Detalle de propiedad

1. Usuario navega a `/[locale]/property/[slug]`
2. Server component async que busca propiedad en mock data por slug
3. Layout con Navbar, Breadcrumb, dos columnas (gallery + sidebar), y secciones inferiores
4. Columna izquierda: PropertyGallery, PropertyDetailsTable, PropertyAmenitiesGrid, PropertyPaymentPlan, PropertyTags, RelatedProperties
5. Columna derecha (sticky): PropertySidebar con precio, links, botones Contact y WhatsApp
6. Todos los textos usan namespace `property_detail` traducido a 7 locales

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
- **Supabase client:** Crear nueva instancia por función en server (no variables globales)
- **Dashboard/sin i18n:** las rutas `(auth)` y `dashboard` no usan next-intl; los componentes son hardcodeados en inglés
- **Sidebar:** usa `SidebarProvider` con cookie `sidebar_state` para persistencia del estado colapsado
