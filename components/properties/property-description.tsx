import { sanitizeUserHtml } from "@/lib/sanitize-html"
import { isHtmlText } from "@/lib/utils"
import { splitBold } from "@/lib/rich-text"

// Normaliza saltos de línea literales a <br> dentro de HTML. TipTap puede
// persistir \n reales dentro de un <p>, que el navegador ignora al renderizar
// (se ven pegados). Se aplica antes del sanitizado: <br> está en el allowlist.
function preserveLineBreaks(html: string): string {
  return html.replace(/\r?\n/g, "<br>")
}

export function PropertyDescription({ text }: { text: string }) {
  if (isHtmlText(text)) {
    return (
      <div
        className="rich-description property-description"
        dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(preserveLineBreaks(text)) }}
      />
    )
  }

  return (
    <p className="font-body text-base font-light leading-relaxed text-[--text-primary] whitespace-pre-line">
      {splitBold(text)}
    </p>
  )
}
