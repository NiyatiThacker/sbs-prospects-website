import ContactHero from "@/components/sections/contact/ContactHero";
import ContactInfoMap from "@/components/sections/contact/ContactInfoMap";
import ContactForm from "@/components/sections/contact/ContactForm";
import ConsulationCTA from "@/components/sections/contact/ConsulationCTA";


export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ConsulationCTA />
      <ContactForm />
      <ContactInfoMap />
    
    </>
  );
}