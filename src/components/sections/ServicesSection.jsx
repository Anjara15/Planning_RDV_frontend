import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Heart, 
  Baby, 
  Eye, 
  Bone, 
  Brain, 
  Clock, 
  MapPin,
  Calendar
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Médecine Générale",
    description: "Consultations de routine, suivi médical, vaccinations et soins préventifs",
    // duration: "30 min",
    // price: "25€",
    available: true
  },
  {
    icon: Heart,
    title: "Cardiologie",
    description: "Dépistage et suivi des maladies cardiovasculaires, ECG, échographie cardiaque",
    // duration: "45 min",
    // price: "60€",
    available: true
  },
  {
    icon: Baby,
    title: "Pédiatrie",
    description: "Soins spécialisés pour enfants, suivi de croissance, vaccinations pédiatriques",
    // duration: "30 min",
    // price: "30€",
    available: true
  },
  {
    icon: Eye,
    title: "Ophtalmologie",
    description: "Examens de la vue, dépistage du glaucome, suivi des troubles visuels",
    duration: "30 min",
    // price: "45€",
    available: false
  },
  {
    icon: Bone,
    title: "Orthopédie",
    description: "Traumatologie, rhumatologie, suivi des troubles musculo-squelettiques",
    duration: "45 min",
    // price: "55€",
    available: true
  },
  {
    icon: Brain,
    title: "Neurologie",
    description: "Diagnostic et suivi des troubles neurologiques, maux de tête, épilepsie",
    duration: "60 min",
    // price: "70€",
    available: true
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Nos Spécialités
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une équipe de médecins spécialisés pour répondre à tous vos besoins de santé
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className={`group hover:shadow-lg transition-all duration-300 medical-card ${
                  service.available 
                    ? 'hover:border-primary/20 hover:-translate-y-1' 
                    : 'opacity-60'
                }`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    {!service.available && (
                      <Badge variant="secondary" className="text-xs">
                        Bientôt
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    {/* <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div> */}
                    <div className="font-semibold text-primary">
                      {service.price}
                    </div>
                  </div>
                  
                  {/* <Button 
                    className="w-full"
                    disabled={!service.available}
                    variant={service.available ? "default" : "secondary"}
                  >
                    {/* <Calendar className="w-4 h-4 mr-2" /> 
                    {/* {service.available ? "Prendre RDV" : "Bientôt disponible"} 
                  </Button> */}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Info */}
        {/* <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <Clock className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">Horaires flexibles</h3>
            <p className="text-muted-foreground text-sm">
              Lun-Ven: 8h-19h<br />
              Sam: 9h-17h
            </p>
          </div>
          
          <div className="text-center space-y-2">
            <MapPin className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">Localisation</h3>
            {/* <p className="text-muted-foreground text-sm">
              123 Avenue de la Santé<br />
              75001 Paris
            </p> 
          </div>
          
          <div className="text-center space-y-2">
            <Heart className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">Urgences</h3>
            {/* <p className="text-muted-foreground text-sm">
              24/7 disponible<br />
              +33 1 23 45 67 89
            </p> 
          </div>
        </div> */}
      </div>
    </section>
  );
};