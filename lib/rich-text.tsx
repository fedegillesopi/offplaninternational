import { Fragment } from "react"

export function splitBold(text: string): React.ReactNode[] {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index}>{part}</strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  )
}
