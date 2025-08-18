import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AppointmentHistory = ({ filters }) => {
  const [rdvs, setRdvs] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("rendezVous")) || [];
      const normalized = data.map((item) => {
        const heure = item.heure || item.time || "";
        const patient =
          item.username && typeof item.username === "string"
            ? (() => {
                try {
                  const parsed = JSON.parse(item.username);
                  return parsed.username || item.username;
                } catch {
                  return item.username;
                }
              })()
            : item.username?.username || "";

        // Déterminer le statut
        let status = "Passé";
        if (item.date) {
          const dateTimeStr = `${item.date} ${heure || "00:00"}`;
          const rdvDate = new Date(dateTimeStr);
          const now = new Date();
          if (rdvDate >= now) {
            status = "À venir";
          }
        }

        return {
          ...item,
          heure,
          patient,
          status,
        };
      });
      setRdvs(normalized);
    } catch (error) {
      console.error("Erreur lors du parsing localStorage:", error);
      setRdvs([]);
    }
  }, []);

  // Application des filtres
  const filteredRdvs = rdvs.filter((rdv) => {
    if (filters.patient && !rdv.patient?.toLowerCase().includes(filters.patient.toLowerCase())) {
      return false;
    }
    if (filters.doctor && !rdv.medecin?.toLowerCase().includes(filters.doctor.toLowerCase())) {
      return false;
    }
    if (filters.dateRange && rdv.date !== filters.dateRange) {
      return false;
    }
    if (filters.status && rdv.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <Card className="overflow-hidden border border-border shadow-lg">
      <CardHeader>
        <CardTitle>Liste des Rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Médecin</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Demande</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRdvs.length > 0 ? (
              filteredRdvs.map((rdv) => (
                <TableRow key={rdv.id}>
                  <TableCell>{rdv.patient || rdv.nom}</TableCell>
                  <TableCell>{rdv.email || "-"}</TableCell>
                  <TableCell>{rdv.telephone || "-"}</TableCell>
                  <TableCell>{rdv.medecin || "-"}</TableCell>
                  <TableCell>{rdv.specialite || "-"}</TableCell>
                  <TableCell>{rdv.date}</TableCell>
                  <TableCell>{rdv.heure}</TableCell>
                  <TableCell>{rdv.demande || "-"}</TableCell>
                  <TableCell>
                    {rdv.status === "À venir" ? (
                      <Badge className="bg-green-500 text-white">{rdv.status}</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white">{rdv.status}</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  Aucun rendez-vous trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
