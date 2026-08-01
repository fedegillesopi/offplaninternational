// Sanitizador allowlist para contenido HTML curado por el equipo
// (descripciones de communities importadas desde Webflow).
// No está diseñado para contenido user-generated.
// Defensa en profundidad: en el próximo re-import del CSV, el HTML
// debería sanitizarse también en el pipeline de importación.

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

// Neutraliza entidades que podrían intentar construir tags en otros
// contextos (ej. `&#x3c;script&#x3e;`), convirtiéndolas a texto seguro.
function neutralizeEntities(html: string): string {
  return html.replace(
    /&(#x0*3c|#0*60|lt|#x0*3e|#0*62|gt);/gi,
    (entity) => {
      const lower = entity.toLowerCase();
      if (lower.endsWith("lt;")) return "&amp;lt;";
      return "&amp;gt;";
    },
  );
}

export function sanitizeHtml(html: string): string {
  let out = html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  out = out.replace(
    new RegExp(
      `<(${BLOCK_TAGS_PATTERN})[^>]*>[\\s\\S]*?</\\1>`,
      "gi",
    ),
    "",
  );

  out = out.replace(
    new RegExp(`<(${BLOCK_TAGS_PATTERN})[^>]*/?>`, "gi"),
    "",
  );

  out = out.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, close, tag) => {
    const name = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return "";
    return `<${close}${name}>`;
  });

  return neutralizeEntities(out);
}
