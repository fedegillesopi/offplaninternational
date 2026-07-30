import Image from "next/image"
import { Link } from "@/i18n/navigation"
import type { MarketNewsArticle } from "@/lib/types"

interface MarketNewsHighlightCardProps {
  article: MarketNewsArticle
}

export function MarketNewsHighlightCard({ article }: MarketNewsHighlightCardProps) {
  return (
    <Link
      href={`/market-news/${article.slug}`}
      className="group flex gap-4 no-underline lg:col-span-3"
    >
      <div className="flex-2 relative mb-5 overflow-hidden rounded-xl">
        <Image
          src={article.image}
          alt={article.title}
          width={1200}
          height={500}
          className="h-[300px] w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-[400px]"
        />
      </div>
      <div className="flex-1 flex flex-col gap-3 px-1 pb-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-body text-xs text-[--grey-400]">{article.author}</span>
          <span className="font-body text-xs text-[--grey-400]">{article.date}</span>
        </div>
        <span className="font-body text-xs font-medium uppercase tracking-wider text-[--primary-main]">
          {article.category}
        </span>
        <h3 className="font-heading text-2xl font-semibold text-[--text-primary] leading-snug transition-colors group-hover:text-[--primary-main] md:text-3xl">
          {article.title}
        </h3>
        <p className="font-body text-sm leading-relaxed text-[--grey-300] line-clamp-3">
          {article.description}
        </p>
      </div>
    </Link>
  )
}
