import { useState, useEffect } from "react";
import { X, FileText, Calendar, User, Heart, Pill, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PropTypes from "prop-types";

const PatientMedicalFile = ({ isOpen, onClose, patient, currentUser, addToHistory }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [_prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState("consultations");

  useEffect(() => {
    if (isOpen && patient) {
      loadPatientMedicalHistory();
    }
  }, [isOpen, patient]);

  const loadPatientMedicalHistory = () => {
    const storedRecords = JSON.parse(localStorage.getItem("medicalRecords") || "[]");
    const storedPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    
    const patientRecords = storedRecords.filter((record) => record.patientId === patient.id);
    const patientPrescriptions = storedPrescriptions
      .filter((prescription) => prescription.patientName === patient.username)
      .map((prescription) => ({
        id: prescription.id,
        patientId: patient.id,
        date: prescription.date,
        type: "prescription",
        title: `Ordonnance du ${new Date(prescription.date).toLocaleDateString("fr-FR")}`,
        description: prescription.instructions || "Aucune instruction spécifique",
        doctor: prescription.doctor,
        medications: prescription.medications,
      }));

    setMedicalRecords([...patientRecords, ...patientPrescriptions]);
    setPrescriptions(patientPrescriptions);
    
    addToHistory?.(
      "Consultation dossier médical",
      `Ouverture du dossier médical de ${patient.username}`,
      currentUser
    );
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "consultation":
        return <FileText className="w-4 h-4" />;
      case "prescription":
        return <Pill className="w-4 h-4" />;
      case "analysis":
        return <Heart className="w-4 h-4" />;
      case "surgery":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getRecordColor = (type) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800";
      case "prescription":
        return "bg-green-100 text-green-800";
      case "analysis":
        return "bg-purple-100 text-purple-800";
      case "surgery":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative">
        {/* Close button without white header */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="rounded-xl absolute top-4 right-4"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Patient Info Summary (sans barre d'entête) */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-medium">{patient.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Âge</p>
                <p className="font-medium">{patient.age} ans</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Dossiers</p>
                <p className="font-medium">{medicalRecords.length} entrées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-6 pb-0">
          <Button
            variant={activeTab === "consultations" ? "default" : "ghost"}
            onClick={() => setActiveTab("consultations")}
            className="rounded-xl"
          >
            Consultations
          </Button>
          <Button
            variant={activeTab === "prescriptions" ? "default" : "ghost"}
            onClick={() => setActiveTab("prescriptions")}
            className="rounded-xl"
          >
            Ordonnances
          </Button>
          <Button
            variant={activeTab === "analyses" ? "default" : "ghost"}
            onClick={() => setActiveTab("analyses")}
            className="rounded-xl"
          >
            Analyses
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {medicalRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Aucun dossier médical
              </h3>
              <p className="text-muted-foreground">
                Ce patient n'a pas encore de dossier médical enregistré.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalRecords
                .filter((record) => {
                  if (activeTab === "consultations") return record.type === "consultation";
                  if (activeTab === "prescriptions") return record.type === "prescription";
                  if (activeTab === "analyses") return record.type === "analysis";
                  return true;
                })
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                  <div
                    key={record.id}
                    className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${getRecordColor(record.type)}`}>
                          {getRecordIcon(record.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{record.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(record.date)} • Dr. {record.doctor}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-xl">
                        {record.type === "consultation"
                          ? "Consultation"
                          : record.type === "prescription"
                          ? "Ordonnance"
                          : record.type === "analysis"
                          ? "Analyse"
                          : "Chirurgie"}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <p className="text-muted-foreground">{record.description}</p>

                      {record.symptoms && record.symptoms.length > 0 && (
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Symptômes :</h5>
                          <div className="flex flex-wrap gap-2">
                            {record.symptoms.map((symptom, index) => (
                              <Badge key={index} variant="secondary" className="rounded-xl">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.diagnosis && (
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Diagnostic :</h5>
                          <p className="text-muted-foreground bg-muted/30 p-3 rounded-xl">
                            {record.diagnosis}
                          </p>
                        </div>
                      )}

                      {record.medications && record.medications.length > 0 && (
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Médicaments prescrits :</h5>
                          <div className="space-y-1">
                            {record.medications.map((med, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-muted-foreground"
                              >
                                <Pill className="w-4 h-4" />
                                <span>
                                  {typeof med === "string"
                                    ? med
                                    : `${med.name} (${med.dosage}, ${med.frequency}, ${med.duration})`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.recommendations && record.recommendations.length > 0 && (
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Recommandations :</h5>
                          <ul className="space-y-1">
                            {record.recommendations.map((rec, index) => (
                              <li
                                key={index}
                                className="text-muted-foreground flex items-start gap-2"
                              >
                                <span className="text-primary mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Dernière consultation :{" "}
              {medicalRecords.length > 0
                ? formatDate(
                    medicalRecords.sort(
                      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0].date
                  )
                : "Aucune consultation"}
            </p>
            <Button onClick={onClose} className="rounded-xl">
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

PatientMedicalFile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    telephone: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    specialite: PropTypes.string,
    email: PropTypes.string,
  }),
  addToHistory: PropTypes.func,
};

export default PatientMedicalFile;