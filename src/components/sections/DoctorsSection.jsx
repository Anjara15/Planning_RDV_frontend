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
    // image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
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
    // image: "https://images.unsplash.com/photo-1559839734-2b71ea6f3f4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
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
    // image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
];

export const DoctorsSection = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <section id="doctors" className="relative py-16 lg:py-24 bg-gray-50 overflow-hidden">
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
            Notre Équipe Médicale
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Des professionnels de santé expérimentés et dévoués à votre bien-être
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group relative bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-500 ease-in-out border border-gray-100 hover:border-blue-500/40 hover:-translate-y-2"
              role="region"
              aria-labelledby={`doctor-title-${doctor.id}`}
            >
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-4">
                  <img
                    src={doctor.image}
                    alt={`Portrait de ${doctor.name}`}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100/50 group-hover:border-blue-200/50 transition-colors duration-300"
                  />
                  <h3
                    id={`doctor-title-${doctor.id}`}
                    className="text-xl font-semibold text-gray-900"
                  >
                    {doctor.name}
                  </h3>
                  <Badge className="bg-blue-100 text-blue-600">{doctor.specialty}</Badge>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform transform hover:scale-105"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  Voir le profil
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popup pour voir le profil */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Fermer le profil"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-6">
                <img
                  src={selectedDoctor.image}
                  alt={`Portrait de ${selectedDoctor.name}`}
                  className="w-28 h-28 rounded-full mx-auto border-4 border-blue-100/60"
                />
                <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                <Badge className="bg-blue-100 text-blue-600">{selectedDoctor.specialty}</Badge>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedDoctor.bio}</p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <p className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    <strong>Expérience :</strong> {selectedDoctor.experience}
                  </span>
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    <strong>Lieu :</strong> {selectedDoctor.location}
                  </span>
                </p>
                <p className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span>
                    <strong>Prochain RDV :</strong> {selectedDoctor.nextAvailable}
                  </span>
                </p>
                <p>
                  <strong>Langues :</strong> {selectedDoctor.languages.join(", ")}
                </p>
              </div>

              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform transform hover:scale-105"
                aria-label={`Prendre rendez-vous avec ${selectedDoctor.name}`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Prendre RDV
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};