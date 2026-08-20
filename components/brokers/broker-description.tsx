import { sanitizeUserHtml } from "@/lib/sanitize-html"
import { isHtmlText } from "@/lib/utils"
import { splitBold } from "@/lib/rich-text"

export function BrokerDescription({ text }: { text: string }) {
  if (isHtmlText(text)) {
    return (
      <div
        className="rich-description"
        dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(text) }}
      />
    )
  }

  return (
    <p className="font-body text-base font-light leading-relaxed text-[--text-primary] whitespace-pre-line">
      {splitBold(text)}
    </p>
  )
}
