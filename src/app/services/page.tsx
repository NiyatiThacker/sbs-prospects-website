import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesIntro from "@/components/sections/services/ServicesIntro";
import ServicesSection from "@/components/sections/services/ServicesSection";
import WhyChooseServices from "@/components/sections/services/WhyChooseServices";
import ServicesCTA from "@/components/sections/services/ServicesCTA";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServicesIntro />
      <ServicesSection />
      <WhyChooseServices />
      <ServicesCTA />
      <WhatsAppFloat />
    </main>
  );
}