import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CalendarCheck, Search, Filter, RefreshCw } from "lucide-react";

const FiltresRdv = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      patient: "",
      email: "",
      medecin: "",
      specialite: "",
      dateRange: "all",
    });
  };

  return (
    <Card className="bg-card border border-border shadow-md rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Recherche par nom
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nom du patient..."
                value={filters.patient}
                onChange={(e) => handleFilterChange("patient", e.target.value)}
                className="pl-10 border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Email
            </label>
            <Input
              placeholder="ex: user@mail.com"
              value={filters.email || ""}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Médecin
            </label>
            <Input
              placeholder="Nom du médecin..."
              value={filters.medecin || ""}
              onChange={(e) => handleFilterChange("medecin", e.target.value)}
              className="border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Spécialité
            </label>
            <Input
              placeholder="Spécialité médicale..."
              value={filters.specialite || ""}
              onChange={(e) => handleFilterChange("specialite", e.target.value)}
              className="border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Période
            </label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Toutes les dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rendez-vous</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="past">Passés</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full border-border hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const RdvPage = () => {
  const [rendezVous, setRendezVous] = useState([]);
  const [filters, setFilters] = useState({
    patient: "",
    email: "",
    medecin: "",
    specialite: "",
    dateRange: "all",
  });

  useEffect(() => {
    const rdvJSON = localStorage.getItem("rendezVous");
    if (rdvJSON) {
      try {
        setRendezVous(JSON.parse(rdvJSON));
      } catch {
        setRendezVous([]);
      }
    }
  }, []);

  const isDateInRange = (dateStr, range) => {
    if (!dateStr || !range || range === "all") return true;

    try {
      const rdvDate = new Date(dateStr);
      const today = new Date();

      const normalizeDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };

      const normalizedRdvDate = normalizeDate(rdvDate);
      const normalizedToday = normalizeDate(today);

      let startOfWeek, dayOfWeek, normalizedStartOfWeek, endOfWeek;
      let startOfMonth, endOfMonth, normalizedStartOfMonth, normalizedEndOfMonth;

      switch (range) {
        case "today":
          return normalizedRdvDate.getTime() === normalizedToday.getTime();
        case "upcoming":
          return normalizedRdvDate >= normalizedToday;
        case "past":
          return normalizedRdvDate < normalizedToday;
        case "week":
          startOfWeek = new Date(today);
          dayOfWeek = today.getDay();
          startOfWeek.setDate(today.getDate() - dayOfWeek);
          normalizedStartOfWeek = normalizeDate(startOfWeek);

          endOfWeek = new Date(normalizedStartOfWeek);
          endOfWeek.setDate(normalizedStartOfWeek.getDate() + 6);

          return normalizedRdvDate >= normalizedStartOfWeek && normalizedRdvDate <= endOfWeek;
        case "month":
          startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          normalizedStartOfMonth = normalizeDate(startOfMonth);
          normalizedEndOfMonth = normalizeDate(endOfMonth);

          return normalizedRdvDate >= normalizedStartOfMonth && normalizedRdvDate <= normalizedEndOfMonth;
        default:
          return true;
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de la date:", dateStr, error);
      return false;
    }
  };

  const filteredRdv = useMemo(() => {
    return rendezVous.filter((rdv) => {
      if (filters.patient && filters.patient.trim()) {
        const searchTerm = filters.patient.toLowerCase().trim();
        const fullName = `${rdv.nom || ""} ${rdv.prenom || ""}`.toLowerCase();
        const nomMatch = (rdv.nom || "").toLowerCase().includes(searchTerm);
        const prenomMatch = (rdv.prenom || "").toLowerCase().includes(searchTerm);
        const fullNameMatch = fullName.includes(searchTerm);

        if (!nomMatch && !prenomMatch && !fullNameMatch) {
          return false;
        }
      }

      if (filters.email && filters.email.trim()) {
        const emailTerm = filters.email.toLowerCase().trim();
        const rdvEmail = (rdv.email || "").toLowerCase();
        if (!rdvEmail.includes(emailTerm)) {
          return false;
        }
      }

      if (filters.medecin && filters.medecin.trim()) {
        const medecinTerm = filters.medecin.toLowerCase().trim();
        const rdvMedecin = (rdv.medecin || "").toLowerCase();
        if (!rdvMedecin.includes(medecinTerm)) {
          return false;
        }
      }

      if (filters.specialite && filters.specialite.trim()) {
        const specialiteTerm = filters.specialite.toLowerCase().trim();
        const rdvSpecialite = (rdv.specialite || "").toLowerCase();
        if (!rdvSpecialite.includes(specialiteTerm)) {
          return false;
        }
      }

      if (filters.dateRange && filters.dateRange !== "all") {
        if (!isDateInRange(rdv.date, filters.dateRange)) {
          return false;
        }
      }

      return true;
    });
  }, [rendezVous, filters]);

  const navigate = (direction) => {
    if (direction === "/dashboard") {
      window.history.back();
    }
  };

  return (
    <main className="min-h-screen container mx-auto px-6 py-10 space-y-10 bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <h1 className="text-4xl font-extrabold text-primary flex items-center gap-3">
          <CalendarCheck className="w-8 h-8" />
          Rendez-vous
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </Button>
      </header>

      {/* Filtres */}
      <section>
        <FiltresRdv filters={filters} onFiltersChange={setFilters} />
      </section>

      {/* Tableau des rendez-vous */}
      <section>
        <div className="bg-card rounded-2xl shadow-md border border-border p-6 overflow-auto max-h-[70vh]">
          <table className="w-full border-collapse min-w-[900px]">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="p-3 text-left font-semibold border-b">ID</th>
                <th className="p-3 text-left font-semibold border-b">Nom</th>
                <th className="p-3 text-left font-semibold border-b">Prénom</th>
                <th className="p-3 text-left font-semibold border-b">Email</th>
                <th className="p-3 text-left font-semibold border-b">Téléphone</th>
                <th className="p-3 text-left font-semibold border-b">Spécialité</th>
                <th className="p-3 text-left font-semibold border-b">Médecin</th>
                <th className="p-3 text-left font-semibold border-b">Date</th>
                <th className="p-3 text-left font-semibold border-b">Heure</th>
                <th className="p-3 text-left font-semibold border-b">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredRdv.length > 0 ? (
                filteredRdv.map((rdv, index) => (
                  <tr
                    key={rdv.id ? `rdv-${rdv.id}` : `rdv-index-${index}`}
                    className={`hover:bg-muted/50 transition-colors border-b ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{rdv.nom || "-"}</td>
                    <td className="p-3 font-medium">{rdv.prenom || "-"}</td>
                    <td className="p-3 text-blue-600">{rdv.email || "-"}</td>
                    <td className="p-3">{rdv.telephone || "-"}</td>
                    <td className="p-3">{rdv.specialite || "-"}</td>
                    <td className="p-3">{rdv.medecin || "-"}</td>
                    <td className="p-3">
                      {rdv.date
                        ? (() => {
                            try {
                              const date = new Date(rdv.date);
                              return date.toLocaleDateString("fr-FR");
                            } catch {
                              return rdv.date;
                            }
                          })()
                        : "-"}
                    </td>
                    <td className="p-3">{rdv.heure || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font dermatitis-medium ${
                          isDateInRange(rdv.date, "month")
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {isDateInRange(rdv.date, "month") ? "Nouveau" : "Existant"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-rdv-found">
                  <td colSpan={10} className="text-center py-8 text-muted-foreground">
                    {rendezVous.length === 0
                      ? "Aucun rendez-vous enregistré"
                      : "Aucun rendez-vous ne correspond aux critères de filtrage"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default RdvPage;