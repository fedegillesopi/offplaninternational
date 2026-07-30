import Image from "next/image"
import { Link } from "@/i18n/navigation"
import type { MarketNewsArticle, MarketNewsCardSize } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MarketNewsCardProps {
  article: MarketNewsArticle
  size: MarketNewsCardSize
}

const spanMap: Record<MarketNewsCardSize, string> = {
  sm: "lg:col-span-1",
  md: "lg:col-span-2",
  lg: "lg:col-span-3",
}

export function MarketNewsCard({ article, size }: MarketNewsCardProps) {
  return (
    <Link
      href={`/market-news/${article.slug}`}
      className={cn(
        "group flex flex-col no-underline",
        spanMap[size],
      )}
    >
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={size === "md" ? 400 : 350}
          className={cn(
            "w-full object-cover transition-transform duration-300 group-hover:scale-105",
            size === "md" ? "h-[260px] md:h-[320px]" : "h-[220px]",
          )}
        />
      </div>

      <div className="flex flex-col gap-2 px-1 pb-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-body text-xs text-[--grey-400]">{article.author}</span>
          <span className="font-body text-xs text-[--grey-400]">{article.date}</span>
        </div>
        <span className="font-body text-xs font-medium uppercase tracking-wider text-[--primary-main]">
          {article.category}
        </span>
        <h3 className="font-heading text-xl font-semibold text-[--text-primary] leading-snug transition-colors group-hover:text-[--primary-main]">
          {article.title}
        </h3>
        <p className="font-body text-sm leading-relaxed text-[--grey-300] line-clamp-2">
          {article.description}
        </p>
      </div>
    </Link>
  )
}
