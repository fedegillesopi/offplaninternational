import { Fragment } from "react";
import { sanitizeUserHtml } from "@/lib/sanitize-html";
import { isHtmlText } from "@/lib/utils";

function splitBold(text: string): React.ReactNode[] {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index}>{part}</strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

export function DeveloperDescription({ text }: { text: string }) {
  if (isHtmlText(text)) {
    return (
      <div
        className="developer-description"
        dangerouslySetInnerHTML={{ __html: sanitizeUserHtml(text) }}
      />
    );
  }

  return (
    <p className="font-body text-base font-light leading-relaxed text-[--text-primary] whitespace-pre-line">
      {splitBold(text)}
    </p>
  );
}
