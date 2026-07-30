import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { MarketNewsSection } from "@/components/site/market-news-section";

export default function MarketNewsPage() {
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main>
        <MarketNewsSection />
      </main>
      <Footer />
    </div>
  );
}
