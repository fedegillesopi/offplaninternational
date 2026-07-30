import type { MarketNewsArticle, MarketNewsCardSize } from "./types";

interface MarketNewsItem {
  size: MarketNewsCardSize;
  data: MarketNewsArticle;
}

export const marketNewsItems: MarketNewsItem[] = [
  {
    size: "lg",
    data: {
      id: "1",
      slug: "dubai-real-estate-2026-outlook",
      title: "Dubai Real Estate 2026: Record-Breaking Year for Off-Plan Sales",
      description:
        "Dubai's off-plan market is set to reach new heights in 2026, with a 45% surge in new project launches and unprecedented demand from international investors seeking high-yield opportunities in prime locations.",
      body:
        "Dubai's off-plan property market continues its remarkable trajectory in 2026, building on the momentum of previous years. According to latest market data, new project launches have surged by 45% compared to the same period last year, with total transaction values exceeding AED 50 billion in the first quarter alone.\n\n" +
        "The surge is driven by a combination of factors including favourable visa reforms, a stable regulatory environment, and growing confidence among international investors. Areas such as Dubai Creek Harbour, Dubai South, and Jumeirah Village Circle are seeing particularly strong demand, with off-plan units in these communities selling out within weeks of launch.\n\n" +
        "Developers are responding to demand with innovative payment plans and attractive post-handover options, making off-plan investment more accessible than ever. Industry experts predict that the market will maintain its growth trajectory throughout the year, driven by upcoming Expo City legacy projects and Dubai's expanding tourism and business sectors.\n\n" +
        "For investors, the key is to act quickly on well-researched opportunities and partner with verified developers who have a strong track record of on-time delivery. With the right strategy, 2026 presents unprecedented opportunities in Dubai's off-plan market.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "Sarah Mitchell",
      date: "March 15, 2026",
      category: "Market Analysis",
    },
  },
  {
    size: "sm",
    data: {
      id: "2",
      slug: "golden-visa-impact-property",
      title: "How Golden Visa Changes Are Shaping Property Investment",
      description:
        "Recent updates to the UAE Golden Visa program are driving a new wave of long-term property investments across the Emirates.",
      body:
        "The UAE Golden Visa program has undergone significant enhancements in 2026, expanding eligibility criteria and reducing minimum investment thresholds. These changes are having a direct impact on the off-plan property market, with more international buyers entering the market.\n\n" +
        "Under the updated regulations, investors can now qualify for a 10-year renewable visa with a property investment starting from AED 2 million across multiple units rather than a single property. This flexibility has opened the door for investors to diversify their portfolios while securing long-term residency. Real estate consultants report a 30% increase in enquiries from Golden Visa seekers since the changes were announced.\n\n" +
        "The impact is particularly noticeable in emerging communities like Dubai South, where more affordable off-plan options allow investors to meet the threshold while still achieving strong capital appreciation potential.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "James Cooper",
      date: "March 12, 2026",
      category: "Regulations",
    },
  },
  {
    size: "sm",
    data: {
      id: "3",
      slug: "off-plan-vs-secondary-market",
      title: "Off-Plan vs Secondary Market: Where Should You Invest?",
      description:
        "A comprehensive comparison of returns, risks, and timelines between off-plan and ready properties in the current market cycle.",
      body:
        "Choosing between off-plan and ready properties is one of the most important decisions an investor can make. Each option presents distinct advantages and considerations that depend on your investment goals, risk tolerance, and timeline.\n\n" +
        "Off-plan properties typically offer lower entry prices, flexible payment plans spread over construction periods, and the highest potential for capital appreciation. Investors who bought off-plan in Dubai Marina or Downtown Dubai during early development stages have seen returns of 200-300% on their initial investment.\n\n" +
        "Ready properties, on the other hand, provide immediate rental income, clearer valuation, and no construction risk. The trade-off is a higher upfront capital requirement and generally lower capital appreciation potential compared to well-chosen off-plan units.\n\n" +
        "Our recommendation is to maintain a balanced approach, allocating a portion of your portfolio to off-plan for growth while keeping ready properties for steady income generation.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "Maria Rodriguez",
      date: "March 10, 2026",
      category: "Investor Guide",
    },
  },
  {
    size: "md",
    data: {
      id: "4",
      slug: "ras-al-khaimah-emerging-market",
      title: "Ras Al Khaimah: The Next Frontier for Off-Plan Investors",
      description:
        "With mega-projects like Wynn Al Marjan Island and a growing tourism sector, Ras Al Khaimah is emerging as a compelling alternative to Dubai for off-plan investors seeking early-entry prices.",
      body:
        "Ras Al Khaimah is experiencing a transformative period in its real estate development journey. The emirate's strategic focus on tourism, led by the groundbreaking Wynn Al Marjan Island resort, has catalysed a wave of residential development that offers attractive entry points for savvy investors.\n\n" +
        "Property prices in RAK remain significantly lower than Dubai equivalents, with off-plan studios starting from AED 400,000 and one-bedroom apartments from AED 600,000. The emirate's natural assets, including beaches, mountains, and the growing Al Marjan Island development, are driving both tourism and residential demand.\n\n" +
        "Several major developers have launched projects in RAK, attracted by lower land costs and supportive government policies. Investors are taking notice of the value proposition, with off-plan sales in the emirate increasing by 60% year-on-year. The potential for capital appreciation as infrastructure and tourism continue to develop makes RAK a compelling addition to any property portfolio.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "Ahmed Al Hashimi",
      date: "March 8, 2026",
      category: "Emerging Markets",
    },
  },
  {
    size: "sm",
    data: {
      id: "5",
      slug: "payment-plan-strategies",
      title: "Smart Payment Plan Strategies for Off-Plan Buyers",
      description:
        "Learn how to leverage developer payment plans to maximize your cash flow and secure premium units with minimal upfront capital.",
      body:
        "One of the most attractive features of off-plan property investment is the flexibility of payment plans offered by developers. Understanding how to structure your payments can significantly enhance your investment returns and cash flow management.\n\n" +
        "Typical payment plans require a 10-20% down payment during booking, followed by instalments spread over the construction period of 2-4 years. Some developers now offer extended plans covering up to 60% of the property value post-handover, allowing investors to secure units with minimal upfront capital.\n\n" +
        "The key strategy is to align payment schedules with your liquidity events. Investors should negotiate for longer payment plans with smaller instalments to maximise leverage. Additionally, many developers offer discounts of 5-10% for higher initial down payments, which can significantly improve overall returns.\n\n" +
        "Always review the penalty clauses for delayed payments and ensure you have a clear understanding of the total cost including registration fees, service charges, and other associated costs before committing to a purchase.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "Emily Watson",
      date: "March 5, 2026",
      category: "Investor Guide",
    },
  },
  {
    size: "sm",
    data: {
      id: "6",
      slug: "sustainable-developments-dubai",
      title: "Sustainable Living: Dubai's Green Development Boom",
      description:
        "Developers are racing to meet ESG standards with eco-friendly communities that promise lower utility costs and higher resale values.",
      body:
        "Sustainability has become a central theme in Dubai's real estate development landscape. Leading developers are incorporating green building standards, energy-efficient systems, and sustainable materials into their projects, responding to growing demand from environmentally conscious buyers.\n\n" +
        "Communities like The Sustainable City, Dubai Hills Estate, and Aljada in Sharjah are setting new benchmarks for eco-friendly living. Features include solar panel installations, grey water recycling systems, electric vehicle charging stations, and extensive green spaces that reduce the urban heat island effect.\n\n" +
        "Studies show that sustainable properties command a 15-20% premium in resale value and have lower vacancy rates compared to conventional developments. Additionally, residents benefit from significantly reduced utility bills, with some communities reporting energy savings of up to 40%.\n\n" +
        "As Dubai prepares for COP28 legacy initiatives, the trend towards sustainable development is expected to accelerate, making green properties an increasingly attractive investment proposition.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "David Chen",
      date: "March 3, 2026",
      category: "Trends",
    },
  },
  {
    size: "md",
    data: {
      id: "7",
      slug: "international-buyers-guide-2026",
      title: "International Buyer's Guide to UAE Property Laws in 2026",
      description:
        "Everything you need to know about freehold ownership, registration fees, visa requirements, and financing options as a foreign investor in the UAE property market.",
      body:
        "The UAE property market continues to offer attractive opportunities for international buyers, supported by a robust legal framework designed to protect investor rights. Understanding the legal landscape is essential for making informed investment decisions.\n\n" +
        "Foreign investors can purchase freehold properties in designated areas across Dubai, Abu Dhabi, and other emirates. The Dubai Land Department (DLD) oversees all property transactions, maintaining a transparent registry that records ownership and ensures title security. All off-plan purchases must be registered with the Real Estate Regulatory Authority (RERA) through the Oqood system.\n\n" +
        "The purchase process involves several steps including reservation agreement, signing the Sale and Purchase Agreement (SPA), registration with DLD, and payment of transfer fees (4% of property value). Additional costs include admin fees, valuation fees, and agent commissions typically ranging from 2-5%.\n\n" +
        "For financing, international buyers can obtain mortgages from UAE banks covering 50-75% of the property value depending on the buyer's profile and the property type. Interest rates are competitive, and many banks offer specialised products for off-plan purchases with flexible repayment terms aligned to construction milestones.",
      image: "/images/miscelaneous/blog-example3.png",
      author: "Sarah Mitchell",
      date: "February 28, 2026",
      category: "Regulations",
    },
  },
];

export function getMarketNewsArticleBySlug(slug: string): MarketNewsArticle | undefined {
  return marketNewsItems.find((item) => item.data.slug === slug)?.data;
}
