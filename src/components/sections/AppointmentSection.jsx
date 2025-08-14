import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const availableSlots = {
  "2025-01-15": ["09:00", "10:30", "14:00", "15:30", "16:00"],
  "2025-01-16": ["08:30", "09:30", "11:00", "14:30", "16:30"],
  "2025-01-17": ["08:00", "09:00", "10:00", "15:00", "17:00"],
  "2025-01-18": ["09:30", "11:30", "14:00", "15:30", "16:00", "17:30"],
  "2025-01-19": ["08:30", "10:00", "14:30", "16:00"]
};

export const AppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      alert("Connexion réussie ✅");
    } else {
      alert("Veuillez remplir tous les champs");
    }
  };

  const handleConfirmClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      alert("Rendez-vous confirmé ✅");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-light via-background to-secondary-light">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Prenez Rendez-vous
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Réservez votre consultation en quelques clics. Simple, rapide et sécurisé.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="medical-card medical-shadow-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground flex items-center justify-center">
                <Calendar className="w-6 h-6 mr-2 text-primary" />
                Nouvelle Consultation
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Step 1 */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-foreground">
                  1. Choisissez votre spécialité
                </Label>
                <Select onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Sélectionnez une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Médecine Générale</SelectItem>
                    <SelectItem value="cardiology">Cardiologie</SelectItem>
                    <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                    <SelectItem value="orthopedics">Orthopédie</SelectItem>
                    <SelectItem value="neurology">Neurologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-foreground">
                  2. Sélectionnez une date
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.keys(availableSlots).map((date) => {
                    const dateObj = new Date(date);
                    const isSelected = selectedDate === date;
                    const availableCount = availableSlots[date].length;
                    
                    return (
                      <Button
                        key={date}
                        variant={isSelected ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col space-y-2 ${
                          isSelected ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => handleDateChange(date)}
                      >
                        <div className="font-semibold">
                          {dateObj.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                        </div>
                        <div className="text-xs">
                          {dateObj.toLocaleDateString("fr-FR", { weekday: "short" })}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {availableCount} créneaux
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 */}
              {selectedDate && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-foreground">
                    3. Choisissez un horaire
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {availableSlots[selectedDate].map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`h-12 ${selectedTime === time ? "bg-primary text-primary-foreground" : ""}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {selectedTime && (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Récapitulatif de votre rendez-vous
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spécialité:</span>
                        <span className="font-medium">{selectedSpecialty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {new Date(selectedDate).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Heure:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                    onClick={handleConfirmClick}
                  >
                    Confirmer le rendez-vous
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Login Modal avec fond flou + animation */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="backdrop-blur-md animate-in fade-in-50 zoom-in-95">
          <DialogHeader>
            {/* <DialogTitle>Connexion requise</DialogTitle> */}
            <DialogDescription>
              Veuillez vous connecter pour confirmer votre rendez-vous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <Input 
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground">
              Connexion
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
