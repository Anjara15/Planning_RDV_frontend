import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, Heart } from "lucide-react";

export const AproposSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Humanité",
      description: "Nous plaçons l'humain au cœur de nos préoccupations avec une approche bienveillante et empathique."
    },
    {
      icon: Shield,
      title: "Excellence",
      description: "Nous nous engageons à fournir des soins de la plus haute qualité avec les meilleures pratiques médicales."
    },
    {
      icon: Users,
      title: "Accessibilité",
      description: "Nous rendons les soins de santé accessibles à tous avec des horaires flexibles et des tarifs équitables."
    }
  ];

  const missions = [
    {
      icon: Award,
      title: "Notre Mission",
      description:
        "Offrir à chaque patient des soins de santé de qualité supérieure dans un environnement sécurisé et bienveillant, en utilisant les dernières avancées médicales tout en préservant la dimension humaine de la médecine."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6 text-center lg:text-left">
              À Propos de Notre Centre Médical
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed text-center lg:text-left">
              Depuis plus de 20 ans, notre centre médical s'engage à offrir des soins 
              de santé exceptionnels dans un environnement moderne et accueillant. 
              Nous combinons expertise médicale de pointe et approche humaine pour 
              garantir le bien-être de nos patients.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-center lg:text-left">
              Notre équipe pluridisciplinaire de spécialistes travaille en collaboration 
              pour vous offrir un suivi médical complet et personnalisé, adapté à vos 
              besoins spécifiques.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                En savoir plus sur notre histoire
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=500&fit=crop"
              alt="Centre médical moderne"
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm">Années d'expérience</div>
            </div>
          </div>
        </div>

        {/* Valeurs Section */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Nos Valeurs</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Ces valeurs guident chacune de nos actions et définissent notre approche des soins de santé.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center p-8 border-border hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-4">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-8">Notre Mission</h3>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {missions.map((mission, index) => (
              <Card
                key={index}
                className="text-center p-8 border-border hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <mission.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-4">
                    {mission.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
