import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  Bus,
  Navigation
} from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Contactez-nous
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions et vous accompagner
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-foreground">
                  <MapPin className="w-6 h-6 mr-2 text-primary" />
                  Informations Pratiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Adresse</h3>
                    {/* <p className="text-muted-foreground">
                      123 Avenue de la Santé<br />
                      75001 Paris, France
                    </p> */}
                  </div>
                </div>

                {/* {/* Phone  */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Téléphone</h3>
                    <p className="text-muted-foreground">
                      +261 34 22 222 22<br />
                      <span className="text-sm">Urgences: +261 34 22 222 22</span>
                    </p>
                  </div>
                </div>

                {/* {/* Email  */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">
                      contact@planning.fr<br />
                      {/* <span className="text-sm">urgences@heal-cal.fr</span> */}
                    </p>
                  </div>
                </div>

                {/* {/* Hours  */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Horaires</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lundi - Vendredi: 8h00 - 19h00</p>
                      <p>Samedi: 9h00 - 17h00</p>
                      <p>Dimanche: Urgences uniquement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> 

            {/* Transportation */}
            {/* <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-foreground">
                  <Navigation className="w-6 h-6 mr-2 text-primary" />
                  Comment nous rejoindre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Bus className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Transports en commun</p>
                    <p className="text-sm text-muted-foreground">
                      Métro: Ligne 1, 4, 7 - Station Châtelet<br />
                      Bus: Lignes 21, 38, 85 - Arrêt Louvre
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">En voiture</p>
                    <p className="text-sm text-muted-foreground">
                      Parking payant disponible<br />
                      Entrée: Rue de Rivoli
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Contact Form */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-foreground">
                <Mail className="w-6 h-6 mr-2 text-primary" />
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom *</Label>
                    <Input id="contact-name" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input id="contact-email" type="email" placeholder="votre.email@exemple.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Téléphone</Label>
                  <Input id="contact-phone" placeholder="06 12 34 56 78" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Sujet *</Label>
                  <Input id="contact-subject" placeholder="Objet de votre message" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea 
                    id="contact-message" 
                    placeholder="Décrivez votre demande en détail..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>

                {/* <p className="text-xs text-muted-foreground text-center">
                  * Champs obligatoires. Nous vous répondrons dans les 24 heures.
                </p> */}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map placeholder */}
        {/* <div className="mt-16">
          <Card className="medical-card overflow-hidden">
            <div className="bg-muted/50 h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 text-primary mx-auto" />
                <h3 className="font-semibold text-foreground">Plan interactif</h3>
                <p className="text-muted-foreground">
                  123 Avenue de la Santé, 75001 Paris
                </p>
                <Button variant="outline">
                  <Navigation className="w-4 h-4 mr-2" />
                  Ouvrir dans Maps
                </Button>
              </div>
            </div>
          </Card>
        </div> */}
      </div>
    </section>
  );
};