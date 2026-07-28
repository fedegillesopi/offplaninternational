import { Navbar } from "@/components/site/navbar";
import { HeroHeader } from "@/components/site/hero-header";
import { FeaturesSection } from "@/components/site/features-section";
import { AboutSection } from "@/components/site/about-section";
import { FaqSection } from "@/components/site/faq-section";
import { ContactBanner } from "@/components/site/contact-banner";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <div className="body-wrapper mx-auto w-full">
      <Navbar />
      <main>
        <HeroHeader />
      </main>
      <FeaturesSection />
      <AboutSection />
      <FaqSection />
      <ContactBanner />
      <Footer />
    </div>
  );
}
