import { Navbar } from "@/components/navbar";
import { HeroHeader } from "@/components/hero-header";
import { FeaturesSection } from "@/components/features-section";
import { AboutSection } from "@/components/about-section";
import { FaqSection } from "@/components/faq-section";
import { ContactBanner } from "@/components/contact-banner";
import { Footer } from "@/components/footer";

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
