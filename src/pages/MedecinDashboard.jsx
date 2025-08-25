import { useEffect, useState, useCallback } from "react";
import { Users2, CalendarCheck, Bell, X, Clock, User, Calendar, ArrowLeft, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

const MedecinDashboard = ({ currentUser, addToHistory }) => {
  const [patients, setPatients] = useState([]);
  const [rdvDuJour, setRdvDuJour] = useState([]);
  const [medecin, setMedecin] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showAlerts, setShowAlerts] = useState(false);
  const [profilData, setProfilData] = useState({
    username: "",
    specialite: "",
    numeroOrdre: "",
    email: "",
    telephone: "",
    adresse: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [planningSlots, setPlanningSlots] = useState([]);
  const [showCreateSlotForm, setShowCreateSlotForm] = useState(false);
  const [showWeekOnly, setShowWeekOnly] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", startTime: "", endTime: "", lieu: "", note: "" });
  const [consultations, setConsultations] = useState([]);
  const [newNote, setNewNote] = useState({ date: "", title: "", patient: "", content: "" });
  const [consultationSearch, setConsultationSearch] = useState("");

  const getAppointmentStatus = (date, time) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    const timeDiff = (appointmentDateTime - now) / (1000 * 60);

    if (timeDiff > 30) {
      return { status: "En attente", color: "text-blue-600 bg-blue-50" };
    } else if (timeDiff >= -30 && timeDiff <= 30) {
      return { status: "En cours", color: "text-green-600 bg-green-50" };
    } else {
      return { status: "Terminé", color: "text-gray-600 bg-gray-50" };
    }
  };

  const loadAppointmentsAndAlerts = useCallback(() => {
    if (!currentUser) return;
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userData?.username || "Dr. Martin";
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const medecinData = users.find(user => user.username === username && user.role === "medecin") || {};
    const medecinProfile = {
      username: medecinData.username || "Dr. Martin",
      specialite: medecinData.specialite || "Cardiologie",
      email: medecinData.email || "dr.martin@hopital.com",
      telephone: medecinData.telephone || "01 23 45 67 89",
      adresse: medecinData.adresse || "123 Rue de la Santé, 75014 Paris",
      numeroOrdre: medecinData.numeroOrdre || "12345678",
    };
    setMedecin(medecinProfile);
    setProfilData(medecinProfile);

    const patientList = users
      .filter(user => user.role === "patient")
      .map(user => ({
        id: user.username, 
        username: user.username,
        age: user.age || "Inconnu",
        email: user.email || "N/A",
        telephone: user.telephone || "N/A",
      }));
    setPatients(patientList);

    const today = new Date().toISOString().split("T")[0];
    const storedRendezVous = JSON.parse(localStorage.getItem('rendezVous') || '[]');
    const rdvToday = storedRendezVous
      .filter(rdv => {
        const isSameDay = rdv.date === today;
        const isAssignedToMedecin = rdv.medecin === username || (!rdv.medecin && rdv.specialite.toLowerCase() === medecinProfile.specialite.toLowerCase());
        return isSameDay && isAssignedToMedecin;
      })
      .map(rdv => ({
        id: rdv.id,
        username: rdv.nom || rdv.username,
        age: users.find(user => user.username === (JSON.parse(rdv.username)?.username || rdv.username))?.age || "Inconnu",
        email: rdv.email || "N/A",
        time: rdv.heure || rdv.time,
        date: rdv.date,
        isNew: rdv.isNew || false,
        motif: rdv.demande || "Non spécifié",
        statusInfo: getAppointmentStatus(rdv.date, rdv.heure || rdv.time),
      }));
    setRdvDuJour(rdvToday);

    const newRdvAlerts = rdvToday
      .filter(rdv => rdv.isNew)
      .map(rdv => ({
        id: `rdv-${rdv.id}`,
        message: `Nouveau rendez-vous : ${rdv.username} le ${rdv.date} à ${rdv.time}`,
      }));
    setAlerts(newRdvAlerts);

    // Load planning for this médecin
    const planningKey = `planning:${username}`;
    const storedPlanning = JSON.parse(localStorage.getItem(planningKey) || '[]');
    setPlanningSlots(Array.isArray(storedPlanning) ? storedPlanning : []);

    // Load consultations for this médecin
    const consultationsKey = `consultations:${username}`;
    const storedConsultations = JSON.parse(localStorage.getItem(consultationsKey) || '[]');
    setConsultations(Array.isArray(storedConsultations) ? storedConsultations : []);
  }, [currentUser]);

  useEffect(() => {
    loadAppointmentsAndAlerts();
    addToHistory?.("Connexion", `Connexion au tableau de bord médecin`, currentUser);
  }, [loadAppointmentsAndAlerts, addToHistory, currentUser]);

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts && alerts.length > 0) {
      const updatedRdv = rdvDuJour.map(rdv => ({ ...rdv, isNew: false }));
      setRdvDuJour(updatedRdv);

      const storedRendezVous = JSON.parse(localStorage.getItem('rendezVous') || '[]');
      const updatedStoredRendezVous = storedRendezVous.map(rdv => {
        const foundRdv = updatedRdv.find(updated => updated.id === rdv.id);
        return foundRdv ? { ...rdv, isNew: foundRdv.isNew } : rdv;
      });
      localStorage.setItem('rendezVous', JSON.stringify(updatedStoredRendezVous));

      setAlerts([]);
      addToHistory?.("Consultation alertes", "Consultation et marquage des alertes comme lues", currentUser);
    }
  };

  const savePlanning = (username, slots) => {
    const planningKey = `planning:${username}`;
    localStorage.setItem(planningKey, JSON.stringify(slots));
  };

  const saveConsultations = (username, items) => {
    const consultationsKey = `consultations:${username}`;
    localStorage.setItem(consultationsKey, JSON.stringify(items));
  };

  const getCurrentUsername = () => {
    return JSON.parse(localStorage.getItem('user') || '{}')?.username || "Dr. Martin";
  };

  const getWeekRange = (date = new Date()) => {
    const day = date.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day; // Monday as first day
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { start: monday, end: sunday };
  };

  const handleCreateSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) return;
    const start = new Date(`${newSlot.date}T${newSlot.startTime}:00`);
    const end = new Date(`${newSlot.date}T${newSlot.endTime}:00`);
    if (end <= start) return;
    const slot = { id: uuidv4(), ...newSlot };
    const updated = [...planningSlots, slot].sort((a, b) => {
      const aDate = new Date(`${a.date}T${a.startTime}:00`).getTime();
      const bDate = new Date(`${b.date}T${b.startTime}:00`).getTime();
      return aDate - bDate;
    });
    setPlanningSlots(updated);
    const username = getCurrentUsername();
    savePlanning(username, updated);
    addToHistory?.("Création créneau", `Créneau ${newSlot.date} ${newSlot.startTime}-${newSlot.endTime}`, currentUser);
    setNewSlot({ date: "", startTime: "", endTime: "", lieu: "", note: "" });
    setShowCreateSlotForm(false);
  };

  const handleDeleteSlot = (id) => {
    const updated = planningSlots.filter(s => s.id !== id);
    setPlanningSlots(updated);
    const username = getCurrentUsername();
    savePlanning(username, updated);
    addToHistory?.("Suppression créneau", `Suppression du créneau ${id}`, currentUser);
  };

  const handleAddConsultation = () => {
    if (!newNote.title || !newNote.content) return;
    const username = getCurrentUsername();
    const note = {
      id: uuidv4(),
      date: newNote.date || new Date().toISOString().split('T')[0],
      title: newNote.title,
      patient: newNote.patient,
      content: newNote.content,
      createdAt: new Date().toISOString(),
    };
    const updated = [note, ...consultations];
    setConsultations(updated);
    saveConsultations(username, updated);
    addToHistory?.("Ajout note", `Note: ${note.title}`, currentUser);
    setNewNote({ date: "", title: "", patient: "", content: "" });
  };

  const handleDeleteConsultation = (id) => {
    const username = getCurrentUsername();
    const updated = consultations.filter(c => c.id !== id);
    setConsultations(updated);
    saveConsultations(username, updated);
    addToHistory?.("Suppression note", `Note ${id}`, currentUser);
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setShowAlerts(false);
    addToHistory?.("Navigation", `Accès à la vue ${view}`, currentUser);
  };

  const goBackToDashboard = () => {
    setCurrentView("dashboard");
    addToHistory?.("Navigation", "Retour au tableau de bord", currentUser);
  };

  const handleProfilChange = (field, value) => {
    setProfilData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfil = () => {
    setMedecin(prev => ({ ...prev, ...profilData }));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const username = JSON.parse(localStorage.getItem('user') || '{}')?.username || "Dr. Martin";
    const updatedUsers = users.map(user =>
      user.username === username
        ? { ...user, ...profilData, role: "medecin" }
        : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUserData, ...profilData, role: "medecin" }));

    addToHistory?.("Mise à jour profil", "Sauvegarde des modifications du profil", currentUser);
    navigateTo("dashboard");
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center border-b border-border pb-5">
      <div className="flex items-center gap-4">
        {currentView !== "dashboard" && (
          <Button
            variant="outline"
            onClick={goBackToDashboard}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-semibold text-primary tracking-tight">
            {currentView === "dashboard"
              ? `Bienvenue, ${medecin?.username || "Médecin"}`
              : currentView === "patients"
              ? ""
              : currentView === "rdv"
              ? ""
              : currentView === "planning"
              ? ""
              : currentView === "profil"
              ? ""
              : ""}
          </h1>
        </div>
      </div>
      {currentView === "dashboard" && (
        <div className="flex items-center gap-4">
          <button
            onClick={handleShowAlerts}
            className="relative p-2 rounded-full hover:bg-muted"
          >
            <Bell className="w-6 h-6 text-primary" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
                {alerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => navigateTo("profil")}
            className="relative p-2 rounded-full hover:bg-muted"
            title="Mon Profil"
          >
            <User className="w-6 h-6 text-primary" />
          </button>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border border-primary rounded-xl">
          <h3 className="flex items-center gap-3 text-primary font-semibold text-lg mb-3">
            <Users2 className="w-6 h-6" />
            Mes patients
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Consultez la liste de vos patients.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigateTo("patients")}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground transition-colors rounded-xl"
            >
              <Users2 className="w-4 h-4 mr-2" />
              Voir la liste ({patients.length})
            </Button>
          </div>
        </article>

        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border border-purple-500 rounded-xl">
          <h3 className="flex items-center gap-3 text-purple-600 font-semibold text-lg mb-3">
            <Calendar className="w-6 h-6" />
            Mon planning
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Gérez vos créneaux de consultation.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigateTo("planning")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors rounded-xl"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Consulter
            </Button>
          </div>
        </article>

        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border border-secondary rounded-xl">
          <h3 className="flex items-center gap-3 text-secondary font-semibold text-lg mb-3">
            <CalendarCheck className="w-6 h-6" />
            RDV du jour
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Consultez vos rendez-vous prévus aujourd'hui.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigateTo("rdv")}
              className="w-full bg-secondary hover:bg-secondary/80 text-white transition-colors rounded-xl"
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Voir la liste ({rdvDuJour.length})
            </Button>
          </div>
        </article>

        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border border-teal-500 rounded-xl">
          <h3 className="flex items-center gap-3 text-teal-600 font-semibold text-lg mb-3">
            <FileText className="w-6 h-6" />
            Consultations
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Accédez à l'historique et aux notes des consultations.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigateTo("consultations")}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors rounded-xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              Consulter
            </Button>
          </div>
        </article>
      </div>
    </>
  );

  const renderPatientsPage = () => {
    const filteredPatients = patients.filter(
      (patient) =>
        patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.telephone.includes(searchTerm)
    );

    return (
      <div className="bg-white rounded-2xl shadow-md border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Users2 className="w-5 h-5" />
            Liste complète des patients ({filteredPatients.length})
          </h3>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Rechercher un patient par nom, email ou téléphone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {filteredPatients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun patient trouvé</p>
          ) : (
            <table className="w-full border-collapse border border-border min-w-[700px]">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Nom du patient</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Âge</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Email</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Téléphone</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-muted/50">
                    <td className="border p-2 text-sm font-medium text-foreground">{patient.username}</td>
                    <td className="border p-2 text-sm text-muted-foreground">{patient.age} ans</td>
                    <td className="border p-2 text-sm text-muted-foreground">{patient.email}</td>
                    <td className="border p-2 text-sm text-muted-foreground">{patient.telephone}</td>
                    <td className="border p-2 text-sm text-muted-foreground">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          addToHistory?.(
                            "Consultation patient",
                            `Consultation des détails du patient: ${patient.username}`,
                            currentUser
                          )
                        }
                      >
                        Voir détails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const renderRDVPage = () => (
    <div className="bg-white rounded-2xl shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          Rendez-vous du jour ({rdvDuJour.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        {rdvDuJour.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucun rendez-vous aujourd'hui</p>
        ) : (
          <table className="w-full border-collapse border border-border min-w-[700px]">
            <thead className="bg-muted">
              <tr>
                <th className="border p-2 text-left text-sm font-medium text-foreground">Heure</th>
                <th className="border p-2 text-left text-sm font-medium text-foreground">Patient</th>
                <th className="border p-2 text-left text-sm font-medium text-foreground">Âge</th>
                <th className="border p-2 text-left text-sm font-medium text-foreground">Motif</th>
                <th className="border p-2 text-left text-sm font-medium text-foreground">État</th>
                <th className="border p-2 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rdvDuJour.map((rdv) => (
                <tr
                  key={rdv.id}
                  className={`hover:bg-muted/50 ${rdv.isNew ? "bg-yellow-100 border-l-4 border-yellow-400" : ""}`}
                >
                  <td className="border p-2 text-sm font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {rdv.time}
                    </div>
                  </td>
                  <td className="border p-2 text-sm font-medium text-foreground">
                    {rdv.username}
                    {rdv.isNew && (
                      <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </td>
                  <td className="border p-2 text-sm text-muted-foreground">{rdv.age} ans</td>
                  <td className="border p-2 text-sm text-muted-foreground">{rdv.motif}</td>
                  <td className="border p-2 text-sm">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${rdv.statusInfo?.color}`}>
                      {rdv.statusInfo?.status}
                    </span>
                  </td>
                  <td className="border p-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          addToHistory?.(
                            "Action rendez-vous",
                            `Démarrage du rendez-vous pour ${rdv.username} à ${rdv.time}`,
                            currentUser
                          )
                        }
                      >
                        Commencer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          addToHistory?.(
                            "Action rendez-vous",
                            `Report du rendez-vous pour ${rdv.username} à ${rdv.time}`,
                            currentUser
                          )
                        }
                      >
                        Reporter
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderPlanningPage = () => {
    const { start, end } = getWeekRange(new Date());
    const slotsToShow = planningSlots.filter(slot => {
      if (!showWeekOnly) return true;
      const d = new Date(`${slot.date}T00:00:00`);
      return d >= start && d <= end;
    });
    return (
      <div className="bg-white rounded-2xl shadow-md border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Mon planning
          </h3>
          <div className="flex gap-3">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              onClick={() => setShowCreateSlotForm(v => !v)}
            >
              {showCreateSlotForm ? "Fermer" : "Créer un créneau"}
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setShowWeekOnly(v => !v);
                addToHistory?.("Consultation planning", "Basculement filtre semaine", currentUser);
              }}
            >
              {showWeekOnly ? "Voir tout" : "Voir la semaine"}
            </Button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {showCreateSlotForm && (
            <div className="border rounded-xl p-4 bg-muted/30">
              <div className="grid md:grid-cols-5 gap-3">
                <input type="date" value={newSlot.date} onChange={(e) => setNewSlot(s => ({ ...s, date: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border" />
                <input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot(s => ({ ...s, startTime: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border" />
                <input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot(s => ({ ...s, endTime: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border" />
                <input type="text" placeholder="Lieu (optionnel)" value={newSlot.lieu} onChange={(e) => setNewSlot(s => ({ ...s, lieu: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border" />
                <input type="text" placeholder="Note (optionnel)" value={newSlot.note} onChange={(e) => setNewSlot(s => ({ ...s, note: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border" />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" className="rounded-xl" onClick={() => setShowCreateSlotForm(false)}>Annuler</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl" onClick={handleCreateSlot}>Enregistrer</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {slotsToShow.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun créneau</p>
            ) : (
              <table className="w-full border-collapse border border-border min-w-[700px]">
                <thead className="bg-muted">
                  <tr>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Date</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Début</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Fin</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Lieu</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Note</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slotsToShow.map(slot => (
                    <tr key={slot.id} className="hover:bg-muted/50">
                      <td className="border p-2 text-sm font-medium text-foreground">{slot.date}</td>
                      <td className="border p-2 text-sm text-muted-foreground">{slot.startTime}</td>
                      <td className="border p-2 text-sm text-muted-foreground">{slot.endTime}</td>
                      <td className="border p-2 text-sm text-muted-foreground">{slot.lieu || "—"}</td>
                      <td className="border p-2 text-sm text-muted-foreground">{slot.note || "—"}</td>
                      <td className="border p-2 text-sm">
                        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => handleDeleteSlot(slot.id)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConsultationsPage = () => {
    const filtered = consultations.filter((c) => {
      const q = consultationSearch.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        (c.patient || "").toLowerCase().includes(q)
      );
    });
    return (
      <div className="bg-white rounded-2xl shadow-md border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Consultations et notes
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="border rounded-xl p-4 bg-muted/30">
            <h4 className="text-lg font-medium mb-3">Ajouter une note</h4>
            <div className="grid md:grid-cols-6 gap-3">
              <input type="date" value={newNote.date} onChange={(e) => setNewNote(n => ({ ...n, date: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border md:col-span-2" />
              <input type="text" placeholder="Titre" value={newNote.title} onChange={(e) => setNewNote(n => ({ ...n, title: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border md:col-span-2" />
              <select value={newNote.patient} onChange={(e) => setNewNote(n => ({ ...n, patient: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border md:col-span-2">
                <option value="">Patient (optionnel)</option>
                {patients.map(p => (
                  <option key={p.id} value={p.username}>{p.username}</option>
                ))}
              </select>
              <textarea placeholder="Contenu de la note" rows={3} value={newNote.content} onChange={(e) => setNewNote(n => ({ ...n, content: e.target.value }))} className="w-full rounded-xl px-4 py-3 border border-border md:col-span-6" />
            </div>
            <div className="mt-3 flex justify-end gap-3">
              <Button variant="outline" className="rounded-xl" onClick={() => setNewNote({ date: "", title: "", patient: "", content: "" })}>Effacer</Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl" onClick={handleAddConsultation}>Ajouter</Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Historique</h4>
            <input type="text" placeholder="Rechercher une note" value={consultationSearch} onChange={(e) => setConsultationSearch(e.target.value)} className="w-full md:w-80 rounded-xl px-4 py-3 border border-border" />
          </div>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune note</p>
            ) : (
              <table className="w-full border-collapse border border-border min-w-[700px]">
                <thead className="bg-muted">
                  <tr>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Date</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Titre</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Patient</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Contenu</th>
                    <th className="border p-2 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(note => (
                    <tr key={note.id} className="hover:bg-muted/50">
                      <td className="border p-2 text-sm font-medium text-foreground">{note.date}</td>
                      <td className="border p-2 text-sm text-foreground">{note.title}</td>
                      <td className="border p-2 text-sm text-muted-foreground">{note.patient || "—"}</td>
                      <td className="border p-2 text-sm text-muted-foreground max-w-[400px] truncate" title={note.content}>{note.content}</td>
                      <td className="border p-2 text-sm">
                        <Button size="sm" variant="outline" className="rounded-xl" onClick={() => handleDeleteConsultation(note.id)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProfilPage = () => (
    <div className="bg-white rounded-2xl shadow-md border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations du profil
        </h3>
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Informations personnelles
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <input
                  type="text"
                  value={profilData.username}
                  onChange={(e) => handleProfilChange("username", e.target.value)}
                  className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Spécialité</label>
                <input
                  type="text"
                  value={profilData.specialite}
                  onChange={(e) => handleProfilChange("specialite", e.target.value)}
                  className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Numéro d'ordre</label>
                <input
                  type="text"
                  value={profilData.numeroOrdre}
                  onChange={(e) => handleProfilChange("numeroOrdre", e.target.value)}
                  className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-foreground">Contact</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={profilData.email}
                  onChange={(e) => handleProfilChange("email", e.target.value)}
                  className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={profilData.telephone}
                  onChange={(e) => handleProfilChange("telephone", e.target.value)}
                  className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                <textarea
                  value={profilData.adresse}
                  onChange={(e) => handleProfilChange("adresse", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl px-5 py-4 border border-border focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex justify-end gap-4">
          <Button
            variant="outline"
            className="px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => navigateTo("dashboard")}
          >
            Annuler
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleSaveProfil}
          >
            Sauvegarder les modifications
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen container mx-auto px-6 py-12 space-y-12 bg-background text-foreground">
      {renderHeader()}
      {currentView === "dashboard" && renderDashboard()}
      {currentView === "patients" && renderPatientsPage()}
      {currentView === "rdv" && renderRDVPage()}
      {currentView === "planning" && renderPlanningPage()}
      {currentView === "consultations" && renderConsultationsPage()}
      {currentView === "profil" && renderProfilPage()}
    </main>
  );
};

MedecinDashboard.propTypes = {
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    specialite: PropTypes.string,
    email: PropTypes.string,
  }),
  addToHistory: PropTypes.func,
};

export default MedecinDashboard;