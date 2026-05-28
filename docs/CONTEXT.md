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

- [x] Homepage con hero, features, about, FAQ, contacto, footer
- [x] Navbar responsive con menú mobile
- [x] HeroHeader con búsqueda y dropdowns de filtro (categoría, precio, estado)
- [x] Sección FAQ con accordion
- [x] Banner de contacto
- [x] Footer con links de navegación, redes sociales, copyright
- [x] Sistema i18n con 7 locales y geo-detección
- [x] Auth completo: login, signup, forgot/reset password, update password
- [x] Protección de rutas autenticadas via middleware
- [x] CurrencySwitcher en navbar con persistencia en cookie (NEXT_CURRENCY)
- [x] Sistema de moneda: formato por locale + mapa locale→moneda por defecto
- [x] Página de listado de propiedades (estructura + cards + filtros + cambio de moneda en vivo)
- [x] Sistema de conversión de moneda (exchange-rates fijas para MVP)
- [x] Hook compartido useClickOutside para dropdowns
- [x] PropertyCard server component con traducciones y CurrencyPrice integrado
- [x] Barra de filtros completa (Location, Category, Price Range, Status, + More Filters, Map View)
- [x] BackToHome botón reutilizable
- [ ] Página de detalle de propiedad
- [ ] Página de listado de desarrollos
- [ ] Página de listado de promotoras
- [ ] Página de listado de comunidades
- [ ] Dashboard de usuario (favoritos, consultas)
- [ ] Panel de administración para promotoras
- [ ] Mapa global con unidades geolocalizadas
- [ ] Migrar formularios de auth a traducciones (actualmente hardcodeados en inglés)
- [ ] Reemplazar componentes de tutorial de Supabase starter kit

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
| lucide-react | 0.511.0 | Iconos |
| ESLint | 9 | Linter |
| eslint-config-next | 15.3.1 | Config ESLint para Next.js |
| PostCSS | 8 | Procesador CSS |
| pnpm | — | Package manager |

## 4. ESQUEMA DE BASE DE DATOS

No hay esquema definido aún. El proyecto usa Supabase solo para auth (tablas gestionadas por Supabase: `auth.users`, `auth.sessions`, etc.). No hay tablas propias ni migraciones creadas.

⚠️ **Pendiente:** Definir tablas de `properties`, `developers`, `developments`, `communities`, `favorites`, `inquiries`.

## 5. ESTRUCTURA DE ARCHIVOS

```
offplaninternational/
├── AGENTS.md                          # Instrucciones para agentes de opencode
├── proxy.ts                           # Middleware combinado (i18n + geo + auth)
├── next.config.ts                     # Next config con plugin next-intl
├── tailwind.config.ts                 # Tailwind config custom (spacing, colors, fonts)
├── tsconfig.json                      # TypeScript config
├── package.json                       # Dependencias
├── pnpm-lock.yaml
├── .env.example                       # Variables de entorno de ejemplo
├── app/
│   ├── layout.tsx                     # Root layout (fonts Host Grotesk + Roboto)
│   ├── globals.css                    # CSS variables, Tailwind base
│   └── [locale]/
│       ├── layout.tsx                 # NextIntlClientProvider wrapper
│       ├── page.tsx                   # Homepage (composición de componentes)
│       ├── auth/
│       │   ├── login/page.tsx         # Página de login
│       │   ├── sign-up/page.tsx       # Página de registro
│       │   ├── sign-up-success/page.tsx
│       │   ├── forgot-password/page.tsx
│       │   ├── update-password/page.tsx
│       │   ├── confirm/route.ts       # Callback de confirmación de email
│       │   └── error/page.tsx
│       ├── properties/
│       │   └── properties-list/
│       │       └── page.tsx           # Listado de propiedades con filtros + cards
│       └── protected/
│           ├── layout.tsx
│           └── page.tsx               # Página protegida (tutorial de starter kit)
├── components/
│   ├── back-to-home.tsx               # Botón reutilizable con flecha ← y label (client)
│   ├── currency-price.tsx             # Precio con conversión en vivo via useCurrency (client)
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
│   ├── ui/                            # Componentes base (shadcn-style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── badge.tsx
│   └── tutorial/                      # Componentes del starter kit (a reemplazar)
│       ├── code-block.tsx
│       ├── connect-supabase-steps.tsx
│       ├── fetch-data-steps.tsx
│       ├── sign-up-user-steps.tsx
│       └── tutorial-step.tsx
├── i18n/
│   ├── routing.ts                     # Config de locales y routing (next-intl)
│   ├── request.ts                     # Carga de mensajes por locale
│   └── navigation.ts                  # Helpers Link, redirect, usePathname, useRouter
├── messages/                          # Traducciones por locale
│   ├── ae.json (default)
│   ├── ar.json
│   ├── br.json
│   ├── es.json
│   ├── gb.json
│   ├── mx.json
│   └── pt.json
├── hooks/
│   └── use-click-outside.ts           # Hook compartido para cerrar dropdowns con click outside
├── lib/
│   ├── currency.ts                    # Tipos, monedas disponibles, formatPrice, mapa locale→moneda
│   ├── currency-server.ts             # Lectura de cookie de moneda desde server components
│   ├── exchange-rates.ts              # Tasas fijas + convertPrice() para MVP
│   ├── filter-options.ts              # Opciones de filtros (location, category, price, status, etc.)
│   ├── mock-properties.ts             # Mock data de propiedades (3 unidades)
│   ├── utils.ts                       # cn() helper, hasEnvVars
│   └── supabase/
│       ├── client.ts                  # Cliente Supabase browser
│       ├── server.ts                  # Cliente Supabase server
│       └── middleware.ts              # Auth middleware con locale-aware redirects
├── public/
│   └── images/                        # Assets del sitio
└── .opencode/
    ├── agents/
    │   ├── reviewer.md                # Agente revisor de código
    │   ├── security.md                # Agente de seguridad
    │   └── docwriter.md               # Agente de documentación
    └── package.json
```

## 6. DECISIONES TÉCNICAS TOMADAS

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-05-21 | next-intl v4 con `localePrefix: "as-needed"` | El locale default (ae) no aparece en URL, evitando redirects innecesarios para EAU que es el mercado principal |
| 2026-05-21 | `proxy.ts` en lugar de `middleware.ts` | Next.js 16 cambió el API de middleware; proxy combina locale routing + geo + auth en un solo lugar |
| 2026-05-21 | Geo-detección por headers CDN (Vercel/Cloudflare/AWS) | Sin costo adicional, sin dependencias externas; en local se usa default locale |
| 2026-05-21 | `getUser()` en vez de `getClaims()` para verificar sesión | El JWT puede estar expirado aunque los claims se decodifiquen; getUser() hace verificación contra Supabase |
| 2026-05-21 | Navegación i18n: `Link` y `redirect` desde `@/i18n/navigation` | next-intl requiere estos wrappers para resolver paths con/sin prefijo de locale |
| 2026-05-21 | Confirm route usa `redirect` de `next/navigation` (no de i18n) | Es un callback de Supabase sin locale prefix; el middleware de next-intl lo resuelve automáticamente |
| 2026-05-21 | Custom spacing scale (0-10 mapeado a 4px-80px) | Diseño custom que no se alinea con la escala default de Tailwind |
| 2026-05-21 | CSS variables para colores + Tailwind extendido | Permite consistencia entre globals.css y las clases de utilidad |
| 2026-05-27 | CurrencyContext + cookie `NEXT_CURRENCY` para moneda seleccionada | Evita depender solo del locale; el usuario puede elegir AED/USD/EUR/GBP y persiste 30 días |
| 2026-05-27 | `CurrencyProvider` envuelve al árbol cliente desde `[locale]/layout.tsx` | La moneda debe estar disponible en componentes cliente (navbar, prices, etc.) sin prop drilling |
| 2026-05-27 | `formatPrice()` usa `Intl.NumberFormat` con locale específico por moneda | Formato correcto según cada moneda (€1.000 vs $1,000 vs AED 1,000) sin librería externa |
| 2026-05-27 | CurrencyPrice como client component separado | Permite reactividad en la conversión de moneda sin convertir toda la card a client |
| 2026-05-27 | `exchange-rates.ts` con tasas fijas (no API externa) | Simplifica el MVP; evita latencia, costos y dependencia de servicios externos |
| 2026-05-27 | `useClickOutside` como hook compartido en `hooks/` | Elimina duplicación de lógica en hero-header, currency-switcher y property-filters |
| 2026-05-27 | Datos de filtros extraídos a `lib/filter-options.ts` | Centraliza opciones para mantener consistencia y facilitar cambios sin tocar componentes |
| 2026-05-27 | `CurrencyProvider` default cambiado a USD (global, no por locale) | Consistencia: todos los usuarios ven USD por defecto independientemente del locale |
| 2026-05-27 | `currency-server.ts` importa desde `next/headers` | Función async requerida para leer cookies server-side en Next.js 16 |

## 7. FLUJOS PRINCIPALES

### 7.1 Detección de locale + geo-redirect

1. Usuario llega a `/` sin locale prefix
2. `proxy.ts` revisa cookie `NEXT_LOCALE`
3. Si existe cookie → redirige a `/{locale}` (si no es default) o pasa a next-intl middleware
4. Si no existe cookie → lee headers `x-vercel-ip-country`, `cloudfront-viewer-country`, `cf-ipcountry`
5. Si país detectado tiene locale mapeado y no es default → redirige a `/{locale}` y setea cookie por 30 días
6. Sino → next-intl middleware sirve el default locale (ae)

### 7.2 Registro de usuario

1. Usuario completa formulario en `/auth/sign-up`
2. `sign-up-form.tsx` llama a `supabase.auth.signUp()` con email + password
3. Supabase envía email de confirmación con redirect a `/auth/confirm`
4. Tras confirmar, usuario es redirigido a `/protected`
5. Si hay error, se muestra en el formulario

### 7.3 Login

1. Usuario completa formulario en `/auth/login`
2. `login-form.tsx` llama a `supabase.auth.signInWithPassword()`
3. Si éxito → redirige a `/protected`
4. Si error → se muestra mensaje en el formulario

### 7.4 Recuperación de contraseña

1. Usuario solicita reset en `/auth/forgot-password`
2. `forgot-password-form.tsx` llama a `supabase.auth.resetPasswordForEmail()`
3. Email con link a `/auth/update-password`
4. Usuario ingresa nueva contraseña y se actualiza via `supabase.auth.updateUser()`
5. Redirige a `/protected`

### 7.5 Protección de rutas

1. `proxy.ts` deriva peticiones a rutas `/auth/*` y `/protected/*` a `updateSession()` en `middleware.ts`
2. `updateSession()` verifica sesión via `supabase.auth.getUser()`
3. Si no hay usuario y la ruta es protegida → redirige a `/auth/login`
4. Si hay usuario pero no debería acceder a ciertas rutas auth → redirige (no implementado aún)

### 7.6 Cambio de moneda

1. Usuario ve el botón con símbolo + código de moneda actual en la navbar (ej: "$ USD")
2. Al hacer clic, se abre dropdown con las 4 monedas disponibles (AED, USD, EUR, GBP)
3. Al seleccionar una moneda, `CurrencyContext.setCurrency()` escribe cookie `NEXT_CURRENCY` por 30 días y actualiza el estado global
4. Todos los componentes que usen `useCurrency()` se re-renderizan con la nueva moneda (CurrencySwitcher, CurrencyPrice en cada property card, etc.)
5. En server components, `getCurrencyFromCookies(cookieStore, locale)` resuelve la moneda desde la cookie con fallback al default del locale
6. Mapa locale→moneda default: ae→AED, ar→USD, br→USD, es→EUR, gb→GBP, mx→USD, pt→EUR

### 7.7 Búsqueda en homepage

1. Usuario ingresa texto en campo de búsqueda y/o selecciona filtros (categoría, precio, estado)
2. Los filtros son client-side (estado local con useState)
3. No hay action de búsqueda implementada aún — los dropdowns y el input existen pero no disparan navegación ni API call

⚠️ **Inconsistencia:** La búsqueda en hero-header tiene UI completa pero no ejecuta ninguna acción al buscar o seleccionar filtros.

### 7.8 Listado de propiedades

1. Usuario navega a `/properties-list` (ruta sin locale prefix; el middleware resuelve el locale)
2. La página renderiza un layout con Navbar, BackToHome, heading "All Properties", PropertyFilters, grid de PropertyCards y Footer
3. PropertyFilters es un client component con dropdowns individuales (location, category, price range, status)
4. Cada dropdown usa `useClickOutside()` para cerrarse al hacer clic fuera
5. "+ More Filters" expande una fila secundaria con Beds, Baths, Developer, Amenities
6. "Map View" es un botón a la derecha (sin funcionalidad por ahora)
7. PropertyCard es un server component async que usa `getTranslations("properties")`
8. Cada card muestra: imagen, categoría (badge), camas/baños/área, precio via CurrencyPrice, ubicación con MapPin, logo del developer, descripción, botones Contact y WhatsApp
9. CurrencyPrice es un client component que usa `useCurrency()` del context y llama a `convertPrice()` + `formatPrice()` para mostrar el precio en la moneda activa
10. Los datos actualmente provienen de `lib/mock-properties.ts` (3 propiedades mockeadas)
11. Al cambiar la moneda global, todas las cards se actualizan en vivo sin recargar la página

## 8. VARIABLES DE ENTORNO

| Variable | Ámbito | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pública | API key pública (anon key) de Supabase |

No hay otras variables de entorno definidas actualmente.

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
