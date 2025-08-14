import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, MapPin, Clock } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Marie Dubois",
    specialty: "Médecine Générale",
    experience: "15 ans",
    languages: ["Français", "Anglais"],
    location: "Cabinet Principal",
    nextAvailable: "Aujourd'hui 14h30",
    bio: "Spécialisée en médecine familiale avec une approche holistique des soins de santé."
  },
  {
    id: 2,
    name: "Dr. Pierre Martin",
    specialty: "Cardiologie",
    experience: "20 ans",
    languages: ["Français", "Anglais", "Espagnol"],
    location: "Cabinet Principal",
    nextAvailable: "Demain 10h00",
    bio: "Expert en cardiologie préventive et interventionnelle, ancien chef de service CHU."
  },
  {
    id: 3,
    name: "Dr. Sophie Leroy",
    specialty: "Pédiatrie",
    experience: "12 ans",
    languages: ["Français", "Anglais"],
    location: "Cabinet Principal",
    nextAvailable: "Aujourd'hui 16h00",
    bio: "Pédiatre passionnée, spécialisée dans le développement de l'enfant et l'adolescent."
  },
  
];

export const DoctorsSection = () => {
  return (
    <section id="doctors" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Notre Équipe Médicale
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Des professionnels de santé expérimentés et dévoués à votre bien-être
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="group hover:shadow-lg transition-all duration-300 medical-card hover:border-primary/20">
              <CardContent className="p-6 space-y-6">
                {/* Doctor Image & Basic Info */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/10"
                    />
                    
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {doctor.specialty}
                    </Badge>
                  </div>

                 
                </div>


                {/* Bio */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {doctor.bio}
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* <Button className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Prendre RDV
                  </Button> */}
                  <Button  className="w-full">
                    Voir le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};