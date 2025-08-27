import { useEffect, useState, useCallback } from "react";
import { Users2, CalendarCheck, Bell, X, Clock, User, Calendar, FileText, Settings, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropTypes from "prop-types";
import EnhancedConsultationsPage from "./Historiques/ConsultationForm";
import PatientMedicalFile from "./Historiques/PatientMedicalFile";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl w-full max-w-5xl p-10 shadow-xl relative animate-slide-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const MedecinDashboard = ({ currentUser, addToHistory }) => {
  const [patients, setPatients] = useState([]);
  const [rdvDuJour, setRdvDuJour] = useState([]);
  const [medecin, setMedecin] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [secondaryView, setSecondaryView] = useState("patients");
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
  const [modalOpen, setModalOpen] = useState(false);
  const [creneauData, setCreneauData] = useState({
    jour: "",
    heureDebut: "09:00",
    heureFin: "17:00",
    dureeConsultation: "30",
    typeConsultation: "consultation",
    salleConsultation: "Salle 1",
    maxPatients: "8",
  });
  const [creneaux, setCreneaux] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const joursOptions = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const getAppointmentStatus = (date, time) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    const timeDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);

    if (timeDiff > 30) {
      return { status: "En attente", color: "text-blue-600 bg-blue-50" };
    } else if (timeDiff >= -30 && timeDiff <= 30) {
      return { status: "En cours", color: "text-green-600 bg-green-50" };
    } else {
      return { status: "Terminé", color: "text-gray-600 bg-gray-50" };
    }
  };

  const initializeDemoData = () => {
    const demoUsers = [
      {
        username: "Dr. Martin",
        role: "medecin",
        specialite: "Cardiologie",
        email: "dr.martin@hopital.com",
        telephone: "01 23 45 67 89",
        adresse: "123 Rue de la Santé, 75014 Paris",
        numeroOrdre: "12345678",
      },
      {
        username: "Marie Dubois",
        role: "patient",
        age: "45",
        email: "marie.dubois@email.com",
        telephone: "06 12 34 56 78",
      },
      {
        username: "Jean Martin",
        role: "patient",
        age: "62",
        email: "jean.martin@email.com",
        telephone: "06 87 65 43 21",
      },
      {
        username: "Sophie Bernard",
        role: "patient",
        age: "34",
        email: "sophie.bernard@email.com",
        telephone: "06 45 67 89 12",
      },
      {
        username: "Pierre Durand",
        role: "patient",
        age: "28",
        email: "pierre.durand@email.com",
        telephone: "06 98 76 54 32",
      },
    ];

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.length === 0) {
      localStorage.setItem("users", JSON.stringify(demoUsers));
    }

    const demoMedicalRecords = [
      {
        id: "med_001",
        patientId: "Marie Dubois",
        date: "2025-08-20",
        type: "consultation",
        title: "Consultation de contrôle cardiaque",
        description: "Contrôle de routine suite à l'hypertension. Patient se sent bien, pas de symptômes particuliers.",
        doctor: "Dr. Martin",
        symptoms: ["Légère fatigue", "Palpitations occasionnelles"],
        diagnosis: "Hypertension artérielle bien contrôlée",
        recommendations: ["Continuer le traitement actuel", "Contrôle dans 3 mois", "Activité physique modérée"],
      },
      {
        id: "med_002",
        patientId: "Jean Martin",
        date: "2025-08-18",
        type: "consultation",
        title: "Consultation douleurs thoraciques",
        description: "Patient présente des douleurs thoraciques intermittentes depuis 1 semaine. ECG normal.",
        doctor: "Dr. Martin",
        symptoms: ["Douleurs thoraciques", "Essoufflement", "Anxiété"],
        diagnosis: "Douleurs thoraciques atypiques - probablement musculaires",
        recommendations: ["Anti-inflammatoires", "Repos", "Éviter le stress"],
      },
      {
        id: "med_003",
        patientId: "Sophie Bernard",
        date: "2025-08-15",
        type: "consultation",
        title: "Consultation préventive",
        description: "Bilan de santé annuel. Bonne condition générale.",
        doctor: "Dr. Martin",
        symptoms: [],
        diagnosis: "État de santé excellent",
        recommendations: ["Continuer mode de vie sain", "Prochain bilan dans 1 an"],
      },
      {
        id: "med_004",
        patientId: "Marie Dubois",
        date: "2025-08-10",
        type: "prescription",
        title: "Ordonnance hypertension",
        description: "Renouvellement traitement antihypertenseur",
        doctor: "Dr. Martin",
        medications: ["Amlodipine 5mg", "Lisinopril 10mg"],
      },
    ];

    const existingMedicalRecords = JSON.parse(localStorage.getItem("medicalRecords") || "[]");
    if (existingMedicalRecords.length === 0) {
      localStorage.setItem("medicalRecords", JSON.stringify(demoMedicalRecords));
    }

    const demoConsultations = [
      {
        id: "cons_001",
        patientId: "Marie Dubois",
        patientName: "Marie Dubois",
        date: "2025-08-20",
        time: "14:30",
        symptoms: ["Légère fatigue", "Palpitations occasionnelles"],
        examination: "Tension artérielle : 135/85 mmHg. Auscultation cardiaque normale. Pas d'œdème des membres inférieurs.",
        diagnosis: "Hypertension artérielle bien contrôlée sous traitement",
        treatment: "Poursuite du traitement antihypertenseur actuel",
        recommendations: ["Continuer le traitement", "Contrôle dans 3 mois", "Activité physique régulière"],
        followUp: "3 mois",
        doctor: "Dr. Martin",
        medications: [],
      },
      {
        id: "cons_002",
        patientId: "Jean Martin",
        patientName: "Jean Martin",
        date: "2025-08-18",
        time: "10:15",
        symptoms: ["Douleurs thoraciques", "Essoufflement léger"],
        examination: "ECG normal. Auscultation pulmonaire et cardiaque normale. Palpation thoracique révèle tension musculaire.",
        diagnosis: "Douleurs thoraciques atypiques d'origine musculaire",
        treatment: "Anti-inflammatoires et repos",
        recommendations: ["Éviter les efforts intenses", "Application de chaleur", "Gestion du stress"],
        followUp: "1 semaine si persistance",
        doctor: "Dr. Martin",
        medications: [],
      },
    ];

    const existingConsultations = JSON.parse(localStorage.getItem("consultations") || "[]");
    if (existingConsultations.length === 0) {
      localStorage.setItem("consultations", JSON.stringify(demoConsultations));
    }

    const today = new Date().toISOString().split("T")[0];
    const demoRendezVous = [
      {
        id: "rdv_001",
        username: "Marie Dubois",
        email: "marie.dubois@email.com",
        date: today,
        heure: "09:00",
        specialite: "Cardiologie",
        medecin: "Dr. Martin",
        demande: "Contrôle de routine hypertension",
        isNew: false,
      },
      {
        id: "rdv_002",
        username: "Pierre Durand",
        email: "pierre.durand@email.com",
        date: today,
        heure: "10:30",
        specialite: "Cardiologie",
        medecin: "Dr. Martin",
        demande: "Première consultation - douleurs thoraciques",
        isNew: true,
      },
      {
        id: "rdv_003",
        username: "Sophie Bernard",
        email: "sophie.bernard@email.com",
        date: today,
        heure: "14:00",
        specialite: "Cardiologie",
        medecin: "Dr. Martin",
        demande: "Bilan cardiaque annuel",
        isNew: false,
      },
      {
        id: "rdv_004",
        username: "Jean Martin",
        email: "jean.martin@email.com",
        date: today,
        heure: "15:30",
        specialite: "Cardiologie",
        medecin: "Dr. Martin",
        demande: "Suivi douleurs thoraciques",
        isNew: true,
      },
    ];

    const existingRendezVous = JSON.parse(localStorage.getItem("rendezVous") || "[]");
    if (existingRendezVous.length === 0) {
      localStorage.setItem("rendezVous", JSON.stringify(demoRendezVous));
    }

    const demoSlots = [
      {
        id: "slot_001",
        jour: "Lundi",
        heureDebut: "08:00",
        heureFin: "12:00",
        dureeConsultation: "30",
        typeConsultation: "consultation",
        salleConsultation: "Cabinet A",
        maxPatients: "8",
        medecin: "Dr. Martin",
      },
      {
        id: "slot_002",
        jour: "Lundi",
        heureDebut: "14:00",
        heureFin: "18:00",
        dureeConsultation: "30",
        typeConsultation: "consultation",
        salleConsultation: "Cabinet A",
        maxPatients: "8",
        medecin: "Dr. Martin",
      },
      {
        id: "slot_003",
        jour: "Mardi",
        heureDebut: "08:00",
        heureFin: "12:00",
        dureeConsultation: "45",
        typeConsultation: "suivi",
        salleConsultation: "Cabinet A",
        maxPatients: "6",
        medecin: "Dr. Martin",
      },
    ];

    const existingSlots = JSON.parse(localStorage.getItem("slots") || "[]");
    if (existingSlots.length === 0) {
      localStorage.setItem("slots", JSON.stringify(demoSlots));
    }

    const demoPrescriptions = [
      {
        id: "pres_001",
        consultationId: "cons_001",
        patientName: "Marie Dubois",
        doctor: "Dr. Martin",
        date: "2025-08-20",
        medications: [
          { name: "Amlodipine", dosage: "5mg", frequency: "1 fois par jour", duration: "3 mois" },
          { name: "Lisinopril", dosage: "10mg", frequency: "1 fois par jour le matin", duration: "3 mois" },
        ],
        instructions: "Prendre les médicaments avec un verre d'eau, de préférence le matin. Surveiller la tension artérielle.",
        createdAt: "2025-08-20T14:30:00.000Z",
      },
    ];

    const existingPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    if (existingPrescriptions.length === 0) {
      localStorage.setItem("prescriptions", JSON.stringify(demoPrescriptions));
    }
  };

  const loadAppointmentsAndAlerts = useCallback(() => {
    if (!currentUser) return;

    initializeDemoData();

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const username = userData?.username || "Dr. Martin";
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const medecinData = users.find((user) => user.username === username && user.role === "medecin") || {};
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
      .filter((user) => user.role === "patient")
      .map((user) => ({
        id: user.username,
        username: user.username,
        age: user.age || "Inconnu",
        email: user.email || "N/A",
        telephone: user.telephone || "N/A",
      }));
    setPatients(patientList);

    const today = new Date().toISOString().split("T")[0];
    const storedRendezVous = JSON.parse(localStorage.getItem("rendezVous") || "[]");
    const rdvToday = storedRendezVous
      .filter((rdv) => {
        const isSameDay = rdv.date === today;
        const isAssignedToMedecin =
          rdv.medecin === username || (!rdv.medecin && rdv.specialite.toLowerCase() === medecinProfile.specialite.toLowerCase());
        return isSameDay && isAssignedToMedecin;
      })
      .map((rdv) => {
        const parsedUsername =
          typeof rdv.username === "string" && rdv.username.startsWith("{")
            ? JSON.parse(rdv.username)?.username || rdv.username
            : rdv.username;
        return {
          id: rdv.id,
          username: parsedUsername,
          age: users.find((user) => user.username === parsedUsername)?.age || "Inconnu",
          email: rdv.email || "N/A",
          time: rdv.heure || rdv.time,
          date: rdv.date,
          isNew: rdv.isNew || false,
          motif: rdv.demande || "Non spécifié",
          statusInfo: getAppointmentStatus(rdv.date, rdv.heure || rdv.time),
        };
      });
    setRdvDuJour(rdvToday);

    const newRdvAlerts = rdvToday
      .filter((rdv) => rdv.isNew)
      .map((rdv) => ({
        id: `rdv-${rdv.id}`,
        message: `Nouveau rendez-vous : ${rdv.username} le ${rdv.date} à ${rdv.time}`,
      }));
    setAlerts(newRdvAlerts);

    const storedSlots = JSON.parse(localStorage.getItem("slots") || "[]");
    setCreneaux(storedSlots.filter((slot) => slot.medecin === username));
  }, [currentUser]);

  useEffect(() => {
    loadAppointmentsAndAlerts();
    addToHistory?.("Connexion", `Connexion au tableau de bord médecin`, currentUser);
  }, [loadAppointmentsAndAlerts, addToHistory, currentUser]);

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts && alerts.length > 0) {
      const updatedRdv = rdvDuJour.map((rdv) => ({ ...rdv, isNew: false }));
      setRdvDuJour(updatedRdv);

      const storedRendezVous = JSON.parse(localStorage.getItem("rendezVous") || "[]");
      const updatedStoredRendezVous = storedRendezVous.map((rdv) => {
        const foundRdv = updatedRdv.find((updated) => updated.id === rdv.id);
        return foundRdv ? { ...rdv, isNew: foundRdv.isNew } : rdv;
      });
      localStorage.setItem("rendezVous", JSON.stringify(updatedStoredRendezVous));

      setAlerts([]);
      addToHistory?.("Consultation alertes", "Consultation et marquage des alertes comme lues", currentUser);
    }
  };

  const navigateTo = (view) => {
    setSecondaryView(view);
    setShowAlerts(false);
    addToHistory?.("Navigation", `Accès à la vue ${view}`, currentUser);
  };

  const handleProfilChange = (field, value) => {
    setProfilData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfil = () => {
    setMedecin((prev) => ({ ...prev, ...profilData }));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const username = JSON.parse(localStorage.getItem("user") || "{}")?.username || "Dr. Martin";
    const updatedUsers = users.map((user) =>
      user.username === username ? { ...user, ...profilData, role: "medecin" } : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const currentUserData = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...currentUserData, ...profilData, role: "medecin" }));

    addToHistory?.("Mise à jour profil", "Sauvegarde des modifications du profil", currentUser);
    setSecondaryView("patients");
  };

  const handleCreneauInputChange = (field, value) => {
    setCreneauData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCreneau = () => {
    const username = JSON.parse(localStorage.getItem("user") || "{}")?.username || "Dr. Martin";
    const dataToSave = { ...creneauData, medecin: username };
    const storedSlots = JSON.parse(localStorage.getItem("slots") || "[]");

    if (editingId) {
      const updatedCreneaux = creneaux.map((c) => (c.id === editingId ? { ...c, ...dataToSave } : c));
      setCreneaux(updatedCreneaux);
      localStorage.setItem("slots", JSON.stringify(storedSlots.map((s) => (s.id === editingId ? { ...s, ...dataToSave } : s))));
      setSuccessMessage("Créneau modifié avec succès !");
      setEditingId(null);
      addToHistory?.("Modification créneau", "Modification d'un créneau existant", currentUser);
    } else {
      const newCreneau = { id: Date.now().toString(), ...dataToSave };
      setCreneaux((prev) => [...prev, newCreneau]);
      localStorage.setItem("slots", JSON.stringify([...storedSlots, newCreneau]));
      setSuccessMessage("Créneau ajouté avec succès !");
      addToHistory?.("Création créneau", "Création d'un nouveau créneau", currentUser);
    }

    setShowSuccess(true);
    setModalOpen(false);
    setCreneauData({
      jour: "",
      heureDebut: "09:00",
      heureFin: "17:00",
      dureeConsultation: "30",
      typeConsultation: "consultation",
      salleConsultation: "Salle 1",
      maxPatients: "8",
    });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleEditCreneau = (c) => {
    setCreneauData({ ...c });
    setEditingId(c.id);
    setModalOpen(true);
    addToHistory?.("Édition créneau", "Ouverture de l'édition d'un créneau", currentUser);
  };

  const handleDeleteCreneau = (id) => {
    setCreneaux((prev) => prev.filter((c) => c.id !== id));
    const storedSlots = JSON.parse(localStorage.getItem("slots") || "[]");
    localStorage.setItem("slots", JSON.stringify(storedSlots.filter((s) => s.id !== id)));
    setSuccessMessage("Créneau supprimé avec succès !");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    addToHistory?.("Suppression créneau", "Suppression d'un créneau", currentUser);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center border-b border-border pb-5">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          Bienvenue, {medecin?.username || "Médecin"}
        </h1>
      </div>
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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors rounded-xl"
              onClick={() => navigateTo("planning")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Gérer le planning
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
      <div className="bg-white rounded-2xl shadow-md border border-border mt-8">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-primary text-center w-full flex items-center justify-center gap-2">
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
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowPatientModal(true);
                          addToHistory?.(
                            "Consultation patient",
                            `Consultation des détails du patient: ${patient.username}`,
                            currentUser
                          );
                        }}
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
    <div className="bg-white rounded-2xl shadow-md border border-border mt-8">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-primary text-center w-full flex items-center justify-center gap-2">
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

  const renderPlanningPage = () => (
    <div className="bg-white rounded-2xl shadow-md border border-border mt-8">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-primary text-center w-full flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          Créneaux existants ({creneaux.length})
        </h3>
      </div>
      <div className="p-6">
        {showSuccess && (
          <Alert className="border-green-300 bg-green-50 animate-fade-in rounded-xl mb-6">
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground transition-colors rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Ajouter créneau
          </Button>
        </div>
        {creneaux.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <p>Aucun créneau créé pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border min-w-[700px]">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Jour</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Horaires</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Durée</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Type</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Salle</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Max patients</th>
                  <th className="border p-2 text-left text-sm font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {creneaux.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="border p-2 text-sm font-medium text-foreground">{c.jour}</td>
                    <td className="border p-2 text-sm text-muted-foreground">{c.heureDebut} - {c.heureFin}</td>
                    <td className="border p-2 text-sm text-muted-foreground">{c.dureeConsultation} min</td>
                    <td className="border p-2 text-sm text-muted-foreground">{c.typeConsultation}</td>
                    <td className="border p-2 text-sm text-muted-foreground">{c.salleConsultation}</td>
                    <td className="border p-2 text-sm text-muted-foreground">{c.maxPatients}</td>
                    <td className="border p-2 text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCreneau(c)}
                          className="rounded-xl"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCreneau(c.id)}
                          className="rounded-xl"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-6 text-center w-full text-blue-600">
            {editingId ? "Modifier le créneau" : "Créer un nouveau créneau"}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-muted/30 p-5 rounded-xl border border-border">
                <div className="space-y-5">
                  <div>
                    <Label className="block text-base font-medium text-foreground mb-3">Jour *</Label>
                    <select
                      value={creneauData.jour}
                      onChange={(e) => handleCreneauInputChange("jour", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                      <option value="">Sélectionner un jour</option>
                      {joursOptions.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label className="block text-base font-medium text-foreground mb-3">Heure début *</Label>
                      <Input
                        type="time"
                        value={creneauData.heureDebut}
                        onChange={(e) => handleCreneauInputChange("heureDebut", e.target.value)}
                        className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <Label className="block text-base font-medium text-foreground mb-3">Heure fin *</Label>
                      <Input
                        type="time"
                        value={creneauData.heureFin}
                        onChange={(e) => handleCreneauInputChange("heureFin", e.target.value)}
                        className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-base font-medium text-foreground mb-3">Durée par consultation *</Label>
                    <select
                      value={creneauData.dureeConsultation}
                      onChange={(e) => handleCreneauInputChange("dureeConsultation", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="90">1h30</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-muted/30 p-5 rounded-xl border border-border">
                <div className="space-y-5">
                  <div>
                    <Label className="block text-base font-medium text-foreground mb-3">Type de consultation</Label>
                    <select
                      value={creneauData.typeConsultation}
                      onChange={(e) => handleCreneauInputChange("typeConsultation", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                    >
                      <option value="consultation">Consultation générale</option>
                      <option value="suivi">Suivi patient</option>
                      <option value="urgence">Urgence</option>
                      <option value="controle">Contrôle post-opératoire</option>
                      <option value="preventif">Consultation préventive</option>
                    </select>
                  </div>
                  <div>
                    <Label className="block text-base font-medium text-foreground mb-3">Salle de consultation</Label>
                    <Input
                      type="text"
                      value={creneauData.salleConsultation}
                      onChange={(e) => handleCreneauInputChange("salleConsultation", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20"
                      placeholder="Ex: Salle 1, Cabinet A..."
                    />
                  </div>
                  <div>
                    <Label className="block text-base font-medium text-foreground mb-3">Nombre maximum de patients</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={creneauData.maxPatients}
                        onChange={(e) => handleCreneauInputChange("maxPatients", e.target.value)}
                        className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 pr-16"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        patients
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="rounded-xl"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveCreneau}
              disabled={!creneauData.jour || !creneauData.heureDebut || !creneauData.heureFin}
              className="bg-primary hover:bg-primary/80 text-primary-foreground transition-colors rounded-xl"
            >
              {editingId ? "Modifier le créneau" : "Créer le créneau"}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );

  const renderConsultationsPage = () => (
    <div className="bg-white rounded-1xl">
      <div className="p-6">
        <EnhancedConsultationsPage
          currentUser={currentUser}
          addToHistory={addToHistory}
          patients={patients}
        />
      </div>
    </div>
  );

  const renderProfilPage = () => (
    <div className="bg-white rounded-2xl shadow-md border border-border mt-8">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-primary text-center w-full flex items-center justify-center gap-2">
          <User className="w-5 h-5" />
          Informations du profil
        </h3>
      </div>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-foreground text-center w-full flex items-center justify-center gap-2">
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
            <h4 className="text-lg font-medium text-foreground text-center w-full">Contact</h4>
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
            onClick={() => setSecondaryView("patients")}
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
      {renderDashboard()}
      {secondaryView === "patients" && renderPatientsPage()}
      {secondaryView === "rdv" && renderRDVPage()}
      {secondaryView === "planning" && renderPlanningPage()}
      {secondaryView === "consultations" && renderConsultationsPage()}
      {secondaryView === "profil" && renderProfilPage()}
      
      {selectedPatient && (
        <PatientMedicalFile
          isOpen={showPatientModal}
          onClose={() => {
            setShowPatientModal(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
          currentUser={currentUser}
          addToHistory={addToHistory}
        />
      )}
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