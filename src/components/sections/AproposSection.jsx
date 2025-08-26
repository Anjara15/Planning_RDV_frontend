import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, Heart } from "lucide-react";

export const AproposSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Humanité",
      description: "Nous plaçons l'humain au cœur de nos préoccupations avec une approche bienveillante et empathique.",
    },
    {
      icon: Shield,
      title: "Excellence",
      description: "Nous nous engageons à fournir des soins de la plus haute qualité avec les meilleures pratiques médicales.",
    },
    {
      icon: Users,
      title: "Accessibilité",
      description: "Nous rendons les soins de santé accessibles à tous avec des horaires flexibles et des tarifs équitables.",
    },
    {
      icon: Award,
      title: "Notre Mission",
      description: "Offrir à chaque patient des soins de santé de qualité supérieure dans un environnement sécurisé et bienveillant, en utilisant les dernières avancées médicales tout en préservant la dimension humaine de la médecine.",
    },
  ];

  return (
    <section id="about" className="relative py-16 lg:py-24 bg-gray-50 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-80"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/15 animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-white/25 animate-pulse delay-600"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-full bg-white/20 animate-pulse delay-900"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20 animate-fade-in">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
              À Propos de Notre Centre Médical
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Depuis plus de 20 ans, notre centre médical s'engage à offrir des soins 
              de santé exceptionnels dans un environnement moderne et accueillant. 
              Nous combinons expertise médicale de pointe et approche humaine pour 
              garantir le bien-être de nos patients.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Notre équipe pluridisciplinaire de spécialistes travaille en collaboration 
              pour vous offrir un suivi médical complet et personnalisé, adapté à vos 
              besoins spécifiques.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform transform hover:scale-105"
                aria-label="En savoir plus sur notre histoire"
              >
                En savoir plus
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Intérieur d'un centre médical moderne"
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-xl shadow-xl"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
              <div className="text-2xl sm:text-3xl font-bold">20+</div>
              <div className="text-sm">Années d'expérience</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent rounded-xl"></div>
          </div>
        </div>

        {/* Values & Mission Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nos Valeurs et Mission</h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ces principes guident chacune de nos actions et définissent notre engagement envers nos patients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-blue-500/40 hover:shadow-xl transition-all duration-500 ease-in-out hover:-translate-y-2 text-center"
                role="region"
                aria-labelledby={`value-title-${index}`}
              >
                <CardContent className="pt-8 pb-6 space-y-4">
                  <div className="w-16 h-16 bg-blue-100/60 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200/60 transition-colors duration-300">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4
                    id={`value-title-${index}`}
                    className="text-lg font-semibold text-gray-900"
                  >
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};