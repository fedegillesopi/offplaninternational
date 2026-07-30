import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToHome } from "@/components/site/back-to-home";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { ContactBanner } from "@/components/site/contact-banner";
import { getMarketNewsArticleBySlug } from "@/lib/mock-market-news";
import { Separator } from "@/components/ui/separator";

export default async function MarketNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getMarketNewsArticleBySlug(slug);

  if (!article) notFound();

  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main className="mx-auto w-full max-w-[820px] px-3 py-6 md:px-4 md:py-10 lg:px-6 lg:py-12">
        <div className="mb-6 flex items-center  gap-4">
          <BackToHome href="/market-news" label="Back to list" />
          <Breadcrumb
            items={[
              { label: "Market News", href: "/market-news" },
              { label: article.title },
            ]}
          />
        </div>

        <Separator className="mb-4" />

        <h1 className="font-heading text-h2 font-bold text-[--text-primary] leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <span className="font-body text-sm text-[--grey-400]">{article.author}</span>
          <span className="text-[--grey-300]">·</span>
          <span className="font-body text-xs font-medium uppercase tracking-wider text-[--primary-main]">
            {article.category}
          </span>
          <span className="text-[--grey-300]">·</span>
          <span className="font-body text-sm text-[--grey-400]">{article.date}</span>
        </div>

        <div className="relative mb-10 overflow-hidden rounded-xl">
          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={600}
            className="h-[300px] w-full object-cover md:h-[450px]"
          />
        </div>

        <div className="font-body text-base leading-relaxed text-[--text-primary] space-y-5">
          {article.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </main>
      <ContactBanner />
      <Footer />
    </div>
  );
}
