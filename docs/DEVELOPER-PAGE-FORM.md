# Plan de implementación — Formulario de página de Developer

## Objetivo

Permitir que un usuario con rol `developer` cree y edite su página pública de promotora desde la plataforma (`/app`), matcheando los campos de la tabla `developers` con los que renderizan la DeveloperCard (listado) y la página de detalle (`/[locale]/developer/[slug]`).

## Estado actual

- El listado `app/[locale]/developers/page.tsx` usa un array hardcodeado (Emaar, Nakheel).
- El detalle `app/[locale]/developer/[slug]/page.tsx` usa `mockDevelopersDetail` de `lib/mock-developers-detail.ts`.
- La tabla `developers` (migración 007) ya tiene: `name`, `slug`, `logo_url`, `website`, `description`, `country`, `is_verified`, `user_profile_id`.
- RLS actual de `developers`: SELECT público (solo verificados) y SELECT propio. **No hay INSERT/UPDATE desde cliente** (solo service_role).

## Mapeo de campos

| Campo UI | DeveloperCard | Detail (mock) | `developers` (DB) | `user_profiles` | Acción |
|---|---|---|---|---|---|
| name | ✓ | ✓ | `name` | `company_name` | Form → `developers.name` |
| slug | ✓ | ✓ | `slug` | — | Auto-generado desde name (slugify + unicidad) |
| description | ✓ | ✓ | `description` | — | Form (textarea) |
| image (cover) | ✓ | ✓ | ✗ no existe | — | **Migración 011: `cover_image`** |
| logo | ✓ | ✓ | `logo_url` | — | Form → `logo_url` |
| location | — | ✓ | `country` | `operating_country` | **Migración 011: `city`**; location = `${country}, ${city}` |
| onTimeCompletion | — | ✓ | ✗ no existe | — | **Migración 011: `on_time_completion`** |
| email | — | ✓ | ✗ no existe | `email` | **Migración 011: `email`** |
| phone | — | ✓ | ✗ no existe | `phone` | **Migración 011: `phone`** |
| website | — | ✓ | `website` | `company_website` | Form → `developers.website` |

**Decisión:** se agregan `email` y `phone` a `developers` (copia) en vez de leerlos con JOIN de `user_profiles`. Razón: el detail page es server-rendered independiente del usuario auth, el shape de `DeveloperDetailData` espera esos campos flat, y el form queda autocontenido. Coherente con el patrón flat de `PropertyData`.

## Migración 011 — `supabase/migrations/011_developers_page_fields.sql`

```sql
ALTER TABLE developers
  ADD COLUMN cover_image text,
  ADD COLUMN city text,
  ADD COLUMN on_time_completion integer,
  ADD COLUMN email text,
  ADD COLUMN phone text;

ALTER TABLE developers
  ADD CONSTRAINT developers_user_profile_id_unique UNIQUE (user_profile_id);

CREATE POLICY "Developer can insert own page"
  ON developers FOR INSERT TO authenticated
  WITH CHECK (user_profile_id = auth.uid());

CREATE POLICY "Developer can update own page"
  ON developers FOR UPDATE TO authenticated
  USING (user_profile_id = auth.uid());
```

- `UNIQUE (user_profile_id)`: una sola página por usuario; habilita upsert seguro.
- `user_profile_id = auth.uid()` funciona porque `user_profiles.id` es FK a `auth.users.id`.
- `on_time_completion` como `integer` (porcentaje 0–100). Validar rango en el form y opcionalmente CHECK en la migración.

## Data access — `lib/developers.ts` (nuevo)

```ts
getDevelopers(): Promise<DeveloperCardProps[]>        // is_verified = true, mapeo → card
getDeveloperBySlug(slug): Promise<DeveloperDetailData | null>  // maybeSingle → detail
getMyDeveloper(userProfileId): Promise<Developer | null>       // para el form
```

- Mapeo card: `image → cover_image`, `logo → logo_url`.
- Mapeo detail: `location = [country, city].filter(Boolean).join(", ")`, `onTimeCompletion → on_time_completion`.
- Patrón idéntico a `lib/communities.ts` (server client por llamada).

## Formulario — `components/platform/developer-form.tsx` (nuevo, client)

Página: `/app/developer` + entrada en sidebar (solo role `developer`).

Campos:
- Company Name → `name` (requerido)
- Slug (auto, read-only, regenerado al cambiar name, con botón copy de la URL pública)
- Tagline/Description → `description` (textarea)
- Country → default `operating_country` del perfil (read-only)
- City → dropdown con ciudades de la tabla `cities` filtradas por `operating_country` (seed curado por país)
- Cover Image → `cover_image` (ImageUpload a bucket `developer-images`)
- Logo → `logo_url` (ImageUpload a bucket `developer-images`)
- Website → `website` (precargado desde `profile.company_website`)
- On-time completion (%) → `on_time_completion` (número 0–100)
- Email → `email` (precargado desde `profile.email`)
- Phone → `phone` (precargado desde `profile.phone`)

Comportamiento:
1. Cargar `getMyDeveloper(userProfileId)`.
2. Si no existe → INSERT con `user_profile_id = auth.uid()` y `is_verified = false`.
3. Si existe → UPDATE.
4. Slugify: `name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-")` — slug siempre autogenerado desde el nombre, read-only; botón copy copia `${origin}/developer/{slug}`.
5. Banner de estado: si `is_verified = false` → "Pendiente de verificación. Tu página se publicará al ser aprobada." (el listado público solo muestra verificados).

Estilos hardcoded en inglés (convención de plataforma sin i18n, como `profile-form.tsx`).

## Conectar páginas públicas (quitar mock)

| Archivo | Cambio |
|---|---|
| `app/[locale]/developers/page.tsx` | Reemplazar array hardcodeado por `getDevelopers()`; habilitar búsqueda client-side (patrón `communities-grid.tsx`) |
| `app/[locale]/developer/[slug]/page.tsx` | Reemplazar `getDeveloperBySlug` de mock por `getDeveloperBySlug()` de `lib/developers.ts` |
| `lib/mock-developers-detail.ts` | Eliminar (como se hizo con `mock-communities.ts`) |
| `lib/types.ts` | `DeveloperDetailData` pasa a definirse en `lib/developers.ts` (patrón `Community`) |

## Sidebar

`components/platform/app-sidebar.tsx` → `NAV_BY_ROLE.developer` agrega:
```
{ href: "/app/developer", label: "Developer Profile", icon: BriefcaseBusiness }
```

## Ciudades por país

- Migración 013: tabla `cities` (country, name, UNIQUE(country, name), RLS select público).
- Seed `supabase/seed/cities.sql`: ciudades curadas para AE, AR, BR, ES, GB, ID, ME, MX, PT (los países de `COUNTRY_OPTIONS`).
- `lib/cities.ts`: `getCitiesByCountry(country)` → lista ordenada por nombre.
- El dropdown solo muestra ciudades del `operating_country` del usuario; si el developer ya tiene una city fuera de la lista, se agrega como opción extra.

## Imágenes

- Migración 012: bucket `developer-images` (público, 5MB, jpeg/png/webp) con políticas SELECT público e INSERT/DELETE en carpeta del propio usuario.
- `components/platform/image-upload.tsx`: sube a `developer-images/{userId}/{folder}/{timestamp}-{rand}.{ext}`, preview con next/image y botón de borrar.
- `next.config.ts`: `remotePatterns` agrega el hostname de `NEXT_PUBLIC_SUPABASE_URL` para servir las imágenes subidas.

## Nota (seguimiento)

El CTA "See properties" de `developer-info-card.tsx` apunta a `/properties-list?developer={slug}` — ruta inexistente (mismo problema que el CTA de communities). Fuera de scope de este plan.

## Resumen de archivos

### Archivos nuevos (7)
| Ruta | Tipo |
|---|---|
| `supabase/migrations/011_developers_page_fields.sql` | Migración |
| `supabase/migrations/012_developer_images_bucket.sql` | Migración (bucket) |
| `supabase/migrations/013_cities.sql` | Migración (tabla cities) |
| `supabase/seed/cities.sql` | Seed de ciudades |
| `lib/developers.ts` | Data access + tipos |
| `lib/cities.ts` | Data access de ciudades |
| `components/platform/developer-form.tsx` | Form client |
| `components/platform/image-upload.tsx` | Upload de imágenes |

### Archivos a modificar (5)
| Ruta | Cambio |
|---|---|
| `app/app/developer/page.tsx` | Página del form (server, auth guard + getMyDeveloper + getCitiesByCountry) |
| `components/platform/app-sidebar.tsx` | Nav item "Developer Profile" para role developer (icono BriefcaseBusiness) |
| `app/[locale]/developers/page.tsx` | Conectar a DB + búsqueda |
| `app/[locale]/developer/[slug]/page.tsx` | Conectar a DB |
| `next.config.ts` | remotePatterns con hostname de Supabase |

### Archivos a eliminar (1)
| Ruta | Motivo |
|---|---|
| `lib/mock-developers-detail.ts` | Reemplazado por data access a DB |

## Verificación

1. Ejecutar migraciones 011, 012 y 013 en SQL Editor + seed `supabase/seed/cities.sql`.
2. `pnpm lint` y `npx tsc --noEmit`.
3. Con usuario developer: crear página en `/app/developer`, confirmar INSERT/UPDATE (RLS), subir cover/logo, ver banner de pendiente.
4. Verificar que la página NO aparece en `/developers` hasta `is_verified = true` (setear manualmente en SQL Editor para probar).
