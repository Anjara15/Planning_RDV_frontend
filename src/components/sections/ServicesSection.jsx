import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Heart,
  Baby,
  Eye,
  Bone,
  Brain,
  Clock,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Médecine Générale",
    description: "Consultations de routine, suivi médical, vaccinations et soins préventifs",
    available: true,
  },
  {
    icon: Heart,
    title: "Cardiologie",
    description: "Dépistage et suivi des maladies cardiovasculaires, ECG, échographie cardiaque",
    available: true,
  },
  {
    icon: Baby,
    title: "Pédiatrie",
    description: "Soins spécialisés pour enfants, suivi de croissance, vaccinations pédiatriques",
    available: true,
  },
  {
    icon: Eye,
    title: "Ophtalmologie",
    description: "Examens de la vue, dépistage du glaucome, suivi des troubles visuels",
    available: false,
  },
  {
    icon: Bone,
    title: "Orthopédie",
    description: "Traumatologie, rhumatologie, suivi des troubles musculo-squelettiques",
    available: true,
  },
  {
    icon: Brain,
    title: "Neurologie",
    description: "Diagnostic et suivi des troubles neurologiques, maux de tête, épilepsie",
    available: true,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="relative py-16 lg:py-24 bg-gray-50 overflow-hidden">
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
        {/* Section Header */}
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
            Nos Spécialités
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Une équipe de médecins spécialisés pour répondre à tous vos besoins de santé
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className={`group relative bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-500 ease-in-out border border-gray-100 hover:border-blue-500/40 hover:-translate-y-2 ${
                  !service.available ? "opacity-70" : ""
                }`}
                role="region"
                aria-labelledby={`service-title-${index}`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100/60 group-hover:bg-blue-200/60 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    {!service.available && (
                      <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700">
                        Bientôt
                      </Badge>
                    )}
                  </div>
                  <CardTitle
                    id={`service-title-${index}`}
                    className="text-xl font-semibold text-gray-900"
                  >
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    {service.duration && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                    {service.price && (
                      <div className="font-semibold text-blue-600">
                        {service.price}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};