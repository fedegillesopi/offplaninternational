# Plan: "Uploaded by" + Conexion a DB en Detalle de Propiedad

**Objetivo:** Mostrar quien subio cada propiedad (developer, broker, o private seller) en la pagina de detalle, y reemplazar el mock data por queries reales a Supabase.

**Fecha:** 25-Ago-2026

---

## Contexto

Actualmente la pagina de detalle de propiedad (`/[locale]/property/[slug]`) usa mock data hardcodeada en `lib/mock-properties.ts`. No hay conexion a la tabla `properties` de Supabase. Ademas, no se muestra quien subio la propiedad -- solo se linkea al developer o broker en la sidebar sin contexto claro.

**Se busca:**
1. Conectar el detalle de propiedad a la DB (reemplazar mock data)
2. Agregar "Uploaded by: {nombre}" en dos ubicaciones:
   - **Meta bar** (lado izquierdo, junto a ubicacion/categoria/beds/baths)
   - **Sidebar** (lado derecho, reemplazando el link existente a developer/broker)
3. Para private sellers: mostrar nombre sin link (no tienen pagina publica)

---

## Archivos a modificar

| # | Archivo | Accion | Descripcion |
|---|---------|--------|-------------|
| 1 | `lib/types.ts` | Editar | Agregar `private_seller_name` a `PropertyData` |
| 2 | `lib/mock-properties.ts` | Editar | Agregar `private_seller_name: ""` a las 3 propiedades |
| 3 | `lib/properties.ts` | **Crear** | Data access: `getPropertyBySlug()`, `getRelatedProperties()` |
| 4 | `messages/ae.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 5 | `messages/es.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 6 | `messages/ar.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 7 | `messages/gb.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 8 | `messages/br.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 9 | `messages/mx.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 10 | `messages/pt.json` | Editar | Agregar `uploaded_by` en `property_detail` |
| 11 | `components/properties/property-sidebar.tsx` | Editar | Reemplazar seller link con "Uploaded by" |
| 12 | `app/[locale]/property/[slug]/page.tsx` | Editar | Conectar a DB + "Uploaded by" en meta bar |

---

## Paso a paso detallado

### Paso 1: `lib/types.ts` -- Campo `private_seller_name`

**Por que:** La interfaz `PropertyData` tiene `developer_name` y `broker_name` pero no tiene campo para private sellers. Necesitamos un campo unificado para el helper de "uploader".

**Que cambiar:**

En la interfaz `PropertyData` (linea ~148, despues de `broker_slug`), agregar:

```typescript
private_seller_name: string;
```

La interfaz quedaria asi en esa zona:

```typescript
developer_name: string;
developer_slug: string;
developer_logo: string;
broker_name: string;
broker_slug: string;
private_seller_name: string;   // <-- NUEVO
development_name: string;
```

---

### Paso 2: `lib/mock-properties.ts` -- Compatibilidad temporal

**Por que:** Como `PropertyData` ahora tiene `private_seller_name`, el mock data debe incluirlo para que TypeScript no rompa.

**Que cambiar:**

En cada una de las 3 propiedades del array `mockProperties`, agregar despues de `broker_slug`:

```typescript
private_seller_name: "",
```

Las 3 propiedades existentes son de tipo `listed_by_type: "developer"`, asi que el campo queda vacio.

---

### Paso 3: `lib/properties.ts` -- Data access (nuevo archivo)

**Por que:** Necesitamos una funcion que consulte la tabla `properties` con los JOINs necesarios para poblar todos los campos planos de `PropertyData`. Seguimos el patron de `lib/developers.ts` y `lib/brokers.ts`.

**Estructura del archivo:**

```typescript
import { createClient } from "@/lib/supabase/server";
import type { PropertyData, PaymentPlanMilestone } from "@/lib/types";

interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  listed_by_id: string;
  listed_by_type: string;
  developer_id: string | null;
  development_id: string | null;
  status: string;
  country: string;
  city: string;
  community: string | null;
  address: string | null;
  property_type: string;
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
  amenities: string[] | null;
  images: string[] | null;
  cover_image: string | null;
  tags: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  // JOINs
  developers: { name: string; slug: string; logo_url: string | null } | null;
  broker_profiles: { name: string; slug: string } | null;
  user_profiles: { full_name: string } | null;
  developments: {
    name: string;
    slug: string;
    amenities: string[] | null;
  } | null;
  payment_plan_milestones: PaymentPlanMilestone[] | null;
}
```

**Funcion `getPropertyBySlug`:**

```typescript
export async function getPropertyBySlug(
  slug: string,
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
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getPropertyBySlug:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as PropertyRow;

  // Query separada para broker (JOIN indirecto via user_profiles)
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

> **Nota sobre broker_profiles:** El FK `listed_by_id` apunta a `user_profiles(id)`, y `broker_profiles.user_profile_id` tambien apunta a `user_profiles(id)`. No hay FK directo entre `properties` y `broker_profiles`, asi que se hace una query separada para el broker. Esto es limpio y evita problemas con PostgREST nested joins.

**Funcion `toPropertyData`:**

```typescript
const CATEGORY_MAP: Record<string, string> = {
  apartment: "Apartment",
  villa: "Villa",
  townhouse: "Townhouse",
  penthouse: "Penthouse",
  duplex: "Duplex",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatHandoverDate(date: string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  return `Q${q} - ${d.getFullYear()}`;
}

function toPropertyData(
  row: PropertyRow,
  brokerName: string,
  brokerSlug: string,
): PropertyData {
  const dev = row.developers;
  const devt = row.developments;
  const milestones = (row.payment_plan_milestones ?? [])
    .sort((a, b) => a.sort_order - b.sort_order);

  const totalDeposit = milestones.length > 0
    ? milestones[0].percentage
    : row.deposit_percentage ?? 0;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    descriptionFull: row.description ?? "",

    listed_by_id: row.listed_by_id,
    listed_by_type: row.listed_by_type as PropertyData["listed_by_type"],
    developer_id: row.developer_id,
    development_id: row.development_id,

    status: row.status as PropertyData["status"],
    country: row.country,
    city: row.city,
    community: row.community ?? "",
    address: row.address,

    property_type: row.property_type as PropertyData["property_type"],
    category: CATEGORY_MAP[row.property_type] ?? row.property_type,
    subcategory: CATEGORY_MAP[row.property_type] ?? row.property_type,
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    area: row.area_sqft ?? 0,
    area_sqft: row.area_sqft,
    area_sqm: row.area_sqm,
    floor: row.floor,
    has_balcony: row.has_balcony,
    has_garden: row.has_garden,

    price: row.price,
    currency: row.currency as PropertyData["currency"],
    deposit_percentage: row.deposit_percentage,
    deposit_amount: row.deposit_amount,

    has_post_handover: row.has_post_handover,
    handover_date: row.handover_date,
    handoverDate: formatHandoverDate(row.handover_date),
    payment_plan_months: row.payment_plan_months,

    images: row.images ?? [],
    cover_image: row.cover_image,
    amenities: row.amenities ?? [],
    tags: row.tags ?? [],

    is_featured: row.is_featured,
    is_active: row.is_active,
    addedOn: formatDate(row.created_at),
    created_at: row.created_at,
    updated_at: row.updated_at,

    developer_name: dev?.name ?? "",
    developer_slug: dev?.slug ?? "",
    developer_logo: dev?.logo_url ?? "",
    broker_name: brokerName,
    broker_slug: brokerSlug,
    private_seller_name:
      row.listed_by_type === "private_seller"
        ? row.user_profiles?.full_name ?? ""
        : "",
    development_name: devt?.name ?? "",
    development_slug: devt?.slug ?? "",
    development_total_area: 0,
    development_amenities: devt?.amenities ?? [],
    community_name: row.community ?? "",
    community_slug: "",
    community_total_area: 0,
    community_description: "",

    paymentPlan: {
      length: row.payment_plan_months
        ? `${row.payment_plan_months} months`
        : "",
      depositPercentage: totalDeposit ? `${totalDeposit}%` : "",
      depositValue: row.deposit_amount
        ? `${row.currency} ${row.deposit_amount.toLocaleString()}`
        : "",
      description: milestones
        .map((m) => `${m.percentage}% ${m.milestone_name}`)
        .join(" / "),
    },
    phone: "",
    whatsapp: "",
  };
}
```

**Funcion `getRelatedProperties`:**

```typescript
export async function getRelatedProperties(
  currentId: string,
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
    .eq("is_active", true)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(3);

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

---

### Paso 4: `messages/*.json` -- Traduccion `uploaded_by`

**Por que:** Necesitamos una key traducida para el label "Uploaded by" en los 7 locales.

**Que agregar** en cada archivo, dentro del objeto `property_detail` (despues de `development_label`):

```json
"uploaded_by": "Uploaded by"
```

**Traducciones por locale:**

| Locale | Valor |
|--------|-------|
| `ae` (EN-UAE) | `"Uploaded by"` |
| `gb` (EN-UK) | `"Uploaded by"` |
| `es` (ES) | `"Publicado por"` |
| `ar` (AR) | `"تم النشر بواسطة"` |
| `br` (PT-BR) | `"Publicado por"` |
| `mx` (ES-MX) | `"Publicado por"` |
| `pt` (PT) | `"Publicado por"` |

---

### Paso 5: `components/properties/property-sidebar.tsx` -- Reemplazar seller link

**Por que:** El sidebar actual muestra "Developer" o "Broker" como label con un link. Lo reemplazamos con "Uploaded by: {nombre}" que incluye los 3 roles.

**Cambios:**

1. Agregar import de `User` de lucide-react (para el icono)
2. Reemplazar el bloque de "Development" + "Developer/Broker" (lineas 47-70)

**Bloque actual (lineas 47-70):**

```tsx
<div className="flex flex-col gap-3 md:flex-row md:gap-4">
  <div className="min-w-0 flex flex-col gap-1">
    <span className="...">Development</span>
    <Link href={...}>{developmentName}</Link>
  </div>
  <div className="min-w-0 flex flex-col gap-1">
    <span className="...">{listedByType === "broker" ? "Broker" : t("developer_label")}</span>
    <Link href={sellerHref}>{sellerName}</Link>
  </div>
</div>
```

**Reemplazo:**

```tsx
<div className="flex flex-col gap-3 md:flex-row md:gap-4">
  <div className="min-w-0 flex flex-col gap-1">
    <span className="font-body text-xs font-medium text-[--text-primary] tracking-wide">
      {t("development_label")}
    </span>
    <Link
      href={`/development/${developmentSlug}`}
      className="w-full truncate font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
    >
      {developmentName}
    </Link>
  </div>
  <div className="min-w-0 flex flex-col gap-1">
    <span className="font-body text-xs font-medium text-[--text-primary] tracking-wide">
      {t("uploaded_by")}
    </span>
    {listedByType === "private_seller" ? (
      <span className="w-full truncate font-body text-sm font-medium text-[--text-primary]">
        {sellerName}
      </span>
    ) : (
      <Link
        href={sellerHref}
        className="w-full truncate font-body text-sm font-medium text-[--primary-main] no-underline hover:underline"
      >
        {sellerName}
      </Link>
    )}
  </div>
</div>
```

**Logica:**
- Si `listedByType === "private_seller"` -> renderiza `<span>` sin link
- Si es developer o broker -> renderiza `<Link>` como antes

---

### Paso 6: `app/[locale]/property/[slug]/page.tsx` -- Conectar a DB + "Uploaded by" en meta bar

**Por que:** Reemplazar mock data por query real y agregar "Uploaded by" en el lado izquierdo.

**Cambios:**

#### 6a. Imports

Cambiar:

```typescript
import { mockProperties } from "@/lib/mock-properties";
```

Por:

```typescript
import { getPropertyBySlug, getRelatedProperties } from "@/lib/properties";
```

Eliminar las funciones locales `getPropertyBySlug` y `getRelatedProperties` (lineas 19-25).

#### 6b. Query async

Cambiar:

```typescript
const property = getPropertyBySlug(slug);
if (!property) notFound();
const related = getRelatedProperties(property);
```

Por:

```typescript
const property = await getPropertyBySlug(slug);
if (!property) notFound();
const related = await getRelatedProperties(property.id);
```

#### 6c. "Uploaded by" en meta bar

En la meta bar (lineas 71-98), agregar un nuevo bloque despues del area (linea 97):

```tsx
<span className="text-[--grey-200]">|</span>

<div className="flex items-center gap-1">
  <User className="h-4 w-4 text-[--primary-main]" />
  <span>{td("uploaded_by")}</span>
  {property.listed_by_type === "private_seller" ? (
    <span className="font-medium">{property.private_seller_name}</span>
  ) : property.listed_by_type === "broker" ? (
    <Link
      href={`/broker/${property.broker_slug}`}
      className="font-medium text-[--primary-main] no-underline hover:underline"
    >
      {property.broker_name}
    </Link>
  ) : (
    <Link
      href={`/developer/${property.developer_slug}`}
      className="font-medium text-[--primary-main] no-underline hover:underline"
    >
      {property.developer_name}
    </Link>
  )}
</div>
```

**Import adicional:** Agregar `User` de lucide-react:

```typescript
import { Bed, Bath, MapPin, User } from "lucide-react";
```

#### 6d. Sidebar -- Pasar uploader correcto

En el `<PropertySidebar>` (lineas 214-224), cambiar los props de seller:

```tsx
<PropertySidebar
  price={property.price}
  currency={property.currency}
  developmentName={property.development_name}
  developmentSlug={property.development_slug}
  sellerName={
    property.listed_by_type === "private_seller"
      ? property.private_seller_name
      : property.listed_by_type === "broker"
        ? property.broker_name
        : property.developer_name
  }
  sellerSlug={
    property.listed_by_type === "private_seller"
      ? ""
      : property.listed_by_type === "broker"
        ? property.broker_slug
        : property.developer_slug
  }
  listedByType={property.listed_by_type}
  phone={property.phone}
  whatsapp={property.whatsapp}
/>
```

---

## Orden de ejecucion

1. `lib/types.ts` -- campo `private_seller_name`
2. `lib/mock-properties.ts` -- compatibilidad temporal
3. `lib/properties.ts` -- data access (se puede crear sin romper nada existente)
4. `messages/*.json` -- traduccion `uploaded_by` (7 archivos)
5. `components/properties/property-sidebar.tsx` -- UI sidebar
6. `app/[locale]/property/[slug]/page.tsx` -- conexion DB + meta bar

---

## Notas

- **Mock data se mantiene** como fallback. Si la query a DB falla, se puede usar `mockProperties` como backup temporal. La funcion `getPropertyBySlug` retorna `null` si hay error, y la pagina llama a `notFound()`.
- **El listado de propiedades** (`/properties`) sigue usando mock data por ahora -- esto es solo para el detalle.
- **El campo `descriptionFull`** de `PropertyData` es un campo mock. En la DB, `properties.description` es un solo campo. Se mapea `description` a ambos `description` y `descriptionFull` (mismo valor).
- **El campo `category`** de `PropertyData` no existe en la tabla `properties`. Se deriva de `property_type` (apartment -> "Apartment", villa -> "Villa", etc.) con un mapa simple.
- **El campo `subcategory`** se deriva de `property_type` por ahora. Si se necesita real, se puede JOIN con `property_subcategories`.
- **Los campos `phone` y `whatsapp`** de `PropertyData` no existen en la tabla `properties`. Se pueden resolver desde `developers.email`/`developers.phone` o `broker_profiles.phone`/`broker_profiles.whatsapp`. Por ahora quedan vacios (el mock data los tenia hardcodeados).
- **Los campos `development_total_area`, `community_total_area`, `community_description`** no existen en las tablas actuales. Quedan en 0/"". Se pueden agregar cuando se implementen las paginas de developments y communities conectadas a DB.
- **El query de `getRelatedProperties`** hace N+1 queries (1 query + N queries para brokers). Si hay muchos brokers, se puede optimizar con un batch. Para MVP con pocas propiedades, es aceptable.

---

## Validacion

Despues de implementar:
1. Verificar que `pnpm build` no tiene errores de tipo
2. Verificar que la pagina de detalle carga correctamente con el mock data existente (si hay DB data)
3. Verificar que el "Uploaded by" aparece en la meta bar (lado izquierdo)
4. Verificar que el "Uploaded by" aparece en la sidebar (lado derecho) reemplazando el label "Developer"/"Broker"
5. Verificar que private seller muestra nombre sin link
6. Verificar que developer/broker muestran nombre con link a su pagina publica
