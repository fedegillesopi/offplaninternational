# Off Plan International — Product Requirements Document

**Cliente:** Off Plan International
**Proyecto:** Plataforma global de listing de propiedades Off-Plan
**Versión:** 1.1 — 04-Jun-2026
**Estado:** MVP en desarrollo — Dashboard de developer completado

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
2. **Plataforma de developers** (rutas standalone): dashboard, auth de developers, gestión de propiedades y métricas. Sin i18n (inglés por ahora).

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
| Auth inversor (login, signup, forgot/reset password, update password, confirm email) | Público | ✅ Implementado |
| Auth developer (login y signup standalone) | Developer | ✅ Implementado |
| Tabla `developer_profiles` en Supabase con RLS y trigger automático | Developer | ✅ Implementado |
| Dashboard de developer con sidebar, métricas (SectionCards) y tabla de datos (DataTable) | Developer | ✅ Implementado |
| Sidebar con navegación (Dashboard, Settings) y avatar de usuario | Developer | ✅ Implementado |
| Logout desde el dashboard | Developer | ✅ Implementado |
| Protección de rutas del dashboard (middleware redirige a /login si no hay sesión) | Developer | ✅ Implementado |
| Página de listado de desarrollos `/development/[slug]` | Público | ❌ Pendiente |
| Página de listado de promotoras `/developer/[slug]` | Público | ❌ Pendiente |
| Página de listado de comunidades | Público | ❌ Pendiente |
| Dashboard de inversor (favoritos, consultas) | Público | ❌ Pendiente |
| Panel de administración completo para promotoras | Developer | ❌ Pendiente |
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

El sistema funciona como un **marketplace bilateral** con dos caras:

**Cara pública (inversores):**
- Las promotoras listan unidades individuales con datos financieros completos
- Los inversores buscan, filtran y contactan directamente a las promotoras
- No hay intermediarios ni comisiones por venta
- El modelo de ingresos futuro son planes premium de visibilidad para promotoras

**Cara privada (developers):**
- Los developers se registran y acceden a un dashboard
- El dashboard muestra métricas de sus propiedades y permite gestionar listings
- La tabla `developer_profiles` se crea automáticamente al registrarse vía trigger de Supabase

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
**Perfil:** Empresa desarrolladora que construye y vende propiedades Off-Plan. Se registra con datos de empresa y país de operación.

**Motivación inmediata:** Acceder al dashboard, visualizar métricas y gestionar propiedades.

**Motivación diferida:** Panel de administración completo, estadísticas de consultas, gestión de inventario de unidades.

**Acciones en el sistema:**
- Registrarse con email, empresa y país de operación
- Iniciar sesión y acceder al dashboard
- Ver métricas de propiedades (SectionCards)
- Gestionar propiedades en tabla de datos (DataTable reordenable)
- Cerrar sesión

**Restricciones:**
- No puede ver propiedades de otras promotoras (solo las propias)
- No tiene acceso al sitio público como inversor con la misma cuenta

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

#### 6.1.3 Auth inversor (bajo `/[locale]/auth/`)
- Método: email/password
- Flujos: registro, login, forgot password, reset password, update password
- Confirmación de email obligatoria
- Rutas protegidas via middleware: `proxy.ts` combina i18n + geo + auth
- `getUser()` server-side para verificar sesión (no `getClaims()`)
- Sin distinción de roles en MVP
- Tras login exitoso → redirige a `/[locale]/protected`

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

### 6.2 Plataforma de developers (rutas standalone)

#### 6.2.1 Auth developer
- **Login:** `/login` — formulario con email y password, redirect a `/dashboard` tras éxito. Sin i18n (inglés).
- **Signup:** `/signup` — formulario con company name, operating country, email y password. Tras crear usuario en Supabase Auth, actualiza `developer_profiles` con company_name y operating_country. Redirect a `/dashboard`.
- La tabla `developer_profiles` se crea automáticamente para cada nuevo usuario vía trigger `on_auth_user_created` en Supabase.
- Middleware protege `/dashboard` redirigiendo a `/login` si no hay sesión activa.
- Middleware redirige a `/dashboard` si un usuario autenticado visita `/login` o `/signup`.

#### 6.2.2 Dashboard de developer
- **Layout:** SidebarProvider con AppSidebar, SiteHeader y contenido. Protegido: verifica sesión vía `supabase.auth.getUser()`. Si no hay sesión, redirige a `/login`.
- **AppSidebar:** Sidebar colapsable con logo, navegación principal (Dashboard), navegación secundaria (Settings), y NavUser con avatar, nombre, email y logout.
- **Dashboard page:** Saludo personalizado con `profile.email`, SectionCards (métricas), y DataTable con datos mockeados desde `data.json`.
- **SectionCards:** 4 cards que muestran: Total Revenue ($1,250), New Customers (1,234), Active Accounts (45,678), Growth Rate (4.5%). Cada una con badge de tendencia (up/down) y descripción. Datos mockeados (placeholder).
- **DataTable:** Tabla interactiva con 68 filas de datos mockeados. Funcionalidades:
  - Reordenación drag & drop (dnd-kit)
  - Selección múltiple con checkbox
  - Columnas: Header, Section Type, Status, Target, Limit, Reviewer
  - Filtro por búsqueda de texto
  - Paginación
  - Edición inline de Target y Limit
  - Column visibility toggle
  - Viewer drawer al hacer clic en una fila (con gráfico de área)
  - Toolbar con acciones (Delete, Edit, etc.)
- **NavUser:** Dropdown con avatar, nombre, email y botón de "Log out". Al cerrar sesión, redirige a `/login`.

---

## 7. ARQUITECTURA DEL SISTEMA

### 7.1 Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | Next.js 16.2.6 (App Router) | SSR, Server Components, Server Actions |
| Lenguaje | TypeScript ~5 | Strict mode |
| Base de datos | Supabase (PostgreSQL) | Auth + tabla developer_profiles |
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

#### 7.2.2 Tabla propia: developer_profiles
Creada via migración `001_developer_profiles.sql`.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid (PK, FK → auth.users) | ID del usuario, se crea en cascada al eliminar |
| full_name | text (not null) | Nombre completo del developer (default '') |
| company_name | text (not null) | Nombre de la empresa (default '', se completa en onboarding) |
| operating_country | text (not null) | Código ISO 2 letras: 'AE', 'PT', 'MX', etc. (default '', se completa en onboarding) |
| email | text (not null) | Email del usuario |
| created_at | timestamptz (default now()) | Fecha de creación |
| updated_at | timestamptz (default now()) | Fecha de última actualización |

**Políticas RLS:**
- SELECT: solo el propio usuario puede leer su perfil (`auth.uid() = id`)
- INSERT: solo el propio usuario puede insertar su perfil (`auth.uid() = id`)
- UPDATE: solo el propio usuario puede actualizar su perfil (`auth.uid() = id`)

**Triggers:**
- `set_updated_at`: actualiza `updated_at` automáticamente en cada UPDATE
- `on_auth_user_created`: al crear un usuario en `auth.users`, inserta automáticamente un registro en `developer_profiles` con `id`, `email` y campos vacíos

#### 7.2.3 Tablas pendientes de crear
- `properties` — unidades individuales (precio, depósito, plan de pago, fecha entrega, ubicación, imágenes)
- `developers` — información detallada de promotoras (logo, descripción, contacto, redes)
- `developments` — proyectos/desarrollos (nombre, ubicación, amenities, fecha entrega estimada)
- `communities` — comunidades/zonas
- `favorites` — favoritos del inversor
- `inquiries` — consultas de inversores a promotoras

### 7.3 Estructura de rutas

#### Sitio público (con i18n)

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Homepage |
| `/[locale]` | Público | Homepage con locale |
| `/[locale]/properties-list` | Público | Listado de propiedades con filtros |
| `/[locale]/property/[slug]` | Público | Detalle de propiedad |
| `/[locale]/auth/login` | Público | Login inversor |
| `/[locale]/auth/sign-up` | Público | Registro inversor |
| `/[locale]/auth/forgot-password` | Público | Reset de contraseña |
| `/[locale]/auth/update-password` | Público | Actualizar contraseña |
| `/[locale]/auth/confirm` | Público | Callback de confirmación email |
| `/[locale]/auth/error` | Público | Error de autenticación |
| `/[locale]/auth/sign-up-success` | Público | Éxito de registro |
| `/[locale]/protected` | Autenticado | Página protegida inversor (placeholder) |

#### Plataforma de developers (sin i18n)

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Público | Login developer |
| `/signup` | Público | Registro developer |
| `/dashboard` | Autenticado | Dashboard de developer con sidebar, métricas y tabla |
| `/dashboard/settings` | Autenticado | Configuración de developer (placeholder en sidebar) |

### 7.4 Seguridad y acceso

- **Autenticación:** Supabase Auth con sesiones gestionadas por cookies
- **Middleware unificado:** `proxy.ts` combina:
  - next-intl locale routing (público)
  - Geo-detección (público)
  - Auth middleware para rutas protegidas y dashboard
- **Protección del dashboard:** `updateSession()` en `lib/supabase/middleware.ts` verifica sesión en `/dashboard/*`. Si no hay usuario, redirige a `/login`. Si hay usuario en `/login` o `/signup`, redirige a `/dashboard`.
- **Protección del sitio público:** `updateSession()` también protege `/[locale]/protected` y `/[locale]/auth/*` (excepto rutas públicas como login, sign-up, forgot-password, etc.)
- **Verificación de sesión:** `getUser()` server-side (no `getClaims()`) — el JWT puede estar expirado aunque los claims se decodifiquen
- **Variables de entorno:** `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **RLS en developer_profiles:** cada usuario solo puede leer/escribir su propio perfil

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

### Flujo B: Developer se registra y accede al dashboard

```
1. Developer navega a /signup
2. Completa formulario: company name, operating country, email, password
3. Submit → supabase.auth.signUp() crea usuario en auth.users
4. Trigger on_auth_user_created inserta registro en developer_profiles (id, email, campos vacíos)
5. Client actualiza developer_profiles: company_name, operating_country
6. Redirige a /dashboard
7. Dashboard layout verifica sesión vía getUser()
8. Sidebar muestra nombre y email del perfil
9. Dashboard page muestra SectionCards y DataTable con datos mockeados
10. Developer puede hacer drag & drop en la tabla, filtrar, paginar, editar inline
11. Developer puede cerrar sesión desde NavUser → redirige a /login
```

**Servicios consumidos:** Supabase Auth, developer_profiles (RLS), SectionCards (mock), DataTable (mock)

### Flujo C: Login de developer

```
1. Developer navega a /login
2. Completa formulario con email y password
3. Submit → supabase.auth.signInWithPassword()
4. Si éxito → redirige a /dashboard
5. Dashboard layout: getUser() → developer_profiles query → sidebar con nombre
6. Si error → mensaje en el formulario
7. Si developer ya autenticado visita /login → middleware redirige a /dashboard
```

**Servicios consumidos:** Supabase Auth

### Flujo D: Cambio de moneda (sitio público)

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
9. **No hay distinción de roles en el sitio público en MVP.** Todos los usuarios autenticados tienen el mismo acceso.
10. **Solo email/password en MVP.** Sin OAuth social.
11. **Usar `getUser()` en vez de `getClaims()`** para verificar sesión server-side (el JWT puede estar expirado aunque los claims se decodifiquen).
12. **El dashboard de developer y sus componentes (SectionCards, DataTable) usan datos mockeados.** Son placeholder visual.
13. **El sistema tiene dos flujos de auth separados:** inversores (`/[locale]/auth/*`) y developers (`/login`, `/signup`). Cada uno redirige a su dashboard correspondiente.
14. **La tabla `developer_profiles` se crea automáticamente al registrarse** vía trigger de Supabase. El onboarding (company_name, operating_country) se completa desde el formulario de signup.
15. **El middleware de auth para el dashboard es independiente del i18n.** Las rutas `/dashboard`, `/login` y `/signup` no tienen locale prefix y no pasan por next-intl.

---

## 10. SUPUESTOS Y RESTRICCIONES

**Supuestos:**
- Los inversores tienen acceso a internet y usan navegador web
- Las promotoras tienen capacidad técnica para listar sus unidades (o reciben asistencia)
- El mercado Off-Plan es suficientemente grande como para justificar una plataforma global
- Los inversores están dispuestos a contactar a promotoras directamente sin agente de por medio
- El locale/idioma se puede inferir por geolocalización del país de origen
- Los developers necesitan un dashboard separado del sitio público

**Restricciones:**
- Datos mockeados para MVP — sin base de datos propia de propiedades
- Sin mapa funcional en MVP (pendiente geolocalización)
- Sin pagos integrados en la plataforma
- Sin comparador de propiedades
- Sin app nativa mobile
- Solo email/password en auth
- Tasas de cambio fijas, no automáticas
- Sin modo offline
- Sin distinción de roles de usuario en MVP (sitio público)
- Las rutas `/development/[slug]` y `/developer/[slug]` no existen
- Sin dashboard de inversor (favoritos, consultas)
- Los botones de contacto (WhatsApp, Phone) no ejecutan acciones reales
- El dashboard de developer y su tabla de datos usan datos de relleno (no son propiedades reales)
- Sin panel de administración completo para promotoras

---

## 11. ROADMAP EVOLUTIVO

### ✅ Completado
- Homepage completa con hero, features, about, FAQ, contacto, footer
- Sistema i18n completo con 7 locales, geo-detección y routing as-needed
- Auth completo (inversor y developer) con todos los flujos
- CurrencySwitcher con persistencia y conversión en vivo
- Listado de propiedades con filtros avanzados
- Página de detalle de propiedad con gallery, sidebar, details-table, amenities-grid (modal + scroll lock), payment-plan, tags, breadcrumb, related-properties
- Traducciones `property_detail` en 7 locales
- Interfaz `PropertyData` compartida en `lib/types.ts`
- Datos mockeados (3 propiedades) para todas las secciones
- Tabla `developer_profiles` en Supabase con RLS y triggers
- Dashboard de developer con sidebar, SectionCards y DataTable reordenable
- Auth developer: login y signup standalone con redirect a dashboard
- Middleware combinado (i18n + geo + auth + dashboard protection)

### 🔜 Siguientes pasos
- **Corto plazo:** Crear rutas `/development/[slug]` y `/developer/[slug]` — actualmente dan 404 al navegar desde el detalle de propiedad
- **Corto plazo:** Conectar la búsqueda de homepage a resultados reales (navegación a `/properties-list` con query params)
- **Corto plazo:** Implementar envío real de consultas Contact y WhatsApp (conectar a backend/Supabase)
- **Corto plazo:** Conectar datos de propiedades a Supabase (reemplazar mock data con queries reales)
- **Corto plazo:** Reemplazar componentes de tutorial del starter kit de Supabase
- **Corto plazo:** Migrar formularios de auth del sitio público a traducciones (actualmente hardcodeados en inglés)
- **Mediano plazo:** Dashboard de inversor (favoritos, consultas)
- **Mediano plazo:** Páginas de listado de comunidades
- **Mediano plazo:** Panel de administración completo para promotoras (gestión de propiedades, consultas)
- **Mediano plazo:** Mapa global con unidades geolocalizadas
- **Mediano plazo:** Conectar DataTable del dashboard a datos reales de propiedades
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
| SectionCards | Componente de tarjetas de métricas en el dashboard de developer |
| DataTable | Tabla interactiva con drag & drop, filtros, paginación y edición inline |
| Developer Profiles | Tabla de perfiles de promotora con RLS, creada automáticamente al registrarse |
