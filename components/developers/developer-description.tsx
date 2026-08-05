import { Fragment } from "react";

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
  return (
    <p className="font-body text-base font-light leading-relaxed text-[--text-primary] whitespace-pre-line">
      {splitBold(text)}
    </p>
  );
}
