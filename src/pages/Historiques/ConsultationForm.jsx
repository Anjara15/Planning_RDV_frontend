import { useState } from "react";
import { FileText, Plus, Search, Eye, X, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EnhancedConsultationsPage = ({ currentUser, addToHistory, patients = [] }) => {
  const [currentMode, setCurrentMode] = useState("overview");
  
  const [consultations] = useState([
    {
      id: "1",
      patient: "Marie Dubois",
      date: "2024-01-15",
      diagnostic: "Hypertension artérielle légère",
      traitement: "Amlodipine 5mg - 1cp/jour le matin",
      observations: "Patiente en surpoids. Recommandations diététiques données.",
      prochainRdv: "2024-02-15",
      symptomatic: "Céphalées matinales, fatigue",
      tensionArterielle: "145/90",
      pouls: "78",
      temperature: "36.8",
    },
    {
      id: "2",
      patient: "Jean Martin",
      date: "2024-01-14",
      diagnostic: "Diabète type 2 - contrôle",
      traitement: "Metformine 850mg - 2cp/jour aux repas",
      observations: "Glycémie bien contrôlée. Hémoglobine glyquée stable.",
      prochainRdv: "2024-04-14",
      symptomatic: "Aucun symptôme particulier",
      tensionArterielle: "130/80",
      pouls: "72",
      temperature: "36.5",
    },
  ]);

  const handleNewConsultation = () => {
    setCurrentMode("new");
    addToHistory?.("Ajout note", "Ouverture du formulaire de nouvelle consultation", currentUser);
  };

  const handleShowHistory = () => {
    setCurrentMode("history");
    addToHistory?.("Consultation historique", "Consultation de l'historique des consultations", currentUser);
  };

  const handleShowOverview = () => {
    setCurrentMode("overview");
  };

  const renderOverview = () => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-blue-600  justify-center flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Historique des consultations
        </h3>
      </div>
      <div className="p-6">
        <div className="text-center text-gray-600 py-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium mb-2">Consultations et notes médicales</h4>
          <p className="mb-6">Accédez à l'historique complet des consultations et gérez vos notes</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-2"
              onClick={handleNewConsultation}
            >
              <Plus className="w-4 h-4" />
              Nouvelles notes
            </Button>
            <Button
              variant="outline"
              className="rounded-xl flex items-center gap-2"
              onClick={handleShowHistory}
            >
              <Search className="w-4 h-4" />
              Historique
            </Button>
            <Button
              variant="outline"
              className="rounded-xl flex items-center gap-2"
              onClick={() => addToHistory?.("Recherche consultations", "Recherche dans les consultations", currentUser)}
            >
              <Eye className="w-4 h-4" />
              Rechercher
            </Button>
          </div>
        </div>
        
        {/* Aperçu des dernières consultations */}
        {consultations.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Dernières consultations</h4>
              <Badge variant="outline">{consultations.length} consultations</Badge>
            </div>
            <div className="space-y-4">
              {consultations.slice(0, 3).map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleShowHistory}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-semibold text-gray-900">{consultation.patient}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(consultation.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Diagnostic:</strong> {consultation.diagnostic}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Traitement:</strong> {consultation.traitement.substring(0, 80)}...
                      </p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {consultations.length > 3 && (
                <Button
                  variant="ghost" 
                  className="w-full"
                  onClick={handleShowHistory}
                >
                  Voir toutes les consultations ({consultations.length})
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNewConsultationForm = () => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          Nouvelle consultation
        </h3>
        <div className="flex gap-2">
         
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShowOverview}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <ConsultationFormContent 
          onSave={(data) => {
            console.log("Consultation sauvegardée:", data);
            addToHistory?.("Nouvelle consultation", `Consultation ajoutée pour ${data.patient}`, currentUser);
            handleShowOverview();
          }}
          onCancel={handleShowOverview}
          patients={patients}
        />
      </div>
    </div>
  );

  const renderHistoryView = () => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Historique des consultations
          <Badge variant="outline" className="ml-2">
            {consultations.length}
          </Badge>
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleNewConsultation}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle consultation
          </Button>
           <Button
            variant="ghost"
            size="icon"
            onClick={handleShowOverview}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <ConsultationHistoryContent 
          consultations={consultations}
          onViewDetail={(consultation) => {
            console.log("Voir détails:", consultation);
            addToHistory?.("Consultation détails", `Consultation des détails pour ${consultation.patient}`, currentUser);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentMode === "overview" && renderOverview()}
      {currentMode === "new" && renderNewConsultationForm()}
      {currentMode === "history" && renderHistoryView()}
    </div>
  );
};

const ConsultationFormContent = ({ onSave, onCancel, patients }) => {
  const [formData, setFormData] = useState({
    patient: "",
    date: new Date().toISOString().split('T')[0],
    diagnostic: "",
    traitement: "",
    observations: "",
    prochainRdv: "",
    symptomatic: "",
    tensionArterielle: "",
    pouls: "",
    temperature: "",
  });

  const mockPatients = [
    { id: "1", username: "Marie Dubois", age: "65" },
    { id: "2", username: "Jean Martin", age: "58" },
    { id: "3", username: "Sophie Laurent", age: "42" },
  ];

  const patientsList = patients.length > 0 ? patients : mockPatients;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient *
          </label>
          <select
            value={formData.patient}
            onChange={(e) => handleInputChange("patient", e.target.value)}
            className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
            required
          >
            <option value="">Sélectionner un patient</option>
            {patientsList.map((patient) => (
              <option key={patient.id} value={patient.username}>
                {patient.username} ({patient.age} ans)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de consultation *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
            required
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          Signes vitaux
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tension artérielle
            </label>
            <input
              type="text"
              value={formData.tensionArterielle}
              onChange={(e) => handleInputChange("tensionArterielle", e.target.value)}
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
              placeholder="ex: 120/80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pouls (bpm)
            </label>
            <input
              type="number"
              value={formData.pouls}
              onChange={(e) => handleInputChange("pouls", e.target.value)}
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
              placeholder="ex: 72"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Température (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleInputChange("temperature", e.target.value)}
              className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
              placeholder="ex: 36.5"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagnostic *
        </label>
        <textarea
          value={formData.diagnostic}
          onChange={(e) => handleInputChange("diagnostic", e.target.value)}
          rows={3}
          className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
          placeholder="Diagnostic principal"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Traitement *
        </label>
        <textarea
          value={formData.traitement}
          onChange={(e) => handleInputChange("traitement", e.target.value)}
          rows={3}
          className="w-full rounded-xl px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
          placeholder="Traitement prescrit"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white"
          disabled={!formData.patient || !formData.diagnostic || !formData.traitement}
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

const ConsultationHistoryContent = ({ consultations, onViewDetail }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConsultations = consultations.filter(consultation =>
    consultation.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.diagnostic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par patient ou diagnostic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl px-5 py-4 pl-12 border border-gray-300 focus:ring-4 focus:ring-blue-500/50 focus:outline-none transition-all"
        />
      </div>

      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h4 className="font-semibold text-gray-900">{consultation.patient}</h4>
                  <Badge variant="outline" className="text-xs">
                    {new Date(consultation.date).toLocaleDateString()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Diagnostic:</strong> {consultation.diagnostic}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Traitement:</strong> {consultation.traitement}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetail(consultation)}
                className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="w-4 h-4" />
                Détails
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedConsultationsPage;