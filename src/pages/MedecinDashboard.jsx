import { useEffect, useState, useCallback } from "react";
import { Users2, CalendarCheck, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MedecinDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [rdvDuJour, setRdvDuJour] = useState([]);
  const [medecin, setMedecin] = useState(null);
  const [showPatientsTable, setShowPatientsTable] = useState(false);
  const [showRDVTable, setShowRDVTable] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // status rdv
  const getAppointmentStatus = (date, time) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    const timeDiff = (appointmentDateTime - now) / (1000 * 60); 

    if (timeDiff > 30) {
      return "En attente";
    } else if (timeDiff >= -30 && timeDiff <= 30) {
      return "En cours";
    } else {
      return "Terminé";
    }
  };

  // generation alerts
  const loadAppointmentsAndAlerts = useCallback(() => {
    const medecinConnecteJSON = localStorage.getItem("user");
    if (!medecinConnecteJSON) return;

    const medecinConnecte = JSON.parse(medecinConnecteJSON);
    setMedecin(medecinConnecte);

    const allRdv = JSON.parse(localStorage.getItem("rendezVous") || "[]");

    const rdvMedecin = allRdv.filter(rdv => {
      let rdvUser = rdv.username;
      if (typeof rdvUser === "string") {
        try {
          rdvUser = JSON.parse(rdvUser);
        } catch {
          rdvUser = { username: rdv.username };
        }
      }
      return (
        rdv.specialite &&
        medecinConnecte.specialite &&
        rdv.specialite.toLowerCase() === medecinConnecte.specialite.toLowerCase()
      );
    });

    const uniquePatientsMap = new Map();
    rdvMedecin.forEach(rdv => {
      let patient = rdv.username;
      if (typeof patient === "string") {
        try {
          patient = JSON.parse(patient);
        } catch {
          patient = { username: rdv.username };
        }
      }
      const emailKey = patient.email || rdv.email || patient.username || `unknown-${rdv.id}`;
      if (!uniquePatientsMap.has(emailKey)) {
        uniquePatientsMap.set(emailKey, {
          username: patient.username || "Inconnu",
          age: patient.age || "N/A",
          email: patient.email || "N/A",
          id: rdv.id,
        });
      }
    });

    const uniquePatients = Array.from(uniquePatientsMap.values()).sort((a, b) =>
      a.username.localeCompare(b.username)
    );

    const today = new Date().toISOString().split("T")[0];
    const rdvToday = rdvMedecin
      .map(rdv => {
        let patient = rdv.username;
        if (typeof patient === "string") {
          try {
            patient = JSON.parse(patient);
          } catch {
            patient = { username: rdv.username };
          }
        }
        return {
          id: rdv.id,
          username: patient.username || "Inconnu",
          age: patient.age || "N/A",
          email: patient.email || "N/A",
          time: rdv.time || rdv.heure || "Inconnu",
          date: rdv.date,
          isNew: rdv.isNew || false,
          status: getAppointmentStatus(rdv.date, rdv.time || rdv.heure),
        };
      })
      .filter(rdv => rdv.date === today);

    setPatients(uniquePatients);
    setRdvDuJour(rdvToday);

    const newRdvAlerts = rdvMedecin
      .filter(rdv => rdv.isNew && rdv.date && (rdv.time || rdv.heure))
      .map(rdv => ({
        id: `rdv-${rdv.id}`,
        message: `Nouveau rendez-vous ajouté pour ${rdv.username} le ${rdv.date} à ${rdv.time || rdv.heure}`,
      }));
    setAlerts(newRdvAlerts);
  }, []);

  useEffect(() => {
    loadAppointmentsAndAlerts();

    const interval = setInterval(() => {
      loadAppointmentsAndAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadAppointmentsAndAlerts]);

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts) {
      const allRdv = JSON.parse(localStorage.getItem("rendezVous") || "[]");
      const updatedRdv = allRdv.map(rdv => {
        if (
          rdv.specialite &&
          medecin?.specialite &&
          rdv.specialite.toLowerCase() === medecin.specialite.toLowerCase()
        ) {
          return { ...rdv, isNew: false };
        }
        return rdv;
      });
      localStorage.setItem("rendezVous", JSON.stringify(updatedRdv));
      setRdvDuJour(prev =>
        prev.map(rdv => ({ ...rdv, isNew: false }))
      );
      setAlerts([]); // supprimer les alertes après affichage
    }
  };

  return (
    <section className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-primary tracking-tight">
          Bienvenue, {medecin?.username || "Médecin"}
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

      {/* Alerts Table */}
      {showAlerts && (
        <div className="p-4 border rounded bg-white shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-primary">Nouvelles alertes</h3>
            <Button
              variant="destructive"
              onClick={handleShowAlerts}
            >
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

      <div className="grid md:grid-cols-2 gap-8">
        {/* Liste des patients */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover p-6 transition-transform duration-300 hover:-translate-y-1 border-primary border">
          <h3 className="flex items-center gap-3 text-primary font-semibold text-lg mb-4">
            <Users2 className="w-6 h-6" />
            Liste des patients ({patients.length})
          </h3>
          <Button
            onClick={() => setShowPatientsTable(!showPatientsTable)}
            className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            Voir la liste
          </Button>
        </article>

        {/* Rendez-vous du jour */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover p-6 transition-transform duration-300 hover:-translate-y-1 border-secondary border">
          <h3 className="flex items-center gap-3 text-secondary font-semibold text-lg mb-4">
            <CalendarCheck className="w-6 h-6" />
            Rendez-vous du jour ({rdvDuJour.length})
          </h3>
          <Button
            onClick={() => setShowRDVTable(!showRDVTable)}
            className="bg-secondary hover:bg-secondary-hover-600 text-white transition-colors"
          >
            Voir la liste
          </Button>
        </article>
      </div>

      {/* Tableau complet des patients */}
      {showPatientsTable && (
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-2xl font-semibold text-primary mb-4">Liste complète des patients</h3>
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => setShowPatientsTable(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              X
            </Button>
          </div>
          {patients.length === 0 ? (
            <p className="text-muted-foreground">Aucun patient pour le moment.</p>
          ) : (
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Âge</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id || patient.email || patient.username} className="hover:bg-muted/50">
                    <td className="border p-2">{patient.username}</td>
                    <td className="border p-2">{patient.age}</td>
                    <td className="border p-2">{patient.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tableau complet des rendez-vous */}
      {showRDVTable && (
        <div className="mt-8 overflow-x-auto">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => setShowRDVTable(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
              X
            </Button>
          </div>
          {rdvDuJour.length === 0 ? (
            <p className="text-muted-foreground">Aucun rendez-vous pour aujourd'hui.</p>
          ) : (
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2">Heure</th>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Âge</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">État</th>
                </tr>
              </thead>
              <tbody>
                {rdvDuJour.map(rdv => (
                  <tr key={rdv.id} className={`hover:bg-muted/50 ${rdv.isNew ? "bg-yellow-100" : ""}`}>
                    <td className="border p-2">{rdv.time}</td>
                    <td className="border p-2">{rdv.username}</td>
                    <td className="border p-2">{rdv.age}</td>
                    <td className="border p-2">{rdv.email}</td>
                    <td className="border p-2">{rdv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
};

export default MedecinDashboard;