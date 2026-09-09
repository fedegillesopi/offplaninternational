# Development Pages — Guía de implementación

Guía para que usuarios con perfil **developer** puedan crear páginas públicas de
**developments** (`/development/[slug]`), asignarles propiedades, y que ambas
páginas (detalle + listado `/developments`) se sirvan desde la base de datos en
lugar de los mocks actuales.

**Estado: sin implementar.** Este documento es la especificación acordada
(21-May-2026, revisado 08-Sep-2026).

---

## 1. Objetivo y alcance

1. El developer (rol `developer`) puede **crear, editar y eliminar** developments
   desde el dashboard (`/app/developments*`).
2. Cada development tiene su **página pública** `/development/[slug]` servida desde
   Supabase (hoy usa `lib/mock-developments.ts`).
3. El developer puede **asignar sus propiedades** a un development (dropdown ya
   existente en el PropertyForm, `development-details-section.tsx`).
4. El **listado público** `/developments` se conecta a la DB con búsqueda
   (hoy es un array hardcodeado con búsqueda deshabilitada).
5. El filtro por development en el listado de properties (`/properties?development=`)
   queda **fuera de alcance** en esta tarea (pending conocido).

### Decisiones cerradas

| Decisión | Elección |
|----------|----------|
| Origen de datos de la sticky card (price, types, area) | **Manuales en el form** (columnas nuevas) |
| Página pública de un development | **Solo CTA** a properties; sin grid de propiedades dentro de la página |
| Storage de imágenes | **Nuevo bucket `development-images`** (patrón `developer-images`) |
| Listado público `/developments` | **Conectado a DB en esta misma tarea** |

---

## 2. Estado actual del código

### 2.1 Página pública (mock) — `app/[locale]/development/[slug]/page.tsx`

- Importa `mockDevelopments` de `lib/mock-developments.ts` y filtra por slug
  localmente (`getDevelopmentBySlug`, línea 15).
- Layout:
  - `BackToHome` + `Breadcrumb` (líneas 36-47)
  - `DevelopmentHeader` (solo imagen, sin logo)
  - `MapPin` + `location`, `h1` nombre, `about_development`, descripción en `<p>` plano
  - Divisor + `PropertyAmenitiesGrid` (amenities, sin `amenityNames`)
  - Divisor + sección `gallery` con `CommunityGallery`
  - `aside` sticky → `DevelopmentInfoCard` con `startingPrice`,
    `startingPriceCurrency`, `propertyTypes`, `totalArea`, `developerName`,
    `developerSlug`, `developmentSlug`
- Traducciones: namespace `development_detail` (en.json líneas 208-219).

### 2.2 Listado público (mock) — `app/[locale]/developments/page.tsx`

- Array hardcodeado de 2 developments (líneas 8-27).
- `DevelopmentsGrid` local inline con input de búsqueda `disabled` (línea 49).
- Cards con `DevelopmentCard` (`components/site/development-card.tsx`).

### 2.3 Mock data — `lib/mock-developments.ts`

- `DevelopmentDetailData[]`: 2 entries con `id, name, slug, description, image,
  images, amenities, location, startingPrice, startingPriceCurrency,
  propertyTypes, totalArea, developerName, developerSlug, developerLogo`.
- Se **eliminará** al migrar a DB.

### 2.4 Infraestructura de datos (ya existente)

- **Tabla `developments`** (migración `007_...rebuild.sql`, líneas 68-112):
  columnas `id, name, slug UNIQUE, developer_id (FK→developers, NULL),
  description, country, city, community, cover_image, images text[],
  amenities text[], handover_date, is_active DEFAULT true, created_at,
  updated_at` + trigger `updated_at`.
- **RLS actual**: solo `developments_select_public` (`is_active = true`).
  **No existe** insert/update ni select propio.
- `properties.development_id` → FK `developments(id)` `ON DELETE SET NULL`
  (migración 007, líneas 185-188) → eliminar un development no rompe properties.
- Tipos: `Development` y `DevelopmentDetailData` en `lib/types.ts` (líneas 65-81
  y 151-167). `DevelopmentDetailData` está alineada con el mock actual.
- `lib/properties.ts` ya hace JOIN de `developments` (`name, slug, amenities`)
  para resolver `development_name`/`development_slug`/`development_amenities`
  en propiedades (patrón `PropertyRow`).
- `saveProperty` (lib/actions.ts:385-401) ya valida que `development_id` sea de
  un development del mismo developer `is_active = true`.

### 2.5 Patrones a replicar

- **Data access** `lib/developers.ts`: `DeveloperCardData`, `DeveloperDetailData`,
  `toCardData`, `toDetailData`, `getDevelopers`, `getDeveloperBySlug`, `getMyDeveloper`.
- **Server action** `saveDeveloperProfile` (lib/actions.ts:35-105): validaciones,
  sanitización con `sanitizeUserHtml`, upsert por `user_profile_id`.
- **Form** `components/platform/developer-form.tsx` (client): state, slug
  autogenerado con `slugify`, `toEditorHtml`, `RichTextEditor`, `ImageUpload`,
  `handleCopy` de URL, botón guardar con `hasChanges`.
- **Página dashboard** `app/app/developer/page.tsx`: auth → profile → role check
  → `getMyDeveloper` → carga de cities → render de form.
- **Página detalle público** `app/[locale]/developer/[slug]/page.tsx` +
  `DeveloperDescription` (sanitiza HTML con `isHtmlText` + `sanitizeUserHtml`,
  fallback `**bold**` con `splitBold` de `lib/rich-text.tsx`).
- **Listado público con búsqueda** `app/[locale]/developers/page.tsx` +
  `components/developers/developers-grid.tsx`: filtro en memo sobre name + `stripHtmlToText(description)` + slug.
- **Header con logo** `components/developers/developer-header.tsx` (overlay logo).
- **Bucket storage** migración `012_developer_images_bucket.sql`.
- **Imágenes múltiples** `components/platform/property-form/images-section.tsx`
  (cover + gallery hasta 10, subida con `uploadImage`).

---

## 3. Fase 1 — Base de datos (migración `023_development_pages.sql`)

### 3.1 Bucket `development-images`

Clonar `012_developer_images_bucket.sql` cambiando el id por `development-images`:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('development-images', 'development-images', true, 5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp']);

CREATE POLICY "Public can view development images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'development-images');

CREATE POLICY "Authenticated users can upload development images to their own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'development-images'
    AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own development images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'development-images'
    AND (storage.foldername(name))[1] = auth.uid()::text);
```

`uploadImage(file, userId, folder, bucket)` (lib/storage.ts:5) ya acepta el
bucket por parámetro; las carpetas van bajo `{userId}/...`. No hace falta
tocar `lib/storage.ts` salvo el `placeholder` de imagen por defecto.

### 3.2 Columnas nuevas en `developments`

```sql
ALTER TABLE public.developments
  ADD COLUMN starting_price numeric,
  ADD COLUMN starting_price_currency text,
  ADD COLUMN property_types text[],
  ADD COLUMN total_area numeric;

ALTER TABLE public.developments
  ADD CONSTRAINT developments_starting_price_currency_check
  CHECK (starting_price_currency IN ('AED','USD','EUR','GBP'));

CREATE INDEX idx_developments_developer_active
  ON public.developments(developer_id, is_active);
```

### 3.3 RLS para el developer dueño

Patrón `developers` (migración `011_*` / ver `developers_select_own`). El
ownership se resuelve por el JOIN: `developments.developer_id` → `developers.id`
→ `developers.user_profile_id = auth.uid()`.

```sql
CREATE POLICY "developments_select_own"
  ON public.developments FOR SELECT
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "developments_insert_own"
  ON public.developments FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "developments_update_own"
  ON public.developments FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.developers d
      WHERE d.id = developments.developer_id
        AND d.user_profile_id = auth.uid()
    )
  );
```

Notas:
- `developments_select_own` combina activos-públicos + propios; `getMyDevelopments`
  filtra además por `developer_id`, por lo que puede omitirse el `OR is_active`.
  Recomendado: policy separada `developments_select_own` solo con el `EXISTS` y
  dejar `developments_select_public` intacta (evita que el público lea rows que
  edge server no quería exponer).
- Si se desea eliminar: agregar `developments_delete_own` idéntico al update
  (opcional; el plan usa soft deletes vía `is_active`).

---

## 4. Fase 2 — Tipos y data access

### 4.1 `lib/types.ts`

Ampliar `Development` con las columnas nuevas:

```ts
export interface Development {
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
  starting_price: number | null;
  starting_price_currency: PropertyCurrency | null;
  property_types: string[] | null;
  total_area: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

`DevelopmentDetailData` (líneas 151-167) cambiará: eliminar el mock y moverlo a
`lib/developments.ts` como tipo derivado (patrón `DeveloperDetailData`), con
`developerName`/`developerSlug`/`developerLogo` resueltos por JOIN.

Eliminar `lib/mock-developments.ts` y todo `import` residual.

### 4.2 Nuevo `lib/developments.ts`

Estructura espejo de `lib/developers.ts`:

```ts
export interface DevelopmentCardData {
  name: string;
  description: string;
  image: string;      // cover
  logo: string;       // developer logo (JOIN)
  location: string;   // "country, city, community"
  slug: string;
}

export interface DevelopmentDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;        // HTML sanitizable
  image: string;              // cover
  images: string[];           // gallery
  amenities: string[];
  location: string;
  developerName: string;
  developerSlug: string;
  developerLogo: string;
  startingPrice: number;
  startingPriceCurrency: PropertyCurrency;
  propertyTypes: string[];
  totalArea: number;
  community: string;
  handoverDate: string | null;
}
```

Funciones:

- `getDevelopments(): Promise<DevelopmentCardData[]>`
  - `select('developments.*, developers(name, logo_url, slug)')`, `is_active = true`, order by name.
  - `toCardData` resuelve `description` con `stripHtmlToText` si es HTML
    (igual que cards de developer).
- `getDevelopmentBySlug(slug): Promise<DevelopmentDetailData | null>`
  - `maybeSingle()`, `is_active = true`, mismo JOIN.
  - Si algún field nuevo es `null` y la UI lo pide, usar valores default
    (ej. `totalArea ?? 0`, `startingPrice ?? 0`).
- `getMyDevelopments(userProfileId): Promise<Development[]>` → por `developer_id`
  del developer del usuario, order by name (para dashboard y dropdown del form).
- `getMyDevelopment(userProfileId, developmentId): Promise<Development | null>`
  → usada por la página de edit para impedir editar el development de otro.

`PropertyCurrency` ya existe en `lib/types.ts:5`.

---

## 5. Fase 3 — Server actions (`lib/actions.ts`)

### 5.1 `saveDevelopment(payload)`

```ts
export interface SaveDevelopmentPayload {
  id?: string;                    // presente en update/delete
  name: string;
  slug: string;
  description: string;            // HTML user-generated
  country: string;
  city: string;
  community: string;
  cover_image: string | null;
  images: string[];
  amenities: string[];
  property_types: string[];
  starting_price: number | null;
  starting_price_currency: string;
  total_area: number | null;
  handover_date: string | null;
  is_active: boolean;
}
```

Validaciones (patrón `saveDeveloperProfile`, lib/actions.ts:35-105):
- `user` requerido.
- `name` requerido, `<= MAX_NAME` (120).
- `slug` regex `^[a-z0-9-]+$`.
- `description = sanitizeUserHtml(payload.description)`, `<= MAX_DESCRIPTION` (20k).
- `starting_price` ≥ 0 si presente; `starting_price_currency` ∈ `CURRENCIES`
  (constante existente en actions.ts:258).
- `total_area` ≥ 0 si presente.
- `handover_date` formato ISO si presente.
- Arrays: `images` ≤ 10, `amenities` ≤ 30, `property_types` ≤ 10; cada slug
  validated con regex de slugs (seguridad).
- **Ownership**: resolver `developer_id` vía `developers.where(user_profile_id = user.id).maybeSingle()`. Si no hay developer → error "Complete your developer profile first."

Upsert idéntico a `saveDeveloperProfile`:

```ts
if (payload.id) {
  await supabase.from("developments").update(fields)
    .eq("id", payload.id)
    .eq("developer_id", developer_id);
} else {
  await supabase.from("developments")
    .insert({ ...fields, developer_id });
}
```

Nota: el update lleva `.eq("developer_id", developer_id)` como cláusula de
ownership defensiva (además del RLS).

### 5.2 `deleteDevelopment(id)`

Patrón `deleteProperty` (lib/actions.ts:467-489). Resolver developer_id del
usuario y borrar con `.eq("id", id).eq("developer_id", developer_id)`. Las
properties quedan con `development_id = NULL` por el FK `ON DELETE SET NULL`.

---

## 6. Fase 4 — Plataforma (`/app/developments`)

### 6.1 Sidebar — `components/platform/app-sidebar.tsx`

Agregar item al rol developer en `NAV_BY_ROLE` (líneas 31-35):

```ts
developer: [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/developer", label: "Developer Profile", icon: BriefcaseBusiness },
  { href: "/app/developments", label: "Developments", icon: Building },   // nuevo
  { href: "/app/properties", label: "Properties", icon: Building },
],
```

Usar otro ícono de lucide para diferenciar (inline en el literal, ej. `Building2`).

### 6.2 Listado — `app/app/developments/page.tsx`

Patrón `app/app/properties/page.tsx`:
- Auth + redirect si no hay user.
- `getMyDevelopments(user.id)`.
- Header "Developments" + botón "Create Development" → `/app/developments/new`.
- Lista simple (cards o filas) con enlaces a `/app/developments/[id]/edit`
  y estado visible/inactive.

### 6.3 Crear — `app/app/developments/new/page.tsx`

Patrón `app/app/properties/new/page.tsx`:
- Auth + profile + role check (`developer`).
- `getMyDeveloper(user.id)` → si no existe, redirigir a `/app/developer`
  ("Complete your developer profile first").
- Cargar:
  - `getCitiesByCountry(countryCode)`, `getCountryCode/getCountryLabel`
  - `getCommunitiesByCountry(countryCode, "en")`
  - `getPropertyAmenities()`, `getPropertySubcategories()`
- Render `<DevelopmentForm development={null} ... />`.

### 6.4 Editar — `app/app/developments/[id]/edit/page.tsx`

- `getMyDevelopment(user.id, id)` → si null, `redirect("/app/developments")`
  (notFound/redirect para no exponer ids ajenos).
- Misma carga de datos + `<DevelopmentForm development={dev} ... />`.

### 6.5 `components/platform/development-form.tsx`

Client. Props (patrón `developer-form` + `property-form`):

```ts
interface DevelopmentFormProps {
  development: Development | null;
  profile: UserProfile;
  cities: string[];
  countryCode: string;
  countryLabel: string;
  communities: CommunityOption[];
  amenities: PropertyAmenity[];         // groupedAmenities como property-form
  subcategories: PropertySubcategory[]; // para property_types
}
```

State y campos:
- `name` (default: development?.name), `slug = slugify(name)` + botón copy URL
  `https://.../development/{slug}` (patrón developer-form handleCopy).
- `description` con `RichTextEditor` (`defaultValue = toEditorHtml(...)`,
  patrón property-form) — bucket `development-images`.
- `country` read-only (de profile, patrón developer-form).
- `city` NativeSelect + `community` (patrón LocationSection).
- `coverImage` → `ImageUpload` (bucket `development-images`).
- `galleryImages` → `ImagesSection`-like: grid hasta 10, `bucket="development-images"`,
  subida con `uploadImage` (patrón images-section.tsx: handleGalleryFiles).
- `amenities` pills agrupadas por categoría (`groupedAmenities`,
  patrón amenities-section.tsx, bucket no aplica).
- `property_types` pills desde `subcategories` (multi-select).
- `startingPrice` + `startingPriceCurrency` (Select, default AED).
- `totalArea` number.
- `handoverDate` date input.
- `is_active` checkbox (patrón VisibilitySection).
- Botones: Save (disabled sin cambios), en edit Delete con AlertDialog
  (patrón property-form delete + `deleteDevelopment`).
- Guardar → `saveDevelopment`, success → `router.refresh()` + opcional
  `router.push("/app/developments")`.

Reutilizar `FormSection`, `NativeSelect`, `Label`, `Input`, `Button`.
Agrupar amenities con el mismo helper que usa `property-form.tsx`
(ver `groupedAmenities` con useMemo).

---

## 7. Fase 5 — Página pública conectada a DB

### 7.1 `app/[locale]/development/[slug]/page.tsx`

Reemplazar mock por:

```ts
const development = await getDevelopmentBySlug(slug);
if (!development) notFound();
```

- `DevelopmentHeader`: agregar prop `logo` (patrón `DeveloperHeader`).
- Descripción: reemplazar el `<p>` por `DevelopmentDescription`:

```tsx
// components/developments/development-description.tsx
import { sanitizeUserHtml } from "@/lib/sanitize-html";
import { isHtmlText } from "@/lib/utils";
import { splitBold } from "@/lib/rich-text";

export function DevelopmentDescription({ text }: { text: string }) {
  if (isHtmlText(text)) {
    return (
      <div className="rich-description"
        dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(text) }} />
    );
  }
  return (
    <p className="font-body text-base font-light leading-relaxed text-[--text-primary] whitespace-pre-line">
      {splitBold(text)}
    </p>
  );
}
```

(Clonar `developer-description.tsx` ajustando el nombre si se prefiere.)

- `PropertyAmenitiesGrid` con `amenityNames`: `lib/properties.ts` tiene
  `resolveAmenityNames` **local** (no exportada). Opciones:
  a) Exportarla de `lib/properties.ts` y reutilizarla en la página.
  b) Query directa en page: `supabase.from("property_amenities").in("slug", amenities)`.
  El `PropertyAmenitiesGrid` usa fallback `humanizeSlug` si no se pasa
  `amenityNames` (comportamiento actual aceptable, pero names traducibles
  vs. humanizados: resolver las names de `property_amenities`).
- `DevelopmentInfoCard`: agregar props `community` y `handoverDate` (labels
  `community` / `handover_date` en `development_detail`) y ajustar CTA a
  `/properties?development={slug}`.

### 7.2 `components/developments/development-info-card.tsx`

- Nuevos props opcionales: `community?: string`, `handoverDate?: string | null`.
- Mostrar filas extra (divisor + label + valor) antes del divisor del developer.
- Mantener precios con `CurrencyPrice`, types como chips, `totalArea.toLocaleString()`.

### 7.3 `app/[locale]/developments/page.tsx` + `DevelopmentsGrid`

- Usar `getDevelopments()` y un componente client `DevelopmentsGrid`
  (clon de `components/developers/developers-grid.tsx` con
  `DevelopmentCard` en vez de `DeveloperCard`).
- `DevelopmentCard` recibe `description` que ya vendrá como texto plano del row
  (o aplicar `stripHtmlToText` en `toCardData`).
- Traducción: `developments.no_results` — **agregar** en los 7 locales
  (en.json:161 lo tienen communities/developers; developments list solo tiene
  back_to_home/all_developments/search_placeholder, líneas 26-30).

### 7.4 Traducciones — `messages/{locales}.json`

Aplicar en **los 7 locales** (ar, br, en, es, gb, mx, pt):

- `developments`: `+ "no_results": "No developments found"`.
- `development_detail`: agregar keys nuevas de la sticky card
  (`community`, `handover_date`) — mantener las existentes.
- **Nuevo namespace** `development_form` con labels del form
  (name, slug, description, country, city, community, cover, gallery, amenities,
  property_types, starting_price, starting_price_currency, total_area,
  handover_date, is_active, create, edit, delete, save, cancel, confirm_delete).

---

## 8. Fase 6 — Asignación de properties

- Ya está implementado en el PropertyForm:
  - Dropdown `DevelopmentDetailsSection` (cambiar `developmentId`) visible para rol
    developer (líneas 36-51 de development-details-section.tsx).
  - `app/app/properties/new/page.tsx` (líneas 37-55) ya precarga los developments
    del developer. **Opcional**: reemplazar su query inline por
    `getMyDevelopments(user.id)` para centralizar.
  - `saveProperty` valida ownership + `is_active` (lib/actions.ts:385-401).
- `app/[locale]/property/[slug]/page.tsx` ya enlaza `/development/{development_slug}`
  cuando existe (líneas 165-168).
- El CTA "See development properties" del `DevelopmentInfoCard` apunta a
  `/properties?development={slug}`; el filtro en `/properties` se implementará
  en una **tarea aparte** aprovechando el query param.

---

## 9. Verificación / checklist final

1. `pnpm lint` y `pnpm typecheck` (confirmar scripts en package.json; el proyecto
   usa ESLint 9 + eslint-config-next).
2. Migraciones: verificar que `023_development_pages.sql` corre sin error en este
   orden (buckets, columnas, índices, policies con nombre único).
3. RLS: probar select público (anon) solo ve `is_active = true`; select propio
   (auth) con y sin `is_active`.
4. Sin imports residuales de `lib/mock-developments.ts` (`rg`/grep).
5. `DevelopmentDetailData` refactor: ningún tipo colgado en `lib/types.ts`.
6. Página `/development/[slug]`: describir contenido con HTML (TipTap) y con
   texto plano (fallback `**bold**`); verificar `sanitizeUserHtml` en render.
7. Form: upload de cover + gallery a `development-images`, carpetas `{userId}/...`.
8. Guardado: `saveDevelopment` rechaza slug inválido, price < 0, arrays > límites.
9. Editar el development de otro developer → no se carga (getMyDevelopment null).
10. Eliminar un development con properties asignadas → properties quedan con
    `development_id = NULL` y siguen visibles.
11. El dropdown del PropertyForm solo lista developments del developer.
12. Traducciones completas en los 7 locales (eng, ar, br, es, gb, mx, pt).

---

## 10. Referencias de archivos

| Archivo | Rol |
|---------|-----|
| `supabase/migrations/007_...rebuild.sql` | Tabla `developments` + RLS base + FK properties |
| `supabase/migrations/012_developer_images_bucket.sql` | Modelo del bucket nuevo |
| `lib/types.ts` | `Development`, `DevelopmentDetailData`, `PropertyCurrency` |
| `lib/developers.ts` | Patrón de data access a replicar |
| `lib/property-amenities.ts`, `lib/property-subcategories.ts`, `lib/cities.ts`, `lib/communities.ts`, `lib/countries.ts` | Fuentes de selects del form |
| `lib/actions.ts` | `saveDeveloperProfile`, `deleteProperty`, `saveProperty` (asignación) |
| `lib/storage.ts` | `uploadImage` (bucket param) |
| `lib/sanitize-html.ts`, `lib/utils.ts`, `lib/rich-text.tsx` | Sanitización y helpers |
| `components/platform/developer-form.tsx` | Plantilla del form |
| `components/platform/property-form/*` | Sections (location, images, amenities, visibility), `groupedAmenities` |
| `components/platform/image-upload.tsx` | Upload single (cover) |
| `components/developments/*` | `development-header`, `development-info-card` (a extender) |
| `components/developers/*` | `developer-header` (logo overlay), `developer-description`, `developers-grid` |
| `components/site/development-card.tsx` | Card del listado público |
| `app/[locale]/development/[slug]/page.tsx` | Página pública a migrar |
| `app/[locale]/developments/page.tsx` | Listado público a conectar |
| `app/[locale]/developers/page.tsx` + `components/developers/developers-grid.tsx` | Patrón listado + búsqueda |
| `app/app/developer/page.tsx`, `app/app/properties/page.tsx`, `app/app/properties/new/page.tsx` | Patrones dashboard (listar/crear/editar) |
| `components/platform/app-sidebar.tsx` | `NAV_BY_ROLE` |
| `messages/{ar,br,en,es,gb,mx,pt}.json` | Traducciones a ampliar |