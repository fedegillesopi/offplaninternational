# Plan: Upload Properties -- Form de creacion/edicion de propiedades

**Objetivo:** Permitir a developers, brokers y private sellers crear, editar y gestionar sus propiedades desde el dashboard (`/app/properties`).

**Fecha:** 25-Ago-2026

---

## Contexto

Actualmente `/app/properties` es un placeholder (`<h1>Properties</h1>`). No hay form de creacion, ni listado de propiedades del usuario, ni server action para guardar. La tabla `properties` y `payment_plan_milestones` ya existen en la DB con RLS configurado. El bucket `property-images` ya existe.

**Patron a seguir:** Los forms de developer (`developer-form.tsx`) y broker (`broker-form.tsx`) establecen el patron: `"use client"`, `useState` por campo, `hasChanges` dirty check, server action para save, `router.refresh()` en exito.

---

## Archivos a crear/modificar

| # | Archivo | Accion | Descripcion |
|---|---------|--------|-------------|
| 1 | `lib/actions.ts` | Editar | +`saveProperty()` server action |
| 2 | `lib/actions.ts` | Editar | +`deleteProperty()` server action |
| 3 | `lib/actions.ts` | Editar | +`saveMilestones()` server action |
| 4 | `lib/properties.ts` | Editar | +`getMyProperties(userId)` para listado del dashboard |
| 5 | `components/platform/property-form.tsx` | **Crear** | Form de creacion/edicion de propiedad |
| 6 | `components/platform/property-list.tsx` | **Crear** | Listado de propiedades del usuario |
| 7 | `components/platform/milestones-editor.tsx` | **Crear** | Editor dinamico de payment plan milestones |
| 8 | `app/app/properties/page.tsx` | Editar | Conectar a DB, mostrar listado + boton crear |
| 9 | `app/app/properties/new/page.tsx` | **Crear** | Pagina de creacion |
| 10 | `app/app/properties/[id]/edit/page.tsx` | **Crear** | Pagina de edicion |
| 11 | `messages/ae.json` (+6) | Editar | +keys del namespace `property_form` |

---

## Paso a paso detallado

### Paso 1: `lib/actions.ts` -- Server actions para propiedades

Seguir el patron de `saveDeveloperProfile` y `saveBrokerProfile`.

#### 1a. `saveProperty()` 

```typescript
export interface SavePropertyPayload {
  id?: string;
  title: string;
  slug: string;
  description: string;
  property_type: string;
  status: string;
  country: string;
  city: string;
  community: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  area_sqm: number | null;
  floor: number | null;
  has_balcony: boolean;
  has_garden: boolean;
  price: number;
  currency: string;
  deposit_percentage: number | null;
  deposit_amount: number | null;
  has_post_handover: boolean;
  handover_date: string | null;
  payment_plan_months: number | null;
  amenities: string[];
  tags: string[];
  images: string[];
  cover_image: string | null;
  developer_id: string | null;
  development_id: string | null;
  is_active: boolean;
}

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 20_000;
const MAX_ADDRESS = 500;
const MAX_COMMUNITY = 200;
```

**Logica:**
1. Verificar sesion (`getUser()`)
2. Leer `listed_by_type` de `user_profiles.role`
3. Validar campos: title requerido (max 200), slug regex `^[a-z0-9-]+$`, price > 0, currency en whitelist, property_type en whitelist, status en whitelist
4. Sanitizar description con `sanitizeUserHtml()`
5. Calcular `area_sqm` automaticamente si se provee `area_sqft` (sqft * 0.0929) y viceversa
6. Upsert: si viene `id` -> UPDATE (verificando `listed_by_id = user.id`), sino -> INSERT con `listed_by_id` y `listed_by_type`
7. Retornar `{ id: string | null, error: string | null }` (el `id` para redirigir a edit)

#### 1b. `deleteProperty()`

```typescript
export async function deleteProperty(
  propertyId: string,
): Promise<{ error: string | null }>
```

**Logica:**
1. Verificar sesion
2. DELETE de `properties` WHERE `id = propertyId AND listed_by_id = user.id`
3. Las milestones se eliminan en cascada (ON DELETE CASCADE)

#### 1c. `saveMilestones()`

```typescript
export interface MilestonePayload {
  property_id: string;
  milestones: {
    id?: string;
    milestone_name: string;
    percentage: number;
    amount: number | null;
    due_date: string | null;
    description: string | null;
    sort_order: number;
  }[];
}

export async function saveMilestones(
  payload: MilestonePayload,
): Promise<{ error: string | null }>
```

**Logica:**
1. Verificar sesion, verificar que la propiedad es del usuario (`listed_by_id = user.id`)
2. Validar: cada milestone tiene `milestone_name` requerido, `percentage` entre 0 y 100, suma total no excede 100%
3. Strategy: DELETE todos los milestones existentes de la propiedad, INSERT los nuevos (simpler que diff individual)
4. Retornar `{ error }`

---

### Paso 2: `lib/properties.ts` -- Funcion para listado del dashboard

Agregar:

```typescript
export async function getMyProperties(
  userProfileId: string,
): Promise<PropertyData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities ),
      payment_plan_milestones ( * )
    `)
    .eq("listed_by_id", userProfileId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as unknown as PropertyRow[];
  const results: PropertyData[] = [];

  for (const row of rows) {
    let brokerName = "";
    let brokerSlug = "";
    if (row.listed_by_type === "broker") {
      const { data: broker } = await supabase
        .from("broker_profiles")
        .select("name, slug")
        .eq("user_profile_id", row.listed_by_id)
        .maybeSingle();
      brokerName = broker?.name ?? "";
      brokerSlug = broker?.slug ?? "";
    }
    results.push(toPropertyData(row, brokerName, brokerSlug));
  }

  return results;
}
```

Tambien agregar una funcion para obtener una propiedad own (sin filtro `is_active`):

```typescript
export async function getMyProperty(
  userProfileId: string,
  propertyId: string,
): Promise<PropertyData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      developers:developer_id ( name, slug, logo_url ),
      user_profiles:listed_by_id ( full_name ),
      developments:development_id ( name, slug, amenities ),
      payment_plan_milestones ( * )
    `)
    .eq("id", propertyId)
    .eq("listed_by_id", userProfileId)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as unknown as PropertyRow;
  let brokerName = "";
  let brokerSlug = "";
  if (row.listed_by_type === "broker") {
    const { data: broker } = await supabase
      .from("broker_profiles")
      .select("name, slug")
      .eq("user_profile_id", row.listed_by_id)
      .maybeSingle();
    brokerName = broker?.name ?? "";
    brokerSlug = broker?.slug ?? "";
  }

  return toPropertyData(row, brokerName, brokerSlug);
}
```

---

### Paso 3: `components/platform/property-form.tsx` -- Form principal

**Componente client** (~500-600 lineas). Seguir patron de `developer-form.tsx`.

**Props:**
```typescript
interface PropertyFormProps {
  property: PropertyData | null;  // null = modo creacion
  userId: string;
  userRole: UserRole;
  cities: string[];
  countryLabel: string;
  amenities: PropertyAmenity[];
  subcategories: PropertySubcategory[];
  developments: { id: string; name: string }[];
}
```

**Secciones del form:**

#### Seccion 1: Basic Information
- **Title** (input, required, max 200)
- **Slug** (auto-generado de title via `slugify()`, read-only, boton copy URL publica `/property/{slug}`)
- **Description** (textarea o RichTextEditor -- por simplicidad, textarea en v1)
- **Property Type** (select: apartment, villa, townhouse, penthouse, duplex)
- **Subcategory** (select from `property_subcategories`, grouped by residential/commercial)
- **Status** (select: available, sold, reserved, off_market; default: available)

#### Seccion 2: Location
- **Country** (read-only, desde `operating_country` del perfil)
- **City** (select from `cities` table, filtrado por pais)
- **Community** (text input o select from `communities` table)
- **Address** (text input, optional)

#### Seccion 3: Property Details
- **Bedrooms** (number input, 0-10)
- **Bathrooms** (number input, 0-10)
- **Area sqft** (number input)
- **Area sqm** (number input, auto-calcula de sqft si esta vacio, editable)
- **Floor** (number input, optional)
- **Has Balcony** (checkbox)
- **Has Garden** (checkbox)

#### Seccion 4: Pricing
- **Price** (number input, required, min 0)
- **Currency** (select: AED, USD, EUR, GBP; default: AED)
- **Deposit Percentage** (number input, 0-100)
- **Deposit Amount** (number input, auto-calcula de price * percentage si esta vacio)
- **Has Post Handover** (checkbox)
- **Handover Date** (date input)
- **Payment Plan Months** (number input)

#### Seccion 5: Payment Plan Milestones
- Componente `MilestonesEditor` (ver Paso 4)
- Lista de hitos con: name, percentage, amount, due_date, description
- Boton "+ Add Milestone"
- Validacion: suma de percentages no excede 100%
- Cada milestone se puede reordenar (drag o flechas up/down)

#### Seccion 6: Amenities
- Multi-select checkboxes desde `property_amenities` table
- Agrupados por category
- Busqueda/filter por nombre

#### Seccion 7: Images
- **Cover Image** (ImageUpload, bucket `property-images`, folder `covers`)
- **Gallery Images** (multi-upload, max 10, bucket `property-images`, folder `gallery`)
- Cada imagen con preview + boton delete
- Drag para reordenar (v2, por ahora orden de insercion)

#### Seccion 8: Tags
- Text input con chips/tags
- El usuario escribe un tag, presiona Enter, se agrega como chip
- Chips con boton X para eliminar

#### Seccion 9: Links (optional)
- **Developer** (select from `developers` table, solo si user es developer; auto-selected para developer)
- **Development** (select from `developments` table, filtrado por developer seleccionado)

#### Seccion 10: Visibility
- **Is Active** (toggle/checkbox, default true)
- **Is Featured** (toggle/checkbox, solo visible para admin en futuro)

**Estado del form:**
- `useState` por cada campo
- `hasChanges` compara estado actual contra props iniciales
- Boton Save deshabilitado cuando no hay cambios
- Save llama a `saveProperty()` -> si exito, `router.refresh()` o redirect a `/app/properties`
- Save para milestones llama a `saveMilestones()` despues de guardar la propiedad
- Banner "Pending verification" si aplica (mismo patron que developer/broker forms)

**UI:**
- Layout de una columna, max-w-3xl, padding consistente con otros forms
- Secciones separadas por headings + lineas divisorias
- Boton Save sticky en bottom o al final del form
- Loading spinner durante save
- Toast/inline error messages

---

### Paso 4: `components/platform/milestones-editor.tsx` -- Editor de milestones

**Componente client** (~150 lineas).

**Props:**
```typescript
interface MilestonesEditorProps {
  value: Milestone[];
  onChange: (milestones: Milestone[]) => void;
  currency: string;
}

interface Milestone {
  id?: string;
  milestone_name: string;
  percentage: number;
  amount: number | null;
  due_date: string | null;
  description: string | null;
  sort_order: number;
}
```

**UI:**
- Lista vertical de milestones
- Cada milestone: row con inputs (name, %, amount, date, description)
- Boton "+" para agregar nuevo milestone
- Boton "X" para eliminar (con confirmacion si tiene datos)
- Validacion inline: suma de % no excede 100%
- Warning si la suma es != 100% (no bloquea, solo avisa)
- Auto-calcula `amount` basado en `property.price * percentage / 100` si esta vacio

---

### Paso 5: `components/platform/property-list.tsx` -- Listado de propiedades

**Componente server** (~100 lineas).

**Props:**
```typescript
interface PropertyListProps {
  properties: PropertyData[];
}
```

**UI:**
- Tabla o cards con: titulo, tipo, status (badge), precio, ciudad, fecha creacion, acciones
- Status badges con colores: available=green, sold=red, reserved=yellow, off_market=grey
- Acciones: Edit (link a `/app/properties/{id}/delete`), Delete (con confirmacion)
- Empty state: "No properties yet. Create your first property."
- Link "Create Property" boton en header

---

### Paso 6: Paginas

#### 6a. `app/app/properties/page.tsx`

```typescript
// Server component
// 1. Verificar sesion (ya lo hace el layout)
// 2. getMyProperties(user.id)
// 3. getTranslations("property_form")
// 4. Render: header con boton "Create Property" + PropertyList
```

#### 6b. `app/app/properties/new/page.tsx`

```typescript
// Server component
// 1. Verificar sesion + rol
// 2. Cargar: getCitiesByCountry(operatingCountry), getPropertyAmenities(), 
//    getPropertySubcategories(), developments (si aplica)
// 3. Render: PropertyForm con property={null} (modo creacion)
```

#### 6c. `app/app/properties/[id]/edit/page.tsx`

```typescript
// Server component
// 1. Verificar sesion
// 2. getMyProperty(user.id, params.id)
// 3. Si no existe o no es del usuario -> redirect a /app/properties
// 4. Cargar: cities, amenities, subcategories, developments
// 5. Render: PropertyForm con property={data} (modo edicion)
```

---

### Paso 7: `messages/*.json` -- Traducciones

Namespace `property_form` en los 7 locales:

```json
"property_form": {
  "create_property": "Create Property",
  "edit_property": "Edit Property",
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "delete_confirm": "Are you sure you want to delete this property?",
  "basic_information": "Basic Information",
  "location": "Location",
  "property_details": "Property Details",
  "pricing": "Pricing",
  "payment_plan": "Payment Plan",
  "amenities": "Amenities",
  "images": "Images",
  "tags": "Tags",
  "links": "Links",
  "visibility": "Visibility",
  "title": "Title",
  "slug": "Slug",
  "description": "Description",
  "property_type": "Property Type",
  "subcategory": "Subcategory",
  "status": "Status",
  "country": "Country",
  "city": "City",
  "community": "Community",
  "address": "Address",
  "bedrooms": "Bedrooms",
  "bathrooms": "Bathrooms",
  "area_sqft": "Area (sqft)",
  "area_sqm": "Area (sqm)",
  "floor": "Floor",
  "has_balcony": "Has Balcony",
  "has_garden": "Has Garden",
  "price": "Price",
  "currency": "Currency",
  "deposit_percentage": "Deposit Percentage",
  "deposit_amount": "Deposit Amount",
  "has_post_handover": "Post Handover",
  "handover_date": "Handover Date",
  "payment_plan_months": "Payment Plan (months)",
  "milestone_name": "Milestone Name",
  "milestone_percentage": "Percentage",
  "milestone_amount": "Amount",
  "milestone_date": "Due Date",
  "milestone_description": "Description",
  "add_milestone": "Add Milestone",
  "cover_image": "Cover Image",
  "gallery_images": "Gallery Images",
  "tag_input_placeholder": "Type a tag and press Enter",
  "developer": "Developer",
  "development": "Development",
  "is_active": "Active",
  "is_featured": "Featured",
  "no_properties": "No properties yet",
  "create_first": "Create your first property",
  "copy_url": "Copy public URL",
  "url_copied": "URL copied!",
  "save_success": "Property saved successfully",
  "save_error": "Could not save property",
  "upload_cover": "Upload cover image",
  "upload_images": "Upload images",
  "max_images": "Maximum 10 images",
  "percentage_warning": "Total percentage should equal 100%"
}
```

---

## Orden de ejecucion

1. `lib/actions.ts` -- server actions (`saveProperty`, `deleteProperty`, `saveMilestones`)
2. `lib/properties.ts` -- `getMyProperties()`, `getMyProperty()`
3. `components/platform/milestones-editor.tsx` -- editor de milestones
4. `components/platform/property-form.tsx` -- form principal
5. `components/platform/property-list.tsx` -- listado
6. `app/app/properties/page.tsx` -- pagina de listado
7. `app/app/properties/new/page.tsx` -- pagina de creacion
8. `app/app/properties/[id]/edit/page.tsx` -- pagina de edicion
9. `messages/*.json` -- traducciones (pueden hacerse en paralelo)

---

## Notas

- **Multi-image upload:** El componente `ImageUpload` actual es single-image. Necesitamos una variante multi-upload o un nuevo componente `MultiImageUpload`. Por simplicidad, podemos usar multiples instancias de `ImageUpload` con un array de URLs en estado, o crear un componente `MultiImageUpload` que use el mismo patron.
- **Communities como select:** La tabla `communities` tiene datos curados. Se puede hacer un select desde la tabla en vez de text input, pero requiere que las migraciones esten ejecutadas (que ya lo estan).
- **Developments como select:** Solo aparece si hay developments en la DB. Filtrado por developer seleccionado.
- **Auto-calculation:** `area_sqm` se calcula de `area_sqft * 0.0929` y `deposit_amount` de `price * deposit_percentage / 100`. Si el usuario edita el campo calculado, se sobreescribe.
- **Slug uniqueness:** El slug es UNIQUE por `listed_by_id`, no global. Dos usuarios pueden tener propiedades con el mismo slug.
- **Milestones strategy:** DELETE all + INSERT all es simple pero genera mucho churn. Para MVP esta bien. Si hay miles de milestones, se puede optimizar con upsert individual.
- **No hay draft mode:** La propiedad se publica directamente (`is_active: true` por default). Se puede agregar draft en v2.
- **No hay validacion de suma de milestones:** Se avisa visualmente pero no bloquea el save. La DB tiene CHECK en percentage (0-100) pero no suma total.
- **Imagenes:** Las imagenes se suben al bucket `property-images` con la estructura `{userId}/{folder}/{timestamp}-{random}.{ext}`. El componente `ImageUpload` ya soporta bucket configurable via prop.

---

## Validacion

Despues de implementar:
1. `pnpm build` sin errores
2. Navegar a `/app/properties` -> muestra empty state
3. Click "Create Property" -> abre form
4. Llenar camposbasicos -> Save funciona (aparece en `/app/properties` list)
5. Click Edit -> abre form con datos precargados
6. Agregar milestones -> se guardan correctamente
7. Subir cover image + gallery images -> se guardan en bucket
8. Seleccionar amenities -> se guardan como array
9. Agregar tags -> se guardan como array
10. Verificar que la propiedad aparece en `/property/[slug]` publico con "Uploaded by" correcto
