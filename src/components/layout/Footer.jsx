import { Button } from "@/components/ui/button";
import { Heart, MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-white py-12 overflow-hidden border-t border-gray-200">
      {/* Removed Background Gradient and Pattern for solid white background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                {/* <p className="text-lg font-extrabold text-gray-900">HOMI</p> */}
                <p className="text-xs text-gray-600">Votre Cabinet Médical</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Votre santé est notre priorité. Prenez rendez-vous facilement avec nos spécialistes.
            </p>
            
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                { href: "#services", label: "Nos Services" },
                { href: "#doctors", label: "Notre Équipe" },
                { href: "#about", label: "À Propos" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-blue-600 transition-colors duration-300"
                    aria-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Disponibles */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Services Disponibles</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {["Médecine Générale", "Cardiologie", "Pédiatrie", "Orthopédie"].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="hover:text-blue-600 transition-colors duration-300"
                    aria-label={`En savoir plus sur ${service}`}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Horaires */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact & Horaires</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <p>
                  Hôpital HOMI<br />
                  {/* Rue Ravoninahitriniarivo, Antananarivo 101 */}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <p>
                  +261 34 22 222 22<br />
                  <span className="text-red-600">Urgences : +261 34 22 222 22</span>
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-blue-600 mt-1" />
                <p>
                  contact@planning.fr<br />
                  <span className="text-red-600">urgences@planning.fr</span>
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p>Lun-Ven : 8h-19h</p>
                  <p>Sam : 9h-17h</p>
                  <p className="text-red-600">Dim : Urgences uniquement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};