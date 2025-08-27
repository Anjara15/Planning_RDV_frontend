import { useState, useEffect, useCallback } from "react";
import { Calendar, User, FileText, Save, Pill, Plus, X, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PrescriptionModal = ({ isOpen, onClose, patientName, consultationId, currentUser, addToHistory }) => {
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [instructions, setInstructions] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const generatePrescription = () => {
    const validMedications = medications.filter((med) => med.name.trim() !== "");
    if (validMedications.length === 0 && !instructions.trim()) {
      return;
    }

    const prescription = {
      id: Date.now().toString(),
      consultationId,
      patientName,
      doctor: currentUser?.username || "Dr. Martin",
      date: new Date().toISOString().split("T")[0],
      medications: validMedications,
      instructions,
      createdAt: new Date().toISOString(),
    };

    const storedPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    localStorage.setItem("prescriptions", JSON.stringify([...storedPrescriptions, prescription]));

    const storedConsultations = JSON.parse(localStorage.getItem("consultations") || "[]");
    const updatedConsultations = storedConsultations.map((consultation) =>
      consultation.id === consultationId ? { ...consultation, medications: validMedications } : consultation
    );
    localStorage.setItem("consultations", JSON.stringify(updatedConsultations));

    addToHistory?.("Génération ordonnance", `Ordonnance générée pour ${patientName}`, currentUser);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-primary">Génération d'Ordonnance</h2>
                <p className="text-muted-foreground">Patient : {patientName}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} className="rounded-xl">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {showSuccess && (
            <Alert className="border-green-300 bg-green-50">
              <AlertDescription className="text-green-700">
                Ordonnance générée avec succès !
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label className="text-lg font-semibold">Médicaments prescrits</Label>
            <div className="space-y-4 mt-3">
              {medications.map((med, index) => (
                <div key={index} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Médicament {index + 1}</h4>
                    {medications.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom du médicament</Label>
                      <Input
                        value={med.name}
                        onChange={(e) => updateMedication(index, "name", e.target.value)}
                        placeholder="Ex: Paracétamol"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        placeholder="Ex: 500mg"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Fréquence</Label>
                      <Input
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                        placeholder="Ex: 3 fois par jour"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <Label>Durée</Label>
                      <Input
                        value={med.duration}
                        onChange={(e) => updateMedication(index, "duration", e.target.value)}
                        placeholder="Ex: 7 jours"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addMedication}
                className="w-full rounded-xl border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un médicament
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold">Instructions spéciales</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions particulières pour le patient..."
              rows={4}
              className="rounded-xl mt-3"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Annuler
            </Button>
            <Button
              onClick={generatePrescription}
              disabled={medications.every((med) => med.name.trim() === "") && !instructions.trim()}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              Générer l'ordonnance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedConsultationsPage = ({ currentUser, addToHistory, patients }) => {
  const [consultations, setConsultations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [currentRecommendation, setCurrentRecommendation] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedConsultationForPrescription, setSelectedConsultationForPrescription] = useState("");
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showGeneratePrescriptionButton, setShowGeneratePrescriptionButton] = useState(false);
  const [lastSavedConsultationId, setLastSavedConsultationId] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    symptoms: [],
    examination: "",
    diagnosis: "",
    treatment: "",
    recommendations: [],
    followUp: "",
    medications: [],
  });

  const loadConsultations = useCallback(() => {
    const storedConsultations = JSON.parse(localStorage.getItem("consultations") || "[]");
    const doctorConsultations = storedConsultations.filter(
      (consultation) => consultation.doctor === currentUser?.username
    );
    setConsultations(doctorConsultations);
  }, [currentUser]);

  useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  const handleFormSubmit = () => {
    if (!formData.patientId || !formData.examination || !formData.diagnosis) {
      return;
    }

    const newConsultation = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: formData.patientName || "",
      date: formData.date || "",
      time: formData.time || "",
      symptoms: formData.symptoms || [],
      examination: formData.examination || "",
      diagnosis: formData.diagnosis || "",
      treatment: formData.treatment || "",
      recommendations: formData.recommendations || [],
      followUp: formData.followUp || "",
      doctor: currentUser?.username || "Dr. Martin",
      medications: formData.medications || [],
    };

    const storedConsultations = JSON.parse(localStorage.getItem("consultations") || "[]");
    const updatedConsultations = [...storedConsultations, newConsultation];
    localStorage.setItem("consultations", JSON.stringify(updatedConsultations));

    const medicalRecords = JSON.parse(localStorage.getItem("medicalRecords") || "[]");
    const newMedicalRecord = {
      id: newConsultation.id,
      patientId: newConsultation.patientId,
      date: newConsultation.date,
      type: "consultation",
      title: `Consultation du ${new Date(newConsultation.date).toLocaleDateString("fr-FR")}`,
      description: newConsultation.examination,
      doctor: newConsultation.doctor,
      symptoms: newConsultation.symptoms,
      diagnosis: newConsultation.diagnosis,
      recommendations: newConsultation.recommendations,
    };
    localStorage.setItem("medicalRecords", JSON.stringify([...medicalRecords, newMedicalRecord]));

    setConsultations([...consultations, newConsultation]);
    setSuccessMessage("Note de consultation enregistrée avec succès !");
    setShowSuccess(true);
    setShowGeneratePrescriptionButton(true);
    setLastSavedConsultationId(newConsultation.id);
    setSelectedPatientForPrescription(newConsultation.patientName);

    addToHistory?.("Nouvelle consultation", `Consultation enregistrée pour ${newConsultation.patientName}`, currentUser);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    resetForm();
  };

  const handleGeneratePrescriptionClick = () => {
    setSelectedConsultationForPrescription(lastSavedConsultationId);
    setShowPrescriptionModal(true);
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      patientName: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      symptoms: [],
      examination: "",
      diagnosis: "",
      treatment: "",
      recommendations: [],
      followUp: "",
      medications: [],
    });
    setShowForm(false);
  };

  const addSymptom = () => {
    if (currentSymptom.trim()) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), currentSymptom.trim()],
      }));
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (index) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms?.filter((_, i) => i !== index) || [],
    }));
  };

  const addRecommendation = () => {
    if (currentRecommendation.trim()) {
      setFormData((prev) => ({
        ...prev,
        recommendations: [...(prev.recommendations || []), currentRecommendation.trim()],
      }));
      setCurrentRecommendation("");
    }
  };

  const removeRecommendation = (index) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: prev.recommendations?.filter((_, i) => i !== index) || [],
    }));
  };

  const handlePatientSelect = (patientId) => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    setFormData((prev) => ({
      ...prev,
      patientId,
      patientName: selectedPatient?.username || "",
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-primary">Consultations</h2>
            <p className="text-muted-foreground">Gérer les notes de consultation</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle consultation
        </Button>
      </div>

      {showSuccess && (
        <Alert className="border-green-300 bg-green-50">
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <div className="bg-white border border-border rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-semibold text-primary">Nouvelle note de consultation</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Patient *</Label>
              <select
                value={formData.patientId}
                onChange={(e) => handlePatientSelect(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border border-border focus:ring-4 focus:ring-primary/20 focus:outline-none"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.username} ({patient.age} ans)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label>Heure *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label>Symptômes</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                placeholder="Ajouter un symptôme"
                className="rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && addSymptom()}
              />
              <Button onClick={addSymptom} variant="outline" className="rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.symptoms?.map((symptom, index) => (
                <Badge key={index} variant="secondary" className="rounded-xl">
                  {symptom}
                  <button
                    onClick={() => removeSymptom(index)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Examen clinique *</Label>
            <Textarea
              value={formData.examination}
              onChange={(e) => setFormData((prev) => ({ ...prev, examination: e.target.value }))}
              placeholder="Décrire l'examen clinique..."
              rows={4}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label>Diagnostic *</Label>
            <Textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="Diagnostic médical..."
              rows={3}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label>Traitement proposé</Label>
            <Textarea
              value={formData.treatment}
              onChange={(e) => setFormData((prev) => ({ ...prev, treatment: e.target.value }))}
              placeholder="Traitement recommandé..."
              rows={3}
              className="rounded-xl"
            />
          </div>

          <div>
            <Label>Recommandations</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={currentRecommendation}
                onChange={(e) => setCurrentRecommendation(e.target.value)}
                placeholder="Ajouter une recommandation"
                className="rounded-xl"
                onKeyPress={(e) => e.key === "Enter" && addRecommendation()}
              />
              <Button onClick={addRecommendation} variant="outline" className="rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.recommendations?.map((rec, index) => (
                <Badge key={index} variant="outline" className="rounded-xl">
                  {rec}
                  <button
                    onClick={() => removeRecommendation(index)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Suivi recommandé</Label>
            <Input
              value={formData.followUp}
              onChange={(e) => setFormData((prev) => ({ ...prev, followUp: e.target.value }))}
              placeholder="Délai pour le prochain rendez-vous..."
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={resetForm} className="rounded-xl">
              Annuler
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={!formData.patientId || !formData.examination || !formData.diagnosis}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
            {showGeneratePrescriptionButton && (
              <Button
                onClick={handleGeneratePrescriptionClick}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                Générer l'ordonnance
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Historique des consultations</h3>
        {consultations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <p>Aucune consultation enregistrée</p>
          </div>
        ) : (
          consultations.map((consultation) => (
            <div key={consultation.id} className="border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{consultation.patientName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(consultation.date).toLocaleDateString("fr-FR")} à {consultation.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedConsultationForPrescription(consultation.id);
                      setSelectedPatientForPrescription(consultation.patientName);
                      setShowPrescriptionModal(true);
                    }}
                    className="rounded-xl text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Ordonnance
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {consultation.symptoms.length > 0 && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Symptômes :</h5>
                    <div className="flex flex-wrap gap-2">
                      {consultation.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="rounded-xl">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="font-medium text-foreground mb-2">Examen :</h5>
                  <p className="text-muted-foreground">{consultation.examination}</p>
                </div>

                <div>
                  <h5 className="font-medium text-foreground mb-2">Diagnostic :</h5>
                  <p className="text-muted-foreground bg-muted/30 p-3 rounded-xl">
                    {consultation.diagnosis}
                  </p>
                </div>

                {consultation.treatment && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Traitement :</h5>
                    <p className="text-muted-foreground">{consultation.treatment}</p>
                  </div>
                )}

                {consultation.recommendations.length > 0 && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Recommandations :</h5>
                    <ul className="space-y-1">
                      {consultation.recommendations.map((rec, index) => (
                        <li key={index} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {consultation.medications.length > 0 && (
                  <div>
                    <h5 className="font-medium text-foreground mb-2">Médicaments prescrits :</h5>
                    <ul className="space-y-1">
                      {consultation.medications.map((med, index) => (
                        <li key={index} className="text-muted-foreground">
                          {med.name} ({med.dosage}, {med.frequency}, {med.duration})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false);
          setShowGeneratePrescriptionButton(false);
        }}
        patientName={selectedPatientForPrescription}
        consultationId={selectedConsultationForPrescription}
        currentUser={currentUser}
        addToHistory={addToHistory}
      />
    </div>
  );
};

export default EnhancedConsultationsPage;