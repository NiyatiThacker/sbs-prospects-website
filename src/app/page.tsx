import ScrollProgress from "@/components/animations/ScrollProgress";
import HeroSection from "@/components/sections/home/HeroSection";
import TrustBar from "@/components/sections/home/TrustBar";
import ServicesSection from "@/components/sections/home/ServicesSection";
import WhyChooseUs from "@/components/sections/home/WhyChooseSbs";
import Testimonials from "@/components/sections/home/Testimonials";
import FAQSection from "@/components/sections/home/FAQSection";
import CTABanner from "@/components/sections/home/CTABanner";

export default function HomePage() {
  return (
    <main className="bg-sbs-cream">
      <ScrollProgress />
      <HeroSection />
      <TrustBar />
      <ServicesSection />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </main>
  );
}
