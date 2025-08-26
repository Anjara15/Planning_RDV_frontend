import { useState } from "react";
import { Calendar, Plus, Edit, Trash2, X, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; 


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

const CreneauForm = ({ onSave, addToHistory, currentUser }) => {
  const navigate = useNavigate();
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

  const joursOptions = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const handleInputChange = (field, value) => {
    setCreneauData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCreneauxCount = () => {
    if (!creneauData.heureDebut || !creneauData.heureFin || !creneauData.dureeConsultation) return 0;
    const startTime = new Date(`2000-01-01T${creneauData.heureDebut}:00`);
    const endTime = new Date(`2000-01-01T${creneauData.heureFin}:00`);
    const duration = parseInt(creneauData.dureeConsultation);
    const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return Math.floor(totalMinutes / duration);
  };

  const handleSave = () => {
    const dataToSave = { ...creneauData };
    if (editingId) {
      setCreneaux(prev =>
        prev.map(c => (c.id === editingId ? { ...c, ...dataToSave } : c))
      );
      setSuccessMessage("Créneau modifié avec succès !");
      setEditingId(null);
      addToHistory?.("Modification créneau", "Modification d'un créneau existant", currentUser);
    } else {
      const newCreneau = { id: Date.now().toString(), ...dataToSave };
      setCreneaux(prev => [...prev, newCreneau]);
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
    onSave?.(dataToSave);
  };

  const handleEdit = (c) => {
    setCreneauData({ ...c });
    setEditingId(c.id);
    setModalOpen(true);
    addToHistory?.("Édition créneau", "Ouverture de l'édition d'un créneau", currentUser);
  };

  const handleDelete = (id) => {
    setCreneaux(prev => prev.filter(c => c.id !== id));
    setSuccessMessage("Créneau supprimé avec succès !");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    addToHistory?.("Suppression créneau", "Suppression d'un créneau", currentUser);
  };

  return (
    <main className="min-h-screen container mx-auto px-6 py-12 space-y-12 bg-background text-foreground">
    <Header logout={() => {
      console.log("Déconnexion effectuée !");
    }} />
    
      <div className="flex justify-between items-center border-b border-border pb-5">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-primary tracking-tight flex items-center gap-3">
              <Calendar className="w-7 h-7" />
              Gestion des créneaux
            </h1>
          </div>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground transition-colors rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Ajouter créneau
        </Button>
      </div>

      {/* Alert succès */}
      {showSuccess && (
        <Alert className="border-green-300 bg-green-50 animate-fade-in rounded-xl">
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
       <h3 className="text-xl font-semibold mb-6 flex justify-center items-center gap-2 text-blue-600">
          {editingId ? "Modifier le créneau" : "Créer un nouveau créneau"}
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-muted/30 p-5 rounded-xl border border-border">
              <div className="space-y-5">
                <div>
                  <label className="block text-base font-medium text-foreground mb-3">Jour *</label>
                  <select
                    value={creneauData.jour}
                    onChange={(e) => handleInputChange("jour", e.target.value)}
                    className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                  >
                    <option value="">Sélectionner un jour</option>
                    {joursOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-base font-medium text-foreground mb-3">Heure début *</label>
                    <input
                      type="time"
                      value={creneauData.heureDebut}
                      onChange={(e) => handleInputChange("heureDebut", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-foreground mb-3">Heure fin *</label>
                    <input
                      type="time"
                      value={creneauData.heureFin}
                      onChange={(e) => handleInputChange("heureFin", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-3">Durée par consultation *</label>
                  <select
                    value={creneauData.dureeConsultation}
                    onChange={(e) => handleInputChange("dureeConsultation", e.target.value)}
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
                  <label className="block text-base font-medium text-foreground mb-3">Type de consultation</label>
                  <select
                    value={creneauData.typeConsultation}
                    onChange={(e) => handleInputChange("typeConsultation", e.target.value)}
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
                  <label className="block text-base font-medium text-foreground mb-3">Salle de consultation</label>
                  <input
                    type="text"
                    value={creneauData.salleConsultation}
                    onChange={(e) => handleInputChange("salleConsultation", e.target.value)}
                    className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="Ex: Salle 1, Cabinet A..."
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-foreground mb-3">Nombre maximum de patients</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={creneauData.maxPatients}
                      onChange={(e) => handleInputChange("maxPatients", e.target.value)}
                      className="w-full rounded-xl px-5 py-4 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all pr-16"
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
            onClick={handleSave}
            disabled={!creneauData.jour || !creneauData.heureDebut || !creneauData.heureFin}
            className="bg-primary hover:bg-primary/80 text-primary-foreground transition-colors rounded-xl"
          >
            {editingId ? "Modifier le créneau" : "Créer le créneau"}
          </Button>
        </div>
      </Modal>

      {/* Liste des créneaux */}
      <div className="bg-white rounded-2xl shadow-md border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-primary justify-center flex items-center gap-2">
            <Calendar className="w-5 h-5" /> 
            Créneaux existants ({creneaux.length})
          </h3>
        </div>

        <div className="p-6">
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
                  {creneaux.map(c => (
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
                            onClick={() => handleEdit(c)}
                            className="rounded-xl"
                          >
                            <Edit className="w-4 h-4 mr-1" /> Modifier
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(c.id)}
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
        </div>
      </div>
    </main>
  );
};

CreneauForm.propTypes = {
  onSave: PropTypes.func,
  addToHistory: PropTypes.func,
  currentUser: PropTypes.object,
};

export default CreneauForm;