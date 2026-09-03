import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  backHref?: string
  backLabel?: string
  className?: string
}

export function PageHeader({
  title,
  backHref,
  backLabel,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {backLabel ?? "Back"}
        </Link>
      )}
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  )
}
