import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DateHistoriques } from "@/components/Historiques/DateHistoriques";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserHistory = () => {
  const navigate = useNavigate();

  const users = [
    { id: 1, nom: "Rakoto", email: "rakoto@mail.com", date: "2025-08-01" },
    { id: 2, nom: "Rasoa", email: "rasoa@mail.com", date: "2025-08-10" },
    { id: 3, nom: "Mika", email: "mika@mail.com", date: "2025-07-25" },
  ];

  const [filters, setFilters] = useState({ nom: "", date: "" });

  // Application des filtres
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filters.nom && !u.nom.toLowerCase().includes(filters.nom.toLowerCase())) {
        return false;
      }
      if (filters.date && u.date !== filters.date) {
        return false;
      }
      return true;
    });
  }, [users, filters]);

  // Statistiques
  const totalUsers = users.length;
  const newThisMonth = users.filter((u) => {
    const d = new Date(u.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <main className="min-h-screen container mx-auto px-6 py-10 space-y-10 bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <h1 className="text-4xl font-extrabold text-primary flex items-center gap-3">
          <Users2 className="w-8 h-8" />
          Historique des Utilisateurs
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

      {/* Statistiques */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Total Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Nouveaux ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{newThisMonth}</p>
          </CardContent>
        </Card>
      </section>

      {/* Filtres */}
      <section className="bg-card rounded-2xl shadow-md border border-border p-6">
        <DateHistoriques filters={filters} onFiltersChange={setFilters} />
      </section>

      {/* Tableau stylé */}
      <section>
        <div className="bg-card rounded-2xl shadow-md border border-border p-6 overflow-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3 font-semibold">Nom</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Date d’inscription</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-muted/50 transition-colors ${
                      i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-3">{u.nom}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-muted-foreground"
                  >
                    Aucun utilisateur trouvé.
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

export default UserHistory;
