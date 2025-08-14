import { Heart, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                {/* <h3 className="font-bold">Heal-Cal</h3> */}
                <p className="text-xs opacity-80">Votre Cabinet Médical</p>
              </div>
            </div>
            <p className="text-sm opacity-80">
              Votre santé est notre priorité. Prenez rendez-vous facilement avec nos spécialistes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services Disponible</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Médecine Générale</li>
              <li>Cardiologie</li>
              <li>Pédiatrie</li>
              <li>Orthopédie</li>
            </ul>
          </div>
          
          {/* <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Avenue de la Santé, Paris</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@heal-cal.fr</span>
              </div>
            </div>
          </div> */}
          
          <div>
            <h4 className="font-semibold mb-4">Horaires de service</h4>
            <div className="space-y-1 text-sm opacity-80">
              <p>Lun-Ven: 8h-19h</p>
              <p>Sam: 9h-17h</p>
              <p>Dim: Urgences</p>
            </div>
          </div>
        </div>
        
        {/* <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-60">
          <p>&copy; 2024 Heal-Cal. Tous droits réservés.</p>
        </div> */}
      </div>
    </footer>
  );
};