import { useEffect, useState } from "react";
import {
  Calendar,
  Heart,
  Clock,
  Bell,
  X,
  User,
  List,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const availableSlots = {
  "2025-08-25": ["09:00", "10:30", "14:00", "15:30", "16:00"],
  "2025-08-26": ["08:30", "09:30", "11:00", "14:30", "16:30"],
  "2025-08-27": ["08:00", "09:00", "10:00", "15:00", "17:00"],
};

const specialties = [
  { id: "general", name: "Médecine Générale", icon: Heart, color: "text-primary" },
  { id: "cardiology", name: "Cardiologie", icon: Heart, color: "text-red-600" },
  { id: "pediatrics", name: "Pédiatrie", icon: Heart, color: "text-green-600" },
  { id: "orthopedics", name: "Orthopédie", icon: Heart, color: "text-orange-600" },
  { id: "neurology", name: "Neurologie", icon: Heart, color: "text-purple-600" },
];

const PatientDashboard = ({ currentUser, addToHistory }) => {
  const [rendezVous, setRendezVous] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [demande, setDemande] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSpecialtyObj, setSelectedSpecialtyObj] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [showRdvList, setShowRdvList] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
  });
  const [editProfile, setEditProfile] = useState(null);

  useEffect(() => {
    if (!initialized) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedProfile = {
        nom: storedUser.username ? storedUser.username.split(" ")[0] : storedUser.nom || "",
        prenom: storedUser.username ? storedUser.username.split(" ")[1] || "" : storedUser.prenom || "",
        email: storedUser.email || "",
        telephone: storedUser.telephone || "",
        dateNaissance: storedUser.dateNaissance || "",
        adresse: storedUser.adresse || "",
      };
      setProfile(updatedProfile);
      localStorage.setItem("user", JSON.stringify(updatedProfile));

      const username = currentUser?.username || `${updatedProfile.nom} ${updatedProfile.prenom}`.trim() || "patient123";
      let appointments = [];
      try {
        appointments = JSON.parse(localStorage.getItem("rendezVous") || "[]");
      } catch (error) {
        console.error("Error parsing rendezVous from localStorage:", error);
        appointments = [];
      }

      const userAppointments = appointments.filter((rdv) => {
        try {
          if (typeof rdv.username === "string" && rdv.username.startsWith("{")) {
            const parsedUsername = JSON.parse(rdv.username);
            return parsedUsername.username === username;
          }
          return rdv.username === username;
        } catch (error) {
          console.error("Error parsing appointment username:", error);
          return false;
        }
      });

      setRendezVous(userAppointments);

      const newAlerts = userAppointments
        .filter((rdv) => rdv.isNew)
        .map((rdv) => ({
          id: `rdv-${rdv.id}`,
          message: `Nouveau rendez-vous ajouté pour le ${rdv.date} à ${rdv.time || rdv.heure}`,
        }));
      setAlerts(newAlerts);

      addToHistory?.("Connexion", `Connexion au tableau de bord patient`, currentUser);
      setInitialized(true);
    }
  }, [initialized, currentUser, addToHistory]);

  const handleAddRdv = () => {
    const username = `${profile.nom || "patient"} ${profile.prenom || "123"}`.trim();
    const newRdv = {
      id: Date.now(),
      username,
      date: selectedDate,
      time: selectedTime,
      specialite: selectedSpecialtyObj?.name || selectedSpecialty,
      demande,
      isNew: true,
    };

    let allAppointments = [];
    try {
      allAppointments = JSON.parse(localStorage.getItem("rendezVous") || "[]");
    } catch (error) {
      console.error("Error parsing rendezVous from localStorage:", error);
      allAppointments = [];
    }

    allAppointments.push(newRdv);
    try {
      localStorage.setItem("rendezVous", JSON.stringify(allAppointments));
    } catch (error) {
      console.error("Error saving rendezVous to localStorage:", error);
    }

    setRendezVous((prev) => {
      const updatedRendezVous = [...prev, newRdv];
      return updatedRendezVous;
    });

    setAlerts((prev) => [
      ...prev,
      {
        id: `rdv-${newRdv.id}`,
        message: `Nouveau rendez-vous ajouté pour le ${newRdv.date} à ${newRdv.time}`,
      },
    ]);

    addToHistory?.(
      "Ajout rendez-vous",
      `Ajout d'un rendez-vous: ${newRdv.specialite} le ${newRdv.date} à ${newRdv.time}`,
      currentUser
    );

    setIsModalOpen(false);
    setBookingStep(1);
    setSelectedSpecialtyObj(null);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedSpecialty("");
    setDemande("");
  };

  const handleCancelRdv = (rdvId) => {
    const rdvToCancel = rendezVous.find((rdv) => rdv.id === rdvId);
    const updatedRdv = rendezVous.filter((rdv) => rdv.id !== rdvId);

    let allAppointments = [];
    try {
      allAppointments = JSON.parse(localStorage.getItem("rendezVous") || "[]");
    } catch (error) {
      console.error("Error parsing rendezVous from localStorage:", error);
      allAppointments = [];
    }
    const updatedAllAppointments = allAppointments.filter((rdv) => rdv.id !== rdvId);
    try {
      localStorage.setItem("rendezVous", JSON.stringify(updatedAllAppointments));
    } catch (error) {
      console.error("Error saving rendezVous to localStorage:", error);
    }

    setRendezVous(updatedRdv);
    setAlerts(alerts.filter((alert) => alert.id !== `rdv-${rdvId}`));
    addToHistory?.(
      "Annulation rendez-vous",
      `Annulation du rendez-vous: ${rdvToCancel.specialite} le ${rdvToCancel.date} à ${
        rdvToCancel.time || rdvToCancel.heure
      }`,
      currentUser
    );
  };

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts) {
      const updatedRdv = rendezVous.map((rdv) => ({ ...rdv, isNew: false }));
      setRendezVous(updatedRdv);

      let allAppointments = [];
      try {
        allAppointments = JSON.parse(localStorage.getItem("rendezVous") || "[]");
      } catch (error) {
        console.error("Error parsing rendezVous from localStorage:", error);
        allAppointments = [];
      }
      const updatedAllAppointments = allAppointments.map((rdv) =>
        updatedRdv.find((u) => u.id === rdv.id) || rdv
      );
      try {
        localStorage.setItem("rendezVous", JSON.stringify(updatedAllAppointments));
      } catch (error) {
        console.error("Error saving rendezVous to localStorage:", error);
      }

      setAlerts([]);
      addToHistory?.("Consultation alertes", "Consultation et marquage des alertes comme lues", currentUser);
    }
  };

  const handleEditProfile = () => {
    setEditProfile({ ...profile });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!editProfile.nom || !editProfile.prenom || !editProfile.email) {
      alert("Veuillez remplir tous les champs obligatoires (Nom, Prénom, Email).");
      return;
    }

    try {
      const updatedProfile = { ...profile, ...editProfile };
      localStorage.setItem("user", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setEditProfile(null);
      addToHistory?.("Modification profil", "Mise à jour des informations du profil", currentUser);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error saving profile to localStorage:", error);
      alert("Erreur lors de la sauvegarde du profil.");
    }
  };

  const handleCancelEdit = () => {
    setEditProfile(null);
  };

  const toggleRdvList = () => {
    setShowRdvList(!showRdvList);
    setShowProfile(false);
    if (!showRdvList) {
      addToHistory?.("Consultation rendez-vous", "Ouverture de la liste des rendez-vous", currentUser);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowRdvList(false);  
    if (!showProfile) {
      addToHistory?.("Consultation profil", "Ouverture du profil utilisateur", currentUser);
    }
  };

  const isDateOnOrAfterToday = (dateStr) => {
    const rdvDate = new Date(dateStr);
    const today = new Date();
    rdvDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return rdvDate >= today;
  };

  return (
    <main className="min-h-screen container mx-auto px-6 py-10 space-y-12 bg-background text-foreground">
      <div className="flex justify-between items-center border-b border-border pb-5">
        <h2 className="text-3xl font-semibold text-primary tracking-tight">
          Bienvenue, <span className="text-secondary">{profile.nom || "Utilisateur"}</span>
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
              {alerts.map((alert) => (
                <li key={alert.id} className="p-2 bg-muted rounded">
                  {alert.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-8">
        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border-primary border">
          <h3 className="flex items-center gap-3 text-primary font-semibold text-lg mb-3">
            <Calendar className="w-6 h-6" />
            Prendre rendez-vous
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Planifiez facilement vos consultations médicales en quelques clics.
          </p>
          <div className="mt-6">
            <Button
              className="bg-primary hover:bg-primary-hover-600 text-primary-foreground transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Nouveau rendez-vous
            </Button>
          </div>
        </article>

        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border-orange-500 border">
          <h3 className="flex items-center gap-3 text-orange-600 font-semibold text-lg mb-3">
            <List className="w-6 h-6" />
            Mes rendez-vous
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Consultez la liste de tous vos rendez-vous passés et à venir.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={toggleRdvList}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <List className="w-4 h-4 mr-2" />
              {showRdvList ? "Masquer" : "Voir mes RDV"}
              <Badge variant="secondary" className="ml-2">
                {rendezVous.length}
              </Badge>
              {showRdvList ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </article>

        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border-purple-500 border">
          <h3 className="flex items-center gap-3 text-purple-600 font-semibold text-lg mb-3">
            <User className="w-6 h-6" />
            Mon profil
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Consultez et modifiez vos informations personnelles.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={toggleProfile}
              className="border-purple-300 text-purple-600 hover:bg-orange-50"
            >
              <User className="w-4 h-4 mr-2" />
              {showProfile ? "Masquer" : "Voir mon profil"}
              {showProfile ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </article>

        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border-secondary border">
          <h3 className="flex items-center gap-3 text-secondary font-semibold text-lg mb-3">
            <Heart className="w-6 h-6" />
            Conseils santé
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            💧 Pensez à bien vous hydrater et à faire une promenade quotidienne pour rester en forme !
          </p>
        </article>
      </div>

      {/* Section pour mes rendez-vous */}
      {showRdvList && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-center w-full text-orange-600">Mes rendez-vous</h4>
            <Button variant="ghost" onClick={toggleRdvList}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {rendezVous.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Aucun rendez-vous enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rendezVous.map((rdv) => (
                <div
                  key={rdv.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium text-lg">
                          {new Date(rdv.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{rdv.time || rdv.heure}</span>
                      </div>
                      <p className="text-foreground font-medium">{rdv.specialite}</p>
                      {(rdv.demande || rdv.nom) && (
                        <p className="text-muted-foreground mt-1">
                          {rdv.demande || `Patient: ${rdv.nom} ${rdv.prenom || ""}`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      {rdv.isNew && <Badge variant="secondary">Nouveau</Badge>}
                      <Badge variant="outline">
                        {isDateOnOrAfterToday(rdv.date) ? "À venir" : "Passé"}
                      </Badge>
                      {isDateOnOrAfterToday(rdv.date) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelRdv(rdv.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section pour le profil */}
      {showProfile && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-center w-full text-purple-600">Mon profil</h4>
            <Button variant="ghost" onClick={toggleProfile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-6">
            {editProfile ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium">Nom</Label>
                    <Input
                      name="nom"
                      value={editProfile.nom || ""}
                      onChange={handleProfileChange}
                      className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                      placeholder="Entrez votre nom"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Prénom</Label>
                    <Input
                      name="prenom"
                      value={editProfile.prenom || ""}
                      onChange={handleProfileChange}
                      className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                      placeholder="Entrez votre prénom"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">Email</Label>
                  <Input
                    name="email"
                    value={editProfile.email || ""}
                    onChange={handleProfileChange}
                    type="email"
                    className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                    placeholder="Entrez votre email"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium">Téléphone</Label>
                  <Input
                    name="telephone"
                    value={editProfile.telephone || ""}
                    onChange={handleProfileChange}
                    type="tel"
                    className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                    placeholder="Entrez votre numéro de téléphone"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium">Date de naissance</Label>
                  <Input
                    name="dateNaissance"
                    value={editProfile.dateNaissance || ""}
                    onChange={handleProfileChange}
                    type="date"
                    className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                    placeholder="Entrez votre date de naissance"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium">Adresse</Label>
                  <Input
                    name="adresse"
                    value={editProfile.adresse || ""}
                    onChange={handleProfileChange}
                    className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                    placeholder="Entrez votre adresse"
                  />
                </div>
                <div className="flex justify-end gap-6 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Annuler
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary-hover-600 text-primary-foreground px-8 py-4 rounded-xl"
                    onClick={handleSaveProfile}
                  >
                    Sauvegarder
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-medium">Nom</Label>
                    <p className="mt-2 text-foreground">{profile.nom || "Non défini"}</p>
                  </div>
                  <div>
                    <Label className="text-base font-medium">Prénom</Label>
                    <p className="mt-2 text-foreground">{profile.prenom || "Non défini"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-base font-medium">Email</Label>
                  <p className="mt-2 text-foreground">{profile.email || "Non défini"}</p>
                </div>
                <div>
                  <Label className="text-base font-medium">Téléphone</Label>
                  <p className="mt-2 text-foreground">{profile.telephone || "Non défini"}</p>
                </div>
                <div>
                  <Label className="text-base font-medium">Date de naissance</Label>
                  <p className="mt-2 text-foreground">
                    {profile.dateNaissance
                      ? new Date(profile.dateNaissance).toLocaleDateString("fr-FR")
                      : "Non défini"}
                  </p>
                </div>
                <div>
                  <Label className="text-base font-medium">Adresse</Label>
                  <p className="mt-2 text-foreground">{profile.adresse || "Non défini"}</p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    className="bg-primary hover:bg-primary-hover-600 text-primary-foreground px-8 py-4 rounded-xl"
                    onClick={handleEditProfile}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section pour les prochains rendez-vous */}
      {!showRdvList && !showProfile && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-border">
          <h4 className="text-lg font-semibold mb-4 text-center text-primary">Prochains rendez-vous</h4>
          {(() => {
            const newAppointments = rendezVous.filter((rdv) => rdv.isNew && isDateOnOrAfterToday(rdv.date));
            return newAppointments.length > 0 ? (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Nouveaux rendez-vous
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({newAppointments.length} nouveau{newAppointments.length > 1 ? "x" : ""})
                  </span>
                </div>
                <div className="grid gap-3 mb-4">
                  {newAppointments.slice(0, 3).map((rdv) => (
                    <div
                      key={rdv.id}
                      className="p-4 rounded-lg border-l-4 bg-yellow-50 border-yellow-400 hover:bg-yellow-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(rdv.date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {rdv.time || rdv.heure} - {rdv.specialite}
                          </p>
                          {(rdv.demande || rdv.nom) && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {rdv.demande || `Patient: ${rdv.nom} ${rdv.prenom || ""}`}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                            Nouveau
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelRdv(rdv.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
          {(() => {
            const upcomingAppointments = rendezVous.filter((rdv) => !rdv.isNew && isDateOnOrAfterToday(rdv.date));
            return rendezVous.filter((rdv) => isDateOnOrAfterToday(rdv.date)).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun rendez-vous prévu pour le moment.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {upcomingAppointments.slice(0, 3).map((rdv) => (
                  <div
                    key={rdv.id}
                    className="p-4 rounded-lg border-l-4 bg-muted border-border hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(rdv.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rdv.time || rdv.heure} - {rdv.specialite}
                        </p>
                        {(rdv.demande || rdv.nom) && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {rdv.demande || `Patient: ${rdv.nom} ${rdv.prenom || ""}`}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelRdv(rdv.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Modal de prise de rendez-vous */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-2xl w-full max-w-4xl mx-auto my-auto p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setBookingStep(1);
                setSelectedSpecialtyObj(null);
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive rounded-full p-1 hover:bg-muted/50"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-4xl font-bold mb-8 text-center text-primary">
              Prendre un rendez-vous
            </h3>

            {bookingStep === 1 && (
              <div>
                <h4 className="font-semibold mb-4 text-lg text-foreground">
                  Choisissez une spécialité
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  {specialties.map((specialty) => {
                    const IconComponent = specialty.icon;
                    return (
                      <div
                        key={specialty.id}
                        onClick={() => {
                          setSelectedSpecialtyObj(specialty);
                          setBookingStep(2);
                          addToHistory?.(
                            "Sélection spécialité",
                            `Sélection de la spécialité: ${specialty.name}`,
                            currentUser
                          );
                        }}
                        className="cursor-pointer p-8 border-2 border-primary/20 hover:border-primary rounded-lg transition-colors"
                      >
                        <div className="text-center">
                          <IconComponent className={`w-10 h-10 ${specialty.color} mx-auto mb-4`} />
                          <h4 className="text-xl font-semibold">{specialty.name}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === 2 && selectedSpecialtyObj && (
              <div>
                <button
                  onClick={() => setBookingStep(1)}
                  className="text-primary text-sm mb-4 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Retour aux spécialités
                </button>
                <h4 className="font-semibold mb-4 text-lg text-foreground">
                  {selectedSpecialtyObj.name} - Choisissez une date
                </h4>
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Dates disponibles</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      {Object.keys(availableSlots).map((date) => (
                        <Button
                          key={date}
                          variant={selectedDate === date ? "default" : "outline"}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime("");
                          }}
                          className="h-auto p-3 flex flex-col items-center"
                        >
                          <span className="font-medium">
                            {new Date(date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                          <Badge variant="secondary" className="mt-1">
                            {availableSlots[date].length} créneaux
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <Label className="text-base font-medium">Créneaux disponibles</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                        {availableSlots[selectedDate].map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className="flex items-center justify-center"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTime && (
                    <div>
                      <Label className="text-base font-medium">Motif de consultation (optionnel)</Label>
                      <Input
                        type="text"
                        value={demande}
                        onChange={(e) => setDemande(e.target.value)}
                        placeholder="Ex: Consultation de suivi, vaccination..."
                        className="mt-2 rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50"
                      />
                      <Button
                        className="w-full bg-primary hover:bg-primary-hover-600 text-primary-foreground mt-6 rounded-xl py-4"
                        onClick={handleAddRdv}
                      >
                        Confirmer le rendez-vous
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default PatientDashboard;