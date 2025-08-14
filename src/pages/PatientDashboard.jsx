import { useEffect, useState } from "react";
import { Calendar, Heart, Clock, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const availableSlots = {
  "2025-08-13": ["09:00", "10:30", "14:00", "15:30", "16:00"],
  "2025-08-14": ["08:30", "09:30", "11:00", "14:30", "16:30"],
  "2025-08-15": ["08:00", "09:00", "10:00", "15:00", "17:00"],
};

const PatientDashboard = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [demande, setDemande] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("user");
    const allRdv = JSON.parse(localStorage.getItem("rendezVous") || "[]");
    const patientRdv = allRdv.filter(rdv => rdv.username === username);
    setRendezVous(patientRdv);

    const newRdvAlerts = patientRdv
      .filter(rdv => rdv.isNew)
      .map(rdv => ({
        id: `rdv-${rdv.id}`,
        message: `Nouveau rendez-vous ajouté pour le ${rdv.date} à ${rdv.time}`,
      }));
    setAlerts(newRdvAlerts);
  }, []);

  const handleAddRdv = () => {
    const username = localStorage.getItem("user");
    const newRdv = {
      id: Date.now(),
      username,
      date: selectedDate,
      time: selectedTime,
      specialite: selectedSpecialty,
      demande,
      isNew: true,
    };

    const allRdv = JSON.parse(localStorage.getItem("rendezVous") || "[]");
    const updatedRdv = [...allRdv, newRdv];
    localStorage.setItem("rendezVous", JSON.stringify(updatedRdv));
    setRendezVous([...rendezVous, newRdv]);
    setAlerts([...alerts, { id: `rdv-${newRdv.id}`, message: `Nouveau rendez-vous ajouté pour le ${newRdv.date} à ${newRdv.time}` }]);
    setIsModalOpen(false);

    setSelectedDate("");
    setSelectedTime("");
    setSelectedSpecialty("");
    setDemande("");
  };

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts) {
      const updatedRdv = rendezVous.map(rdv => ({ ...rdv, isNew: false }));
      setRendezVous(updatedRdv);
      const allRdv = JSON.parse(localStorage.getItem("rendezVous") || "[]");
      const updatedAllRdv = allRdv.map(rdv =>
        rdv.username === localStorage.getItem("user") ? { ...rdv, isNew: false } : rdv
      );
      localStorage.setItem("rendezVous", JSON.stringify(updatedAllRdv));
      setAlerts([]);
    }
  };

  return (
    <section className="space-y-10">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-primary tracking-tight">
          Bienvenue, Patient
        </h2>
        <button
          onClick={handleShowAlerts}
          className="relative p-2 rounded-full hover:bg-muted"
          data-testid="bell-icon"
        >
          <Bell className="w-6 h-6 text-primary" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Alerts */}
      {showAlerts && (
        <div className="p-4 border rounded bg-white shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-primary">Nouvelles alertes</h3>
            <Button variant="destructive" onClick={handleShowAlerts}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground">Aucune alerte pour le moment.</p>
          ) : (
            <ul className="space-y-1">
              {alerts.map(alert => (
                <li key={alert.id} className="p-2 bg-muted rounded">
                  {alert.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Deux sections côte à côte */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bloc Prochains RDV (sans liste) */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover p-6">
          <h3 className="flex items-center gap-3 text-secondary font-semibold text-lg mb-4">
            <Calendar className="w-6 h-6" />
            Prochains rendez-vous
          </h3>
          <Button
            className="mt-4 bg-primary text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un rendez-vous
          </Button>
        </article>

        {/* Bloc Conseils santé */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover p-6 border-accent border">
          <h3 className="flex items-center gap-3 text-accent font-semibold text-lg mb-4">
            <Heart className="w-6 h-6" />
            Conseils santé
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Pensez à bien vous hydrater et à faire une promenade quotidienne pour rester en forme !
          </p>
        </article>
      </div>

      {/* Liste RDV déplacée ici */}
      <div className="medical-card medical-shadow p-6">
        <h4 className="text-lg font-semibold mb-4">Liste des rendez-vous</h4>
        {rendezVous.length === 0 ? (
          <p className="text-muted-foreground">Aucun rendez-vous prévu.</p>
        ) : (
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            {rendezVous.map(rdv => (
              <li
                key={rdv.id}
                className={`p-2 rounded ${rdv.isNew ? "bg-yellow-100" : ""}`}
              >
                {rdv.date} - {rdv.specialite}
                {rdv.demande && ` | Demande: ${rdv.demande}`}{" "}
                {rdv.time && `à ${rdv.time}`}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              ×
            </button>
            <h3 className="text-2xl font-semibold text-center mb-6">Ajouter un rendez-vous</h3>
            <div className="space-y-4">
              <div>
                <Label>Spécialité</Label>
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

              <div>
                <Label>Date</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {Object.keys(availableSlots).map(date => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime("");
                      }}
                    >
                      {new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      <Badge variant="secondary" className="ml-1">{availableSlots[date].length}</Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <Label>Horaire</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availableSlots[selectedDate].map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="w-4 h-4 mr-1" /> {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Demande / Motif</Label>
                <Input
                  type="text"
                  value={demande}
                  onChange={e => setDemande(e.target.value)}
                  placeholder="Ex: Consultation suivi, vaccin..."
                />
              </div>

              <Button
                className="w-full bg-primary text-white mt-4"
                onClick={handleAddRdv}
                disabled={!selectedDate || !selectedTime || !selectedSpecialty}
              >
                Confirmer le rendez-vous
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PatientDashboard;
