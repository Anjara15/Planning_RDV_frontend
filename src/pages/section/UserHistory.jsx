import React, { useState, useMemo, useEffect } from "react";
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
import { ArrowLeft, Users2, Search, Filter, RefreshCw, Calendar } from "lucide-react";

const FiltresHistory = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      nom: "",
      email: "",
      dateRange: "all",
      dateSpecific: "",
    });
  };

  return (
    <Card className="bg-card border border-border shadow-md rounded-2xl">
      <CardContent className="p-6">
        {/* Header des filtres */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Recherche par nom */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Recherche par nom
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nom d'utilisateur..."
                value={filters.nom}
                onChange={(e) => handleFilterChange("nom", e.target.value)}
                className="pl-10 border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Période */}
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
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date spécifique */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Date spécifique
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={filters.dateSpecific || ""}
                onChange={(e) => handleFilterChange("dateSpecific", e.target.value)}
                className="pl-10 border-border focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Bouton reset */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Actions
            </label>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full border-border hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UserHistory = () => {
  // Données d'exemple - remplacer par vos vraies données
  const [users, setUsers] = useState([
    { id: 1, nom: "Rakoto", email: "rakoto@mail.com", date: "2025-08-01" },
    { id: 2, nom: "Rasoa", email: "rasoa@mail.com", date: "2025-08-10" },
    { id: 3, nom: "Mika", email: "mika@mail.com", date: "2025-07-25" },
    { id: 4, nom: "Andry", email: "andry@mail.com", date: "2025-08-15" },
    { id: 5, nom: "Hery", email: "hery@mail.com", date: "2025-07-30" },
  ]);

  const [filters, setFilters] = useState({ 
    nom: "", 
    email: "",
    dateRange: "all",
    dateSpecific: ""
  });

  // Charger les utilisateurs depuis localStorage si disponible
  useEffect(() => {
    const usersJSON = localStorage.getItem("users");
    if (usersJSON) {
      try {
        const loadedUsers = JSON.parse(usersJSON);
        if (loadedUsers.length > 0) {
          setUsers(loadedUsers);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    }
  }, []);

  // Fonction pour vérifier si une date est dans une période donnée
  const isDateInRange = (dateStr, range) => {
    if (!dateStr || !range || range === "all") return true;
    
    try {
      const userDate = new Date(dateStr);
      const today = new Date();
      
      // Normaliser les dates
      const normalizeDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      };
      
      const normalizedUserDate = normalizeDate(userDate);
      const normalizedToday = normalizeDate(today);
      
      switch (range) {
        case "today":
          return normalizedUserDate.getTime() === normalizedToday.getTime();
        case "week": {
          const startOfWeek = new Date(today);
          const dayOfWeek = today.getDay();
          startOfWeek.setDate(today.getDate() - dayOfWeek);
          const normalizedStartOfWeek = normalizeDate(startOfWeek);
          
          const endOfWeek = new Date(normalizedStartOfWeek);
          endOfWeek.setDate(normalizedStartOfWeek.getDate() + 6);
          
          return normalizedUserDate >= normalizedStartOfWeek && normalizedUserDate <= endOfWeek;
        }
        case "month":
          return userDate.getMonth() === today.getMonth() && userDate.getFullYear() === today.getFullYear();
        case "quarter": {
          const currentQuarter = Math.floor(today.getMonth() / 3);
          const userQuarter = Math.floor(userDate.getMonth() / 3);
          return userQuarter === currentQuarter && userDate.getFullYear() === today.getFullYear();
        }
        case "year":
          return userDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de la date:", dateStr, error);
      return false;
    }
  };

  // Application des filtres
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Filtre par nom
      if (filters.nom && filters.nom.trim()) {
        const searchTerm = filters.nom.toLowerCase().trim();
        const userName = (u.nom || u.username || '').toLowerCase();
        if (!userName.includes(searchTerm)) {
          return false;
        }
      }

      // Filtre par email
      if (filters.email && filters.email.trim()) {
        const emailTerm = filters.email.toLowerCase().trim();
        const userEmail = (u.email || '').toLowerCase();
        if (!userEmail.includes(emailTerm)) {
          return false;
        }
      }

      // Filtre par date spécifique
      if (filters.dateSpecific && filters.dateSpecific.trim()) {
        if (u.date !== filters.dateSpecific) {
          return false;
        }
      }

      // Filtre par période
      if (filters.dateRange && filters.dateRange !== "all") {
        if (!isDateInRange(u.date, filters.dateRange)) {
          return false;
        }
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

  const newThisWeek = users.filter((u) => isDateInRange(u.date, "week")).length;

  const navigate = (direction) => {
    if (direction === "/dashboard") {
      window.history.back();
    }
  };

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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{newThisWeek}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Affichés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{filteredUsers.length}</p>
          </CardContent>
        </Card>
      </section>

      {/* Filtres */}
      <section>
        <FiltresHistory filters={filters} onFiltersChange={setFilters} />
      </section>

      {/* Debug - Statistiques des filtres */}
      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>Affichage: <span className="font-semibold">{filteredUsers.length}</span> / {totalUsers}</div>
          <div>Filtres actifs: 
            <span className="font-semibold">
              {Object.values(filters).filter(v => v && v !== "all").length}
            </span>
          </div>
          <div>Ce mois: <span className="font-semibold">{newThisMonth}</span></div>
          <div>Cette semaine: <span className="font-semibold">{newThisWeek}</span></div>
        </div>
      </div>

      {/* Tableau stylé */}
      <section>
        <div className="bg-card rounded-2xl shadow-md border border-border p-6 overflow-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3 font-semibold border-b">ID</th>
                <th className="p-3 font-semibold border-b">Nom</th>
                <th className="p-3 font-semibold border-b">Email</th>
                <th className="p-3 font-semibold border-b">Date d'inscription</th>
                <th className="p-3 font-semibold border-b">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, i) => (
                  <tr
                    key={u.id ? `user-${u.id}` : `user-index-${i}`}
                    className={`hover:bg-muted/50 transition-colors border-b ${
                      i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-3">{u.id || i + 1}</td>
                    <td className="p-3 font-medium">{u.nom || u.username}</td>
                    <td className="p-3 text-blue-600">{u.email}</td>
                    <td className="p-3">
                      {u.date ? (() => {
                        try {
                          const date = new Date(u.date);
                          return date.toLocaleDateString('fr-FR');
                        } catch {
                          return u.date;
                        }
                      })() : "-"}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isDateInRange(u.date, "month") 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {isDateInRange(u.date, "month") ? "Nouveau" : "Existant"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="no-users-found">
                  <td
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {users.length === 0 
                      ? "Aucun utilisateur enregistré" 
                      : "Aucun utilisateur ne correspond aux critères de filtrage"
                    }
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