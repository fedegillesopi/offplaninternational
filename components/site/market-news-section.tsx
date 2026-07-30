import { MarketNewsCard } from "./market-news-card"
import { MarketNewsHighlightCard } from "./market-news-highlight-card"
import { marketNewsItems } from "@/lib/mock-market-news"

export function MarketNewsSection() {
  return (
    <section className="mx-auto max-w-[1440px]">
      <div className="flex flex-col items-center justify-center py-12 px-6 md:px-16 md:py-40 min-h-[300px]">
        <div className="max-w-2xl text-center">
          <h2 className="font-heading text-5xl lg:text-[80px] font-semibold text-[--text-primary] mb-2 md:mb-6">
            Market News
          </h2>
          <p className="font-body text-subtitle-2 text-[--grey-300] leading-relaxed">
            Find out everything our clients have to say and stay ahead with the latest
            market trends, investment insights, and expert analysis on off-plan
            properties across the globe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-start py-12 px-6 md:px-16">
        {marketNewsItems.map((item) =>
          item.size === "lg" ? (
            <MarketNewsHighlightCard
              key={item.data.id}
              article={item.data}
            />
          ) : (
            <MarketNewsCard
              key={item.data.id}
              article={item.data}
              size={item.size}
            />
          ),
        )}
      </div>
    </section>
  )
}
