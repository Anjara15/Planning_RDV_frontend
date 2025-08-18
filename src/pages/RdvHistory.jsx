import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppointmentHistory } from "@/components/Historiques/AppointmentHistory";
import { HistoryFilters } from "@/components/Historiques/HistoryFilters";
import { StatsCards } from "@/components/Historiques/StatsCards";
import { CalendarCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const RdvHistory = () => {
  const [filters, setFilters] = useState({
    dateRange: "",
    patient: "",
    doctor: "",
    status: "",
  });

  const navigate = useNavigate();

  return (
    <main className="min-h-screen container mx-auto px-6 py-10 space-y-10 bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <h1 className="text-4xl font-extrabold text-primary flex items-center gap-3">
          <CalendarCheck className="w-8 h-8" />
          Historique des Rendez-vous
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

      {/* Contenu principal */}
      <section className="space-y-8">
        {/* Cartes de statistiques */}
        <StatsCards />

        {/* Filtres */}
        <div className="bg-card rounded-2xl shadow-md border border-border p-6">
          <HistoryFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Liste des RDV */}
        <AppointmentHistory filters={filters} />
      </section>
    </main>
  );
};

export default RdvHistory;
