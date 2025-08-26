import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { AproposSection } from "@/components/sections/AproposSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <DoctorsSection />
        {/* <AppointmentSection /> */}
        <AproposSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
