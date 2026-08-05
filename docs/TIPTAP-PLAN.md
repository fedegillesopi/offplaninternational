# Plan: Integrar TipTap para la descripción del Developer Profile

## Contexto

La descripción del developer se edita hoy con un `<textarea>` + botón Bold que
envuelve el texto en `**texto**` (markdown-lite propio). Se guarda texto plano en
`developers.description` (TEXT) y se renderiza en la página pública con
`DeveloperDescription` (split de `**` + `whitespace-pre-line`).

El usuario eligió **TipTap** para reemplazar esta solución. TipTap v3 soporta
React 19 (proyecto usa React 19 + Next 16). El editor vive en un Client
Component, así que no hay fricción de SSR si se usa `immediatelyRender: false`.

## Alcance del editor (MVP)

Toolbar: **Bold**, *Italic*, H3 (subtítulo), Bullet list, Ordered list,
Blockquote, e inserción de **imagen** (subida a Supabase Storage vía flujo de
`ImageUpload` existente). Los **links** quedan fuera del MVP: el campo Website
ya cubre el enlace externo, y así se reduce la superficie de sanitización. (Nota
futura: `@tiptap/extension-link` + validación de href).

## Dependencias

```sh
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-placeholder @tiptap/extension-image
```

- `@tiptap/pm` se instala explícito (peer de `@tiptap/react`).
- Solo se carga en `/app/developer` (ruta del form); impacto de bundle contenido.

## Cambios

### 1. `lib/storage.ts` (nuevo)
Extraer la subida a Supabase Storage que hoy vive inline en
`components/platform/image-upload.tsx` a una función reutilizable:
`uploadImage(file, userId, folder) => string` (retorna la URL pública).
`ImageUpload` pasa a usar esta función; el editor la usa para insertar imágenes.

**Dónde se guardan las imágenes de la descripción**: no hay columna en la tabla
(la tabla `developers` solo tiene `cover_image` y `logo_url`). Se suben al mismo
bucket público `developer-images` en la carpeta `{userId}/description/...`
(cumple la RLS actual: `(storage.foldername(name))[1] = auth.uid()`), y la URL
queda embebida como `<img src="...">` dentro del HTML de `developers.description`.
La columna `description` persiste el HTML completo, imágenes incluidas. Sin
migración de tabla ni de bucket.

### 2. `components/platform/rich-text-editor.tsx` (nuevo, "use client")
- `useEditor` con `StarterKit` + `Placeholder` + `Image`, `immediatelyRender: false`.
- Props: `value`, `onChange(html)`, `placeholder`.
- Toolbar con botones (activos según `editor.isActive(...)`), reutilizando
  `Button`/iconos lucide.
- Botón imagen: file input oculto → `uploadImage` → `editor.chain().focus().setImage({ src, alt })`.
- CSS del contenido con `.ProseMirror` (ver punto 5).

### 3. `components/platform/developer-form.tsx` (modificar)
- Reemplazar `<textarea>` + toolbar Bold por `RichTextEditor`.
- Inicializar con HTML normalizado desde el valor guardado:
  `normalizeToEditorHtml(description)` — si el valor trae `**texto**` legacy,
  convertirlo a `<strong>texto</strong>` antes de alimentar el editor.
- `handleSave`: guardar `sanitizeUserHtml(editor.getHTML())`.
- `hasChanges`: comparar `getHTML()` contra el HTML inicial (TipTap normaliza,
  así que la igualdad es estable para el mismo contenido).
- `descriptionRef` ya no se usa → limpiar.

### 4. `lib/sanitize-html.ts` (modificar)
Añadir `sanitizeUserHtml(html)` para contenido user-generated (defensa en
profundidad: se aplica en cliente y de nuevo en servidor):
- Allowlist de tags producidos por el editor: `p, strong, em, br, ul, ol, li,
  blockquote, h2, h3, img`.
- `img`: solo `src` + `alt`; `src` debe ser `https` y hostname de
  `NEXT_PUBLIC_SUPABASE_URL` (el bucket es público). Si no, se elimina la imagen.
- Nada más: se descartan atributos (onclick, style, class, javascript: href…).
- Reutilizar `neutralizeEntities` y el borrado de tags bloqueados existentes.
- El `sanitizeHtml` actual (curado por el equipo) no se toca.

### 5. `lib/developers.ts` (modificar)
En la función de update del developer, aplicar `sanitizeUserHtml` a la
descripción **antes** del `UPDATE` (sanitización server-side, no confiar en la
del cliente).

### 6. `components/developers/developer-description.tsx` (modificar)
- Si el texto contiene HTML (`/</`), renderizar `sanitizeUserHtml(html)` con
  `dangerouslySetInnerHTML` + clases `prose` equivalentes (márgenes, `font-body`,
  estilos de `strong`/`blockquote`/`ul`).
- Si es texto legacy (`**`), mantener el path actual de split. Compatibilidad
  con filas existentes sin migrar la columna.

### 7. `globals.css` (modificar)
Estilos `.ProseMirror` y clases de render del detalle (márgenes de p/ul/ol,
`strong`, `blockquote`, `h2/h3` con `font-heading`) alineados con los design
tokens del proyecto. TipTap no trae CSS por defecto.

### 8. `docs/DEVELOPER-PAGE-FORM.md` (modificar)
Actualizar la decisión: rich text con TipTap (HTML sanitizado) reemplaza
`**bold**`; notas de migración y sanitización.

## Compatibilidad / Migración

- **DB**: no se migra la columna (sigue siendo TEXT).
- **Datos legacy** (`**texto**`): el renderer conserva el path de split, y al
  editar el perfil el form normaliza a HTML antes de abrir el editor.
- **`next.config.ts`**: no requiere cambios; el hostname de Supabase Storage ya
  está en `remotePatterns`.

## Verificación

1. `pnpm lint` y `tsc --noEmit` limpios (ignorar los 2 errores preexistentes de
   `property-filters.tsx`).
2. `pnpm build`.
3. Manual (local, rol developer):
   - Crear/editar descripción con bold, italic, H3, listas, blockquote, imagen.
   - Guardar → recargar el form → contenido preservado.
   - Página pública renderiza el HTML formateado; la imagen se ve.
   - Ataques: `<script>`, atributos `onclick`, href `javascript:`, `<img src="http://evil">`
     se descartan o neutralizan.
   - Una fila legacy con `**bold**` sigue renderizando bien.

## Seguridad (según workflow AGENTS.md)

Tras la implementación, invocar a `security` (sanitización, src de imágenes,
exposición de datos) y `reviewer` (limpieza, patrón de `ImageUpload` refactor,
separación editor/toolbar) antes de integrar.
