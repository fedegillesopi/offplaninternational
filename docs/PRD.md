# Off Plan International — Product Requirements Document

**Cliente:** Off Plan International
**Proyecto:** Plataforma global de listing de propiedades Off-Plan
**Versión:** 1.2 — 22-Jul-2026
**Estado:** MVP en desarrollo — Sistema de 3 roles y onboarding implementado

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
| Dashboard unificado con sidebar basado en role (Developer/Broker/Private Seller) | Todos | ✅ Implementado |
| Pricing plans configurados por role × país (`lib/pricing-plans.ts`) | Todos | ✅ Implementado |
| Legacy route redirects (`/login` → `/auth/login`, `/signup` → `/auth/sign-up/developer`) | Auth | ✅ Implementado |
| Fix middleware: `updateSession()` antes de `intlMiddleware()` en auth routes | Auth | ✅ Implementado |
| Página de listado de desarrollos `/development/[slug]` | Público | ❌ Pendiente |
| Página de listado de promotoras `/developer/[slug]` | Público | ❌ Pendiente |
| Página de listado de comunidades | Público | ❌ Pendiente |
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
- Tras login exitoso → redirige a `/dashboard` (standalone, sin locale prefix)

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
- Cada PropertyCard muestra: imagen, categoría (badge), camas/baños/área, precio via CurrencyPrice, ubicación con MapPin, logo del developer, descripción, botones Contact y WhatsApp
- Datos mockeados en `lib/mock-properties.ts` (3 unidades)
- Conversión de moneda en vivo al cambiar moneda global

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

### 6.2 Auth unificado y onboarding (3 roles)

#### 6.2.1 Registro por role (URL-driven)
- **Ruta base:** `/[locale]/auth/sign-up/[role]` — cada role tiene su propia URL
- **Tabs de role:** El componente `sign-up-form.tsx` renderiza 3 tabs (Developer, Broker, Private Seller). Al hacer clic en un tab, navega a `/auth/sign-up/{role}` usando `router.push()`. No hay tabs internos — cada tab es una URL distinta.
- **Lectura del role:** `SignUpForm` lee el role de `useParams()` (`params.role`). El form inicializa `activeTab` con el role de la URL.
- **Formulario:** full name, email, password, repeat password (común a los 3 roles)
- **Submit:** `supabase.auth.signUp()` con `options.data.role = activeTab` y `full_name`. El role se guarda en `raw_user_meta_data` de Supabase.
- **Redirect post-signup:** `/auth/sign-up-success` (email de confirmación pendiente)
- **Redirect legacy:** `/[locale]/auth/sign-up` (sin role) redirige a `/auth/sign-up/developer`
- **Componente:** `components/sign-up-form.tsx` (client, hardcodeado en inglés)
- **Página:** `app/[locale]/auth/sign-up/[role]/page.tsx` — layout split con imagen a la izquierda (lg) y formulario a la derecha

#### 6.2.2 Login unificado
- **Ruta:** `/[locale]/auth/login` — formulario con email y password
- **Componente:** `components/login-form.tsx` (client, usa `Link` y `useRouter` de `@/i18n/navigation`)
- **Submit:** `supabase.auth.signInWithPassword()` → redirect a `/dashboard`
- **Link a registro:** `/auth/sign-up` (redirige a `/auth/sign-up/developer`)
- **Link a forgot password:** `/auth/forgot-password`
- **Legacy route:** `(auth)/login/page.tsx` redirige a `/auth/login`

#### 6.2.3 Onboarding post-confirmación
- **Ruta:** `/[locale]/auth/onboarding/[role]`
- **Trigger:** El `confirm route handler` (`app/[locale]/auth/confirm/route.ts`) lee `user_profiles.role` y `user_profiles.profile_completed` tras verificar el OTP. Si `profile_completed === false`, redirige a `/auth/onboarding/{role}`. Si `profile_completed === true`, redirige a `/dashboard`.
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
- **Ruta:** `/dashboard` (sin locale prefix, sin i18n)
- **Protección:** `dashboard/layout.tsx` verifica sesión vía `supabase.auth.getUser()`. Sin sesión → redirect a `/login`.
- **Datos del perfil:** Query a `user_profiles` selectando `full_name`, `email`, `role`. Si no hay `role` → redirect a `/login`.
- **Sidebar:** `AppSidebar` recibe `{ name, email, avatar, role }`. El sidebar renderiza navegación diferente según `role`.
- **SidebarProvider** con `SiteHeader` y contenido

#### 6.3.2 Sidebar por role (`app-sidebar.tsx`)
- **Developer:** Dashboard (`/dashboard`), Properties (`/dashboard/properties`), Analytics (`/dashboard/analytics`)
- **Broker:** Dashboard (`/dashboard`), Listings (`/dashboard/listings`), Clients (`/dashboard/clients`)
- **Private Seller:** Dashboard (`/dashboard`), My Property (`/dashboard/my-property`)
- **Común a todos:** Settings (`/dashboard/settings`) en NavSecondary
- **NavUser:** Dropdown con avatar, nombre, email y botón de logout

#### 6.3.3 Dashboard page
- Saludo personalizado con `profile.email`
- SectionCards: 4 cards con métricas mockeadas (Revenue, Customers, Accounts, Growth)
- ⚠️ Las sub-rutas del sidebar (properties, analytics, listings, clients, my-property) están definidas en la navegación pero las páginas aún no existen

#### 6.3.4 Legacy route redirects
- `app/(auth)/login/page.tsx` → redirect a `/auth/login`
- `app/(auth)/signup/page.tsx` → redirect a `/auth/sign-up/developer`
- Estas rutas existen para compatibilidad con URLs legadas

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
| Base de datos | Supabase (PostgreSQL) | Auth + tabla user_profiles |
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
- `set_updated_at_user_profiles`: actualiza `updated_at` automáticamente en cada UPDATE
- `handle_new_user()`: al crear un usuario en `auth.users`, inserta automáticamente un registro en `user_profiles` con `id`, `email`, `role` (desde `raw_user_meta_data->>'role'`, default 'developer') y campos vacíos

**Migración de datos:** La migración 002 migra registros existentes de `developer_profiles` → `user_profiles` con `role = 'developer'` y `profile_completed` basado en si `company_name` no está vacío. La tabla `developer_profiles` se mantiene intacta (no se elimina).

#### 7.2.3 Tabla legacy: developer_profiles
Creada via migración `001_developer_profiles.sql`. Se mantiene por retrocompatibilidad pero `user_profiles` es la tabla principal.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid (PK, FK → auth.users) | ID del usuario |
| full_name | text (not null) | Nombre completo |
| company_name | text (not null) | Nombre de la empresa |
| operating_country | text (not null) | Código ISO 2 letras |
| email | text (not null) | Email del usuario |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Fecha de última actualización |

#### 7.2.4 Interfaz TypeScript: UserProfile
Definida en `lib/types.ts`:

```typescript
type UserRole = "developer" | "broker" | "private_seller";

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
```

#### 7.2.5 Tablas pendientes de crear
- `properties` — unidades individuales (precio, depósito, plan de pago, fecha entrega, ubicación, imágenes)
- `developers` — información detallada de promotoras (logo, descripción, contacto, redes)
- `developments` — proyectos/desarrollos (nombre, ubicación, amenities, fecha entrega estimada)
- `communities` — comunidades/zonas
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
| `/dashboard` | Autenticado | Dashboard unificado con sidebar según role |
| `/dashboard/settings` | Autenticado | Configuración (placeholder en sidebar) |
| `/dashboard/properties` | Developer | Gestión de propiedades (pendiente) |
| `/dashboard/analytics` | Developer | Analytics (pendiente) |
| `/dashboard/listings` | Broker | Listings (pendiente) |
| `/dashboard/clients` | Broker | Clientes (pendiente) |
| `/dashboard/my-property` | Private Seller | Mi propiedad (pendiente) |

### 7.4 Seguridad y acceso

- **Autenticación:** Supabase Auth con sesiones gestionadas por cookies
- **Middleware unificado:** `proxy.ts` combina:
  - next-intl locale routing (público)
  - Geo-detección (público)
  - Auth middleware para rutas protegidas y dashboard
- **Fix auth routes:** En `proxy.ts`, las rutas de auth ejecutan `updateSession()` antes de `intlMiddleware()` para resolver el locale correctamente antes de redirigir
- **Protección del dashboard:** `updateSession()` en `lib/supabase/middleware.ts` verifica sesión en `/dashboard/*`. Si no hay usuario, redirige a `/login`. Si hay usuario en `/login` o `/signup`, redirige a `/dashboard`.
- **Protección del sitio público:** `updateSession()` también protege `/[locale]/protected` y `/[locale]/auth/*` (excepto rutas públicas como login, sign-up, forgot-password, etc.)
- **Onboarding gate:** El confirm route handler lee `user_profiles.profile_completed`. Si es `false`, redirige a `/auth/onboarding/{role}` en lugar de `/dashboard`.
- **Verificación de sesión:** `getUser()` server-side (no `getClaims()`) — el JWT puede estar expirado aunque los claims se decodifiquen
- **Variables de entorno:** `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **RLS en user_profiles:** cada usuario solo puede leer/escribir su propio perfil
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
2. Ve 3 tabs (Developer, Broker, Private Seller) — el tab activo corresponde a la URL
3. Si cambia de tab, navega a /auth/sign-up/{nuevo-role} (URL cambia)
4. Completa formulario: full name, email, password, repeat password
5. Submit → supabase.auth.signUp() con options.data.role = activeTab
6. Trigger handle_new_user() crea registro en user_profiles con role, email y campos vacíos
7. Redirige a /auth/sign-up-success (email de confirmación pendiente)
8. Usuario confirma email → /[locale]/auth/confirm route handler
```

**Servicios consumidos:** Supabase Auth, user_profiles (trigger)

### Flujo C: Onboarding post-confirmación

```
1. Confirm route handler verifica OTP con supabase.auth.verifyOtp()
2. Lee user_profiles.role y user_profiles.profile_completed
3. Si profile_completed === false → redirect a /auth/onboarding/{role}
4. Si profile_completed === true → redirect a /dashboard
5. Onboarding page muestra formulario con campos condicionales:
   - Developer: company name*, company website, operating country*, phone*
   - Broker: company name*, company website, operating country*, license number*, phone*
   - Private Seller: country of residence*, phone*
6. Submit → actualiza user_profiles con campos + profile_completed = true
7. Redirige a /dashboard
```

**Servicios consumidos:** Supabase Auth (verifyOtp), user_profiles (select + update)

### Flujo D: Login de vendedor

```
1. Usuario navega a /auth/login (o /login que redirige aquí)
2. Completa formulario con email y password
3. Submit → supabase.auth.signInWithPassword()
4. Si éxito → redirige a /dashboard
5. Dashboard layout: getUser() → user_profiles query (full_name, email, role)
6. AppSidebar renderiza navegación según role
7. Dashboard page muestra SectionCards con datos mockeados
8. Si error → mensaje en el formulario
9. Si usuario ya autenticado visita /login o /signup → middleware redirige a /dashboard
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
1. Dashboard layout carga perfil de user_profiles (incluye role)
2. Pasa { name, email, avatar, role } a AppSidebar
3. AppSidebar selecciona navegación de NAV_BY_ROLE[role]:
   - Developer: Dashboard, Properties, Analytics
   - Broker: Dashboard, Listings, Clients
   - Private Seller: Dashboard, My Property
4. NavSecondary muestra Settings (común a todos)
5. NavUser muestra avatar, nombre, email y botón de logout
```

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
14. **El middleware de auth para el dashboard es independiente del i18n.** Las rutas `/dashboard`, `/login` y `/signup` no tienen locale prefix y no pasan por next-intl.
15. **El confirm route handler ejecuta `updateSession()` antes de verificar el OTP**, permitiendo leer el perfil del usuario recién creado.
16. **Los pricing plans están configurados pero no se aplican.** Son referencia para futura implementación de planes pagos.
17. **El role se almacena en dos lugares:** `raw_user_meta_data` de Supabase Auth (al registrarse) y `user_profiles.role` (tabla propia). El confirm route handler y el dashboard layout leen de `user_profiles`.

---

## 10. SUPUESTOS Y RESTRICCIONES

**Supuestos:**
- Los inversores tienen acceso a internet y usan navegador web
- Los vendedores (developers, brokers, private sellers) tienen capacidad técnica para listar sus unidades (o reciben asistencia)
- El mercado Off-Plan es suficientemente grande como para justificar una plataforma global
- Los inversores están dispuestos a contactar a vendedores directamente sin agente de por medio
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
- Las rutas `/development/[slug]` y `/developer/[slug]` no existen
- Sin dashboard de inversor (favoritos, consultas)
- Los botones de contacto (WhatsApp, Phone) no ejecutan acciones reales
- El dashboard y su tabla de datos usan datos de relleno (no son propiedades reales)
- Las sub-rutas del sidebar del dashboard (properties, analytics, listings, clients, my-property) no tienen páginas implementadas
- Los pricing plans están configurados pero no se cobran ni se aplican
- Auth hardcodeado en inglés (sin traducciones i18n en formularios de auth)

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

### 🔜 Siguientes pasos
- **Corto plazo:** Implementar páginas del sidebar: `/dashboard/properties`, `/dashboard/analytics` (Developer), `/dashboard/listings`, `/dashboard/clients` (Broker), `/dashboard/my-property` (Private Seller)
- **Corto plazo:** Crear rutas `/development/[slug]` y `/developer/[slug]` — actualmente dan 404 al navegar desde el detalle de propiedad
- **Corto plazo:** Conectar la búsqueda de homepage a resultados reales (navegación a `/properties-list` con query params)
- **Corto plazo:** Implementar envío real de consultas Contact y WhatsApp (conectar a backend/Supabase)
- **Corto plazo:** Conectar datos de propiedades a Supabase (reemplazar mock data con queries reales)
- **Corto plazo:** Migrar formularios de auth a traducciones (actualmente hardcodeados en inglés)
- **Corto plazo:** Implementar página `/dashboard/settings`
- **Mediano plazo:** Dashboard de inversor (favoritos, consultas)
- **Mediano plazo:** Páginas de listado de comunidades
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
