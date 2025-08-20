import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Calendar, MapPin, Clock } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Marie Dubois",
    specialty: "Médecine Générale",
    experience: "15 ans",
    languages: ["Français", "Anglais"],
    location: "Cabinet Principal",
    nextAvailable: "Aujourd'hui 14h30",
    bio: "Spécialisée en médecine familiale avec une approche holistique des soins de santé.",
    // image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Dr. Pierre Martin",
    specialty: "Cardiologie",
    experience: "20 ans",
    languages: ["Français", "Anglais", "Espagnol"],
    location: "Cabinet Principal",
    nextAvailable: "Demain 10h00",
    bio: "Expert en cardiologie préventive et interventionnelle, ancien chef de service CHU.",
    // image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "Dr. Sophie Leroy",
    specialty: "Pédiatrie",
    experience: "12 ans",
    languages: ["Français", "Anglais"],
    location: "Cabinet Principal",
    nextAvailable: "Aujourd'hui 16h00",
    bio: "Pédiatre passionnée, spécialisée dans le développement de l'enfant et l'adolescent.",
    // image: "https://via.placeholder.com/150"
  },
];

export const DoctorsSection = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
                <div className="text-center space-y-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/10"
                  />
                  <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
                  <Badge variant="secondary">{doctor.specialty}</Badge>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {doctor.bio}
                </p>

                <Button className="w-full" onClick={() => setSelectedDoctor(doctor)}>
                  Voir le profil
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal / Popup */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
              {/* Bouton fermer */}
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-4">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-28 h-28 rounded-full mx-auto border-4 border-primary/20"
                />
                <h3 className="text-2xl font-bold">{selectedDoctor.name}</h3>
                <Badge>{selectedDoctor.specialty}</Badge>
                <p className="text-muted-foreground">{selectedDoctor.bio}</p>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <p><strong>Expérience :</strong> {selectedDoctor.experience}</p>
                <p><strong>Langues :</strong> {selectedDoctor.languages.join(", ")}</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> {selectedDoctor.location}</p>
                <p className="flex items-center"><Clock className="w-4 h-4 mr-2"/> Prochain RDV : {selectedDoctor.nextAvailable}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
