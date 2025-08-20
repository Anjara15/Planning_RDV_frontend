//pages afficher en première vues
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Shield, Users } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 medical-gradient opacity-95"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-white/15"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full bg-white/25"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full bg-white/20"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
              Prenez rendez-vous
              <span className="block text-secondary-light">en un clic</span>
            </h1>
            <p className="text-xl md:text-2xl text-black/90 max-w-2xl mx-auto leading-relaxed">
              Simplifiez vos consultations médicales avec notre plateforme moderne 
              de prise de rendez-vous en ligne
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};