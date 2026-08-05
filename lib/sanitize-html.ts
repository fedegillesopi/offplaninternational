// Sanitizadores HTML allowlist (sin dependencias externas).
// `sanitizeHtml`: contenido curado por el equipo (descripciones de communities
// importadas desde Webflow).
// `sanitizeUserHtml`: contenido user-generated (descripciones de developers
// editadas con TipTap). Aplicar en cliente y en servidor antes de persistir.
//
// Ambos siguen el mismo núcleo: los tags COMPLETOS `<...>` se extraen y se
// reconstruyen solo si están en el allowlist; todo lo demás (texto, tags
// truncados sin `>`) se escapa a entidades, de modo que un tag sin cerrar no
// puede conservar atributos al ser reparseado por el navegador.

const ALLOWED_TAGS = new Set([
  "h4",
  "p",
  "strong",
  "em",
  "br",
  "ul",
  "ol",
  "li",
  "blockquote",
  "div",
  "span",
]);

const BLOCK_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "link",
  "meta",
  "svg",
  "math",
  "video",
  "audio",
  "source",
  "img",
  "figure",
  "figcaption",
  "template",
  "noscript",
  "a",
]);

const BLOCK_TAGS_PATTERN = [...BLOCK_TAGS].join("|");

// Tags permitidos para contenido user-generated (descripciones de developers
// editadas con TipTap). El allowlist es mínimo: solo lo que produce el editor.
const USER_ALLOWED_TAGS = new Set([
  "p",
  "strong",
  "em",
  "br",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "h3",
  "img",
]);

// Bloqueados de user-generated: igual que BLOCK_TAGS pero se permite <img>
// (valida hostname + atributos por separado en sanitizeImgTag).
const USER_BLOCK_TAGS = new Set([...BLOCK_TAGS].filter((tag) => tag !== "img"));
const USER_BLOCK_TAGS_PATTERN = [...USER_BLOCK_TAGS].join("|");

const SUPABASE_IMAGE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
})();

const TAG_TOKEN = "\u0000OPI_TAG_";

function getAttr(attrs: string, name: string): string {
  const match = attrs.match(
    new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, "i"),
  );
  return (match?.[2] ?? match?.[3] ?? "").trim();
}

function isAllowedImageSrc(src: string): boolean {
  if (!/^https:\/\//i.test(src)) return false;
  if (!SUPABASE_IMAGE_HOST) return false;
  try {
    return new URL(src).origin === `https://${SUPABASE_IMAGE_HOST}`;
  } catch {
    return false;
  }
}

// Reconstruye <img> solo con src y alt validados. El src emitido se re-escapa
// por si el valor original llegó con comillas/ángulos vía atributo de un solo
// quote (defensa en profundidad contra salida del atributo).
function sanitizeImgTag(attrs: string): string {
  const src = getAttr(attrs, "src").replace(/["<>]/g, "");
  if (!src || !isAllowedImageSrc(src)) return "";
  const alt = getAttr(attrs, "alt").replace(/["<>]/g, "");
  return alt ? `<img src="${src}" alt="${alt}">` : `<img src="${src}">`;
}

// Neutraliza entidades que podrían intentar construir tags en otros
// contextos (ej. `&#x3c;script&#x3e;`), convirtiéndolas a texto seguro.
function neutralizeEntities(html: string): string {
  return html.replace(
    /&(#x0*3c|#0*60|lt|#x0*3e|#0*62|gt);/gi,
    (entity) => {
      const lower = entity.toLowerCase();
      if (
        lower.endsWith("lt;") ||
        lower.endsWith("3c;") ||
        lower.endsWith("60;")
      ) {
        return "&amp;lt;";
      }
      return "&amp;gt;";
    },
  );
}

function processHtml(
  html: string,
  allowedTags: Set<string>,
  blockTagsPattern: string,
  rebuildTag: (close: string, name: string, attrs: string) => string,
): string {
  let out = html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Bloquea tags peligrosos COMPLETOS (incluido su contenido).
  out = out.replace(
    new RegExp(`<(${blockTagsPattern})[^>]*>[\\s\\S]*?</\\1>`, "gi"),
    "",
  );

  out = out.replace(
    new RegExp(`<(${blockTagsPattern})[^>]*/?>`, "gi"),
    "",
  );

  // Extrae los tags completos restantes y los reemplaza por tokens, luego
  // escapa TODO `<`/`>` del texto. Un tag truncado (sin `>`) no se extrae y
  // queda como texto escapado → no puede conservar atributos.
  const tags: string[] = [];
  out = out.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g,
    (match) => {
      tags.push(match);
      return `${TAG_TOKEN}${tags.length - 1}\u0000`;
    },
  );

  out = out.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  out = out.replace(
    new RegExp(`${TAG_TOKEN}(\\d+)\\u0000`, "g"),
    (_, index) => {
      const raw = tags[Number(index)];
      const match = raw.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9]*)([\s\S]*)$/);
      if (!match) return "";
      const name = match[2].toLowerCase();
      if (!allowedTags.has(name)) return "";
      return rebuildTag(match[1], name, match[3]);
    },
  );

  return neutralizeEntities(out);
}

/**
 * Sanitizador para contenido user-generated (descripción de developers).
 * Allowlist estricto de tags y atributos; las imágenes solo pueden apuntar
 * al origin de Supabase Storage. Aplicar en cliente y en servidor antes de
 * persistir.
 */
export function sanitizeUserHtml(html: string): string {
  return processHtml(
    html,
    USER_ALLOWED_TAGS,
    USER_BLOCK_TAGS_PATTERN,
    (close, name, attrs) =>
      name === "img" ? sanitizeImgTag(attrs) : `<${close}${name}>`,
  );
}

export function sanitizeHtml(html: string): string {
  return processHtml(
    html,
    ALLOWED_TAGS,
    BLOCK_TAGS_PATTERN,
    (close, name) => `<${close}${name}>`,
  );
}
