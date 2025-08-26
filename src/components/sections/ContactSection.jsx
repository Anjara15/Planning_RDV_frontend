import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="relative py-16 lg:py-24 bg-gray-50 overflow-hidden">
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
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
            Contactez-nous
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nous sommes là pour répondre à toutes vos questions et vous accompagner dans vos démarches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Informations Pratiques */}
          <Card
            className="group bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-blue-500/40 hover:shadow-xl transition-all duration-500 ease-in-out"
            role="region"
            aria-labelledby="info-title"
          >
            <CardHeader>
              <CardTitle
                id="info-title"
                className="flex items-center text-xl font-semibold text-gray-900"
              >
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                Informations Pratiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adresse */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100/60 group-hover:bg-blue-200/60 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600 text-sm">
                    Hôpital HOMI<br />
                    Rue Ravoninahitriniarivo, Antananarivo 101
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100/60 group-hover:bg-blue-200/60 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-gray-600 text-sm">
                    +261 34 22 222 22<br />
                    <span className="text-red-600 font-medium text-sm">Urgences 24h/24 : +261 34 22 222 22</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100/60 group-hover:bg-blue-200/60 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600 text-sm">
                    contact@planning.fr<br />
                    <span className="text-red-600 text-sm">urgences@planning.fr</span>
                  </p>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100/60 group-hover:bg-blue-200/60 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires</h3>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>Lundi - Vendredi : 8h00 - 19h00</p>
                    <p>Samedi : 9h00 - 17h00</p>
                    <p className="text-red-600 font-medium">Dimanche : Urgences uniquement</p>
                  </div>
                </div>
              </div>

              {/* Urgences */}
              <div className="border-t pt-6 space-y-3">
                <h3 className="flex items-center text-lg font-semibold text-red-700">
                  <Navigation className="w-5 h-5 mr-2" />
                  Urgences Médicales
                </h3>
                <p className="text-red-600 text-sm">
                  Service des Urgences – Hôpital HOMI, accessible 24h/24
                </p>
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full transition-transform transform hover:scale-105"
                  aria-label="Itinéraire vers les urgences"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Itinéraire vers les Urgences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de contact */}
          <Card
            className="group bg-white/90 backdrop-blur-sm border border-gray-100 hover:border-blue-500/40 hover:shadow-xl transition-all duration-500 ease-in-out"
            role="region"
            aria-labelledby="form-title"
          >
            <CardHeader>
              <CardTitle
                id="form-title"
                className="flex items-center text-xl font-semibold text-gray-900"
              >
                <Mail className="w-6 h-6 mr-2 text-blue-600" />
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" aria-label="Formulaire de contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-gray-900">
                      Nom <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Votre nom"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-gray-900">
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone" className="text-gray-900">
                    Téléphone
                  </Label>
                  <Input
                    id="contact-phone"
                    placeholder="+261 34 12 34 56"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject" className="text-gray-900">
                    Sujet <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="contact-subject"
                    placeholder="Objet de votre message"
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-gray-900">
                    Message <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Décrivez votre demande en détail..."
                    rows={5}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform transform hover:scale-105"
                  aria-label="Envoyer le message"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  * Champs obligatoires. Réponse sous 24h.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};