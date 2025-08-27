import { Button } from "@/components/ui/button";
import { Calendar, Clock, Shield, Users } from "lucide-react";
import HeroImage from "@/assets/heroImage.png";

export const HeroSection = () => {
  return (
    <section className="relative flex items-start justify-between overflow-hidden bg-gray-50 py-12 lg:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 opacity-90"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/15 animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-white/25 animate-pulse delay-600"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-white/20 animate-pulse delay-900"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 max-w-full">
          <div className="lg:w-1/2 text-center lg:text-left space-y-8 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Prenez rendez-vous
              <span className="block text-blue-600">en un clic</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-lg leading-relaxed">
              Simplifiez vos consultations médicales avec notre plateforme intuitive 
              et sécurisée pour une prise de rendez-vous en ligne.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Découvrir nos services
            </Button>
          </div>
          <div className="lg:w-1/2 relative animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={HeroImage}
                alt="Professionnel de santé en consultation"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Votre santé, notre priorité</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};