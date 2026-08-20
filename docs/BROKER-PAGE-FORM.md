# Broker Profile — Plan de Implementación

**Fecha:** 19-Ago-2026
**Estado:** Plan

---

## 1. RESUMEN

Implementar el perfil público y el formulario de edición para el rol **Broker**, siguiendo los patrones exactos del sistema existente para Developer.

**Diferencia clave con Developer:** El broker NO tiene página de listado. Su perfil público (`/broker/[slug]`) solo se accede desde la página de detalle de una propiedad que el broker cargó. La página incluye: header con foto/nombre/stats, sección "About", y listado de sus propiedades activas (hasta 5).

---

## 2. CAMBIOS POR ARCHIVO

### 2.1 Migración: `supabase/migrations/014_broker_profile.sql`

Nueva tabla `broker_profiles` (separada de `developers` porque el schema es distinto — los brokers no tienen `on_time_completion`, `is_verified`, ni `cover_image` de portada; tienen `profile_image`, `closed_transactions`, `whatsapp` público).

```sql
-- Tabla broker_profiles
CREATE TABLE broker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id uuid NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  profile_image text,                -- imagen de perfil (recortada circular)
  personal_url text,                 -- link a pagina personal externa
  description text,                  -- HTML sanitizado (TipTap)
  country text,
  city text,
  email_public text,                 -- email publico de contacto
  phone text,
  whatsapp text,                     -- numero de whatsapp (puede diferir de phone)
  closed_transactions integer DEFAULT 0, -- transacciones cerradas
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indices
CREATE INDEX idx_broker_profiles_slug ON broker_profiles(slug);
CREATE INDEX idx_broker_profiles_user_profile_id ON broker_profiles(user_profile_id);

-- Trigger updated_at
CREATE TRIGGER trigger_set_updated_at_broker_profiles
  BEFORE UPDATE ON broker_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE broker_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT público: brokers verificados
CREATE POLICY "broker_profiles_select_public"
  ON broker_profiles FOR SELECT
  USING (is_verified = true);

-- SELECT propio: broker ve su propio perfil
CREATE POLICY "broker_profiles_select_own"
  ON broker_profiles FOR SELECT
  USING (auth.uid() = user_profile_id);

-- INSERT propio
CREATE POLICY "broker_profiles_insert_own"
  ON broker_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_profile_id);

-- UPDATE propio
CREATE POLICY "broker_profiles_update_own"
  ON broker_profiles FOR UPDATE
  USING (auth.uid() = user_profile_id);
```

**Patrón:** Idéntico a `developers` (migración 007 + 011). `UNIQUE(user_profile_id)` garantiza un solo registro por usuario. RLS: público para verificados, propio para el dueño.

### 2.2 Tipo TypeScript: `lib/types.ts`

Agregar interfaz `BrokerProfile`:

```typescript
export interface BrokerProfile {
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
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

### 2.3 Data access: `lib/brokers.ts` (nuevo archivo)

Patrón idéntico a `lib/developers.ts`:

```typescript
// Interfaces de consulta
interface BrokerCardData { name, profileImage, slug }
interface BrokerDetailData { id, name, slug, profileImage, personalUrl, description, location, emailPublic, phone, whatsapp, closedTransactions }

// Funciones
getBrokerBySlug(slug): single verified broker by slug (para página pública)
getMyBroker(userProfileId): single broker by user_profile_id (para el form, sin filtro is_verified)
```

La función `getBrokerBySlug` filtra `is_verified = true` y usa `.maybeSingle()`. La función `getMyBroker` no filtra verificación (el broker ve su propio perfil sin importar si está verificado).

### 2.4 Server action: `lib/actions.ts`

Agregar `saveBrokerProfile()`:

```typescript
export async function saveBrokerProfile(payload: SaveBrokerPayload): Promise<{ error: string | null }>
```

**Payload:**
- `id?`: string (presente = update, ausente = insert)
- `name`: requerido, max 120
- `slug`: auto-generado, regex `^[a-z0-9-]+$`
- `profile_image?`: string | null
- `personal_url?`: string | null (auto-prefija `https://` si falta)
- `description?`: string | null (max 20.000, sanitizada con `sanitizeUserHtml`)
- `country?`: string | null
- `city?`: string | null
- `email_public?`: string | null (max 320)
- `phone?`: string | null (max 50)
- `whatsapp?`: string | null (max 50)
- `closed_transactions?`: number | null (>= 0)

**Lógica:** Misma que `saveDeveloperProfile`. `getUser()` para auth, validaciones server-side, sanitización de descripción, auto-prefijo website, upsert por `user_profile_id`.

### 2.5 Formulario: `components/platform/broker-form.tsx` (nuevo archivo)

**Client component** basado en `developer-form.tsx`. Diferencias:

| Campo | Developer Form | Broker Form |
|---|---|---|
| Company Name (name) | `developer.name` | `broker.name` |
| Slug | auto, read-only, copy URL | auto, read-only, copy URL (`/broker/{slug}`) |
| Description | RichTextEditor (TipTap) | RichTextEditor (TipTap) |
| Profile Image | No tiene | `ImageUpload` (folder: "profile", circular preview) |
| Cover Image | `ImageUpload` (covers) | No tiene |
| Logo | `ImageUpload` (logos) | No tiene |
| Personal URL | No tiene | Input text (auto-prefijo `https://`) |
| City | Select de ciudades por país | Select de ciudades por país |
| Country | Read-only desde perfil | Read-only desde perfil |
| On-time completion | Input 0-100 | No tiene |
| Email | Input | Input (`email_public`) |
| Phone | Input | Input |
| WhatsApp | No tiene | Input (`whatsapp`) |
| Closed transactions | No tiene | Input number (>= 0) |

**Adiciones al form:**
- Banner "Pending verification" si `is_verified === false` (mismo patrón que developer)
- Copy URL button que copia `${origin}/broker/${slug}`
- ImageUpload para profile_image con preview circular (`rounded-full`)

### 2.6 Página del form: `app/app/broker/page.tsx` (nuevo archivo)

**Server component** basado en `app/app/developer/page.tsx`. Cambios:

```typescript
// Role gate
if (profile.role !== "broker") redirect("/app");

// Data loading
const broker = await getMyBroker(user.id);
const cities = await getCitiesByCountry(profile.operating_country);
const countryCode = getCountryCode(profile.operating_country);
const countryLabel = getCountryLabel(profile.operating_country);

return (
  <BrokerForm
    broker={broker}
    profile={profile}
    cities={cities}
    countryCode={countryCode}
    countryLabel={countryLabel}
  />
);
```

### 2.7 Sidebar: `components/platform/app-sidebar.tsx`

Agregar nav item al array `NAV_BY_ROLE.broker`:

```typescript
broker: [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/broker", label: "Broker Profile", icon: BriefcaseBusiness },
  { href: "/app/properties", label: "Properties", icon: Building },
],
```

Mismo icono `BriefcaseBusiness` que el developer. Label "Broker Profile".

### 2.8 Página pública: `app/[locale]/broker/[slug]/page.tsx` (nuevo archivo)

**Server component** basado en `app/[locale]/developer/[slug]/page.tsx`. Estructura:

```
<Navbar />
<main>
  <BackToHome href="/properties" />
  <Breadcrumb: Home > Properties > {brokerName} />

  {/* Header Section */}
  <BrokerHeader
    profileImage={broker.profileImage}
    name={broker.name}
    personalUrl={broker.personalUrl}
    activePropertiesCount={activeProperties.length}
    closedTransactions={broker.closedTransactions}
    email={broker.emailPublic}
    whatsapp={broker.whatsapp}
  />

  {/* About Section */}
  <section>
    <h2>About {broker.name}</h2>
    <BrokerDescription text={broker.description} />
  </section>

  {/* Active Properties Section */}
  <section>
    <h2>Active Properties</h2>
    <div>
      {activeProperties.map(p => <PropertyCard key={p.id} property={p} />)}
    </div>
    {activeProperties.length > 0 && (
      <Link href="/properties">View all</Link>
    )}
  </section>
</main>
<Footer />
```

**Query en page.tsx:**
```typescript
const broker = await getBrokerBySlug(slug);
if (!broker) notFound();

// Query propiedades activas del broker
const { data: properties } = await supabase
  .from("properties")
  .select("*")
  .eq("listed_by_id", broker.user_profile_id)
  .eq("listed_by_type", "broker")
  .eq("is_active", true)
  .order("created_at", { ascending: false })
  .limit(5);
```

**Nota sobre propiedades:** Las propiedades del broker ya existen en la tabla `properties` con `listed_by_type = "broker"` y `listed_by_id = user_profile_id` del broker. No se crean nuevas tablas para esto.

### 2.9 Componentes públicos (nuevos en `components/brokers/`)

| Archivo | Tipo | Descripción |
|---|---|---|
| `broker-header.tsx` | Server | Header con profile image (rounded-full, shadow), nombre, link a personal URL, stats (active properties count + closed transactions), botones email/whatsapp |
| `broker-description.tsx` | Server | Render HTML sanitizado + fallback legacy `**bold**` (mismo patrón que `developer-description.tsx`) |

**BrokerHeader** — Detalle del layout:

```jsx
<div className="flex items-center gap-6 rounded-full bg-white p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
  {/* Profile image - circular */}
  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
    <Image src={profileImage} alt={name} fill className="object-cover" />
  </div>

  {/* Info */}
  <div className="flex flex-col gap-1">
    <h1 className="font-heading text-h4 font-bold">{name}</h1>
    {personalUrl && (
      <a href={personalUrl} target="_blank" rel="noopener noreferrer">
        Visit personal page →
      </a>
    )}
    <div className="flex gap-4 text-sm text-[--grey-300]">
      <span>{activePropertiesCount} active properties</span>
      <span>{closedTransactions} closed transactions</span>
    </div>
  </div>

  {/* Contact buttons */}
  <div className="ml-auto flex gap-2">
    <a href={`mailto:${email}`}><Mail /></a>
    <a href={`https://wa.me/${whatsapp}`}><MessageCircle /></a>
  </div>
</div>
```

### 2.10 Property sidebar: `components/properties/property-sidebar.tsx`

Modificar para que cuando `listed_by_type === "broker"`, el link del vendedor apunte a `/broker/{slug}` en lugar de `/developer/{slug}`.

**Cambio:** El componente recibe una nueva prop `listedByType` y condiciona el href:

```typescript
// Antes (siempre developer)
<Link href={`/developer/${developerSlug}`}>

// Después (condicional)
<Link href={listedByType === "broker" ? `/broker/${brokerSlug}` : `/developer/${developerSlug}`}>
```

**Props adicionales:** `listedByType: UserRole`, `brokerName?: string`, `brokerSlug?: string`.

### 2.11 Translations: `messages/*.json` (7 archivos)

Agregar namespace `broker_detail` en los 7 locales:

```json
"broker_detail": {
  "back_to_properties": "Back to Properties",
  "about_broker": "About {name}",
  "active_properties": "Active Properties",
  "view_all": "View all",
  "visit_personal_page": "Visit personal page",
  "active_properties_count": "{count} active properties",
  "closed_transactions": "{count} closed transactions",
  "email": "Email",
  "whatsapp": "WhatsApp",
  "pending_verification": "Your profile is pending verification"
}
```

### 2.12 Traducciones del form: `messages/*.json`

Agregar namespace `broker_form` para el formulario del dashboard (solo en ae.json por ahora, ya que el dashboard no usa i18n — pero preparado para futuro):

```json
"broker_form": {
  "broker_profile": "Broker Profile",
  "profile_image": "Profile Image",
  "company_name": "Company Name",
  "personal_url": "Personal Website",
  "description": "Description",
  "email": "Public Email",
  "phone": "Phone",
  "whatsapp": "WhatsApp",
  "closed_transactions": "Closed Transactions",
  "city": "City",
  "country": "Country",
  "save": "Save Changes",
  "saving": "Saving...",
  "copy_url": "Copy public URL",
  "copied": "Copied!",
  "pending_verification": "Your profile is pending verification",
  "slug_label": "Public URL",
  "create_profile": "Create Broker Profile"
}
```

---

## 3. ORDEN DE IMPLEMENTACIÓN

### Paso 1: Migración + seed
1. Crear `supabase/migrations/014_broker_profile.sql`
2. Ejecutar en Supabase SQL Editor

### Paso 2: Tipos + Data Access
1. Agregar `BrokerProfile` a `lib/types.ts`
2. Crear `lib/brokers.ts` con `getBrokerBySlug()` y `getMyBroker()`

### Paso 3: Server Action
1. Agregar `saveBrokerProfile()` a `lib/actions.ts`
2. Agregar interfaz `SaveBrokerProfile` al archivo

### Paso 4: Formulario en Dashboard
1. Crear `components/platform/broker-form.tsx`
2. Crear `app/app/broker/page.tsx`
3. Actualizar `app-sidebar.tsx` (NAV_BY_ROLE.broker)

### Paso 5: Página Pública
1. Crear `components/brokers/broker-header.tsx`
2. Crear `components/brokers/broker-description.tsx`
3. Crear `app/[locale]/broker/[slug]/page.tsx`

### Paso 6: Integración con Property Sidebar
1. Actualizar `property-sidebar.tsx` para link condicional broker/developer
2. Actualizar `property/[slug]/page.tsx` para pasar `listedByType`

### Paso 7: Translations
1. Agregar `broker_detail` a los 7 archivos `messages/*.json`
2. Agregar `broker_form` a los 7 archivos `messages/*.json`

### Paso 8: Limpieza + Auditoría
1. Ejecutar `pnpm lint`
2. Ejecutar `pnpm build` (verificar que no hay errores)
3. Invocar reviewer + security

---

## 4. ARCHIVOS A CREAR

| Archivo | Tipo |
|---|---|
| `supabase/migrations/014_broker_profile.sql` | SQL |
| `lib/brokers.ts` | Data access |
| `components/platform/broker-form.tsx` | Client component |
| `app/app/broker/page.tsx` | Server page |
| `components/brokers/broker-header.tsx` | Server component |
| `components/brokers/broker-description.tsx` | Server component |
| `app/[locale]/broker/[slug]/page.tsx` | Server page |

## 5. ARCHIVOS A MODIFICAR

| Archivo | Cambio |
|---|---|
| `lib/types.ts` | Agregar interfaz `BrokerProfile` |
| `lib/actions.ts` | Agregar `saveBrokerProfile()` |
| `components/platform/app-sidebar.tsx` | Agregar nav item en `NAV_BY_ROLE.broker` |
| `components/properties/property-sidebar.tsx` | Link condicional broker/developer |
| `app/[locale]/property/[slug]/page.tsx` | Pasar `listedByType` al sidebar |
| `messages/ae.json` | Agregar `broker_detail` y `broker_form` |
| `messages/ar.json` | Idem |
| `messages/br.json` | Idem |
| `messages/es.json` | Idem |
| `messages/gb.json` | Idem |
| `messages/mx.json` | Idem |
| `messages/pt.json` | Idem |

---

## 6. DECISIONES TOMADAS

| Decisión | Razón |
|---|---|
| Tabla separada `broker_profiles` (no reusar `developers`) | El schema es distinto: brokers no tienen `cover_image`, `on_time_completion`, `is_verified` del mismo tipo; sí tienen `profile_image` circular, `whatsapp` público, `closed_transactions`, `personal_url`. Mantener tablas separadas evita columnas nullable innecesarias |
| URL `/broker/[slug]` (no `/brokers/[slug]`) | Consistencia con `/developer/[slug]`, `/development/[slug]`, `/community/[slug]`. El plural "brokers" en la URL del usuario se refiere al path del sitio, no al patrón de rutas |
| Profile image con ImageUpload (no TipTap inline) | La imagen del broker es un avatar circular, no una imagen de contenido. Se sube al bucket `broker-images` con la misma lógica que `developer-images` |
| Sin RichTextEditor para descripción del broker | La descripción del broker es texto plano o HTML simple. Se reutiliza `developer-description.tsx` que ya soporta ambos formatos. Si se necesita TipTap en el futuro, se adapta el form |
| Bucket `broker-images` separado de `developer-images` | Evita conflictos de permisos RLS y mantiene el principio de separación por dominio. Misma configuración: público, 5MB, jpeg/png/webp |
| `closed_transactions` como integer en el form | El broker lo ingresa manualmente (es un dato público de credibilidad, no un conteo automático). Se valida `>= 0` en el server action |
| Property sidebar condicional | En lugar de duplicar el sidebar, se agrega una prop `listedByType` que condiciona el href. Las propiedades ya tienen `listed_by_type` en la tabla `properties` |
| Sin listing page de brokers | El perfil del broker solo se accede desde propiedades. No se crea `/[locale]/brokers` como listado. El CTA "view all" en la página del broker lleva a `/properties` (listado general) |

---

## 7. BUCKET: `broker-images`

Migración 014 incluye la creación del bucket (o se crea migración separada `015_broker_images_bucket.sql` si se prefiere):

```sql
-- Bucket broker-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'broker-images',
  'broker-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- RLS policies
CREATE POLICY "broker_images_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'broker-images');

CREATE POLICY "broker_images_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'broker-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "broker_images_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'broker-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Estructura:** `broker-images/{user_id}/profile/{timestamp}-{rand}.{ext}`

---

## 8. FLUJO COMPLETO

### 8.1 Broker completa su perfil

```
1. Broker autenticado → /app → sidebar "Broker Profile" → /app/broker
2. Server page verifica sesión + role broker (otro role → redirect /app)
3. Carga getMyBroker(user.id) + cities del operating_country
4. Form: si no existe row → "Create Broker Profile"; si existe → "Save Changes"
5. Campos: name, slug (auto), profile_image, personal_url, description (TipTap), city, email, phone, whatsapp, closed_transactions
6. Save → saveBrokerProfile() → upsert en broker_profiles (RLS del owner)
7. router.refresh()
```

### 8.2 Inversor ve perfil del broker desde propiedad

```
1. Inversor en /[locale]/property/[slug]
2. PropertySidebar muestra nombre del vendedor
3. Si listed_by_type === "broker" → link a /broker/{brokerSlug}
4. Navega a /[locale]/broker/[slug]
5. Server component: getBrokerBySlug(slug) + query propiedades activas
6. Render: BrokerHeader (foto circular, nombre, stats, contact) + About + Active Properties
```
