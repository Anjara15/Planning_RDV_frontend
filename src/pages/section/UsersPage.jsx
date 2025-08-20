import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { X, ArrowLeft, Users2, Search, Filter, RefreshCw } from "lucide-react";

const FiltresHistory = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: "",
      patient: "",
      email: "",
      status: "all",
      ageMin: "",
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
                placeholder="Nom d'utilisateur..."
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
              Rôle
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="border-border focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="medecin">Médecin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Âge minimum
            </label>
            <Input
              type="number"
              placeholder="ex: 18"
              value={filters.ageMin || ""}
              onChange={(e) => handleFilterChange("ageMin", e.target.value)}
              className="border-border focus:ring-2 focus:ring-primary/20"
            />
          </div>
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

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    age: "",
    role: "patient",
    specialite: "",
  });
  const [filters, setFilters] = useState({
    dateRange: "",
    patient: "",
    email: "",
    status: "all",
    ageMin: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const usersJSON = localStorage.getItem("users");
    setUsers(usersJSON ? JSON.parse(usersJSON) : []);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filters.patient && !user.username.toLowerCase().includes(filters.patient.toLowerCase())) {
        return false;
      }
      if (filters.email && !user.email?.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      if (filters.status !== "all" && user.role !== filters.status) {
        return false;
      }
      if (filters.ageMin && (!user.age || parseInt(user.age) < parseInt(filters.ageMin))) {
        return false;
      }
      return true;
    });
  }, [users, filters]);

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...users];
    const originalIndex = users.findIndex((u) => u === filteredUsers[index]);
    updatedUsers[originalIndex][field] = value;
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const saveUser = (index) => {
    const updatedUsers = [...users];
    const originalIndex = users.findIndex((u) => u === filteredUsers[index]);
    updatedUsers[originalIndex].isNew = false;
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert(`Utilisateur "${updatedUsers[originalIndex].username}" sauvegardé !`);
  };

  const deleteUser = (index) => {
    const userToDelete = filteredUsers[index];
    const originalIndex = users.findIndex((u) => u === userToDelete);
    const updatedUsers = users.filter((_, i) => i !== originalIndex);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    if (!newUser.username.trim()) {
      alert("Le nom d'utilisateur est requis !");
      return;
    }
    if (newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      alert("Veuillez entrer un email valide !");
      return;
    }
    if (newUser.age && (isNaN(newUser.age) || newUser.age < 0)) {
      alert("L'âge doit être un nombre positif !");
      return;
    }
    if (newUser.role === "medecin" && !newUser.specialite.trim()) {
      alert("La spécialité est requise pour un médecin !");
      return;
    }

    const updatedUsers = [...users, { ...newUser, isNew: true }];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert(`Utilisateur "${newUser.username}" ajouté !`);
    setShowAddModal(false);
    setNewUser({ username: "", email: "", age: "", role: "patient", specialite: "" });
  };

  return (
    <main className="min-h-screen container mx-auto px-6 py-10 space-y-10 bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <h1 className="text-4xl font-extrabold text-primary flex items-center gap-3">
          <Users2 className="w-8 h-8" />
          Gestion des Utilisateurs
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
          aria-label="Retour au tableau de bord"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour
        </Button>
      </header>

      {/* Filtres */}
      <section>
        <FiltresHistory filters={filters} onFiltersChange={setFilters} />
      </section>

      {/* Tableau des utilisateurs */}
      <section>
        <div className="bg-card rounded-2xl shadow-md border border-border p-6 overflow-auto max-h-[500px]">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="p-3 text-left font-semibold border-b">ID</th>
                <th className="p-3 text-left font-semibold border-b">Nom</th>
                <th className="p-3 text-left font-semibold border-b">Email</th>
                <th className="p-3 text-left font-semibold border-b">Âge</th>
                <th className="p-3 text-left font-semibold border-b">Rôle</th>
                <th className="p-3 text-left font-semibold border-b">Spécialités</th>
                <th className="p-3 text-center font-semibold border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    {users.length === 0
                      ? "Aucun utilisateur enregistré"
                      : "Aucun utilisateur ne correspond aux critères de filtrage"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id ? `user-${user.id}` : `user-index-${index}`}
                    className={`hover:bg-muted/50 transition-colors border-b ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    } ${user.isNew ? "bg-yellow-50" : ""}`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <Input
                        type="text"
                        value={user.username}
                        onChange={(e) => handleUserChange(index, "username", e.target.value)}
                        className="w-full border-border focus:ring-2 focus:ring-primary/20"
                        aria-label="Nom d'utilisateur"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="email"
                        value={user.email || ""}
                        onChange={(e) => handleUserChange(index, "email", e.target.value)}
                        className="w-full border-border focus:ring-2 focus:ring-primary/20"
                        aria-label="Email"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        value={user.age || ""}
                        onChange={(e) => handleUserChange(index, "age", e.target.value)}
                        className="w-full border-border focus:ring-2 focus:ring-primary/20"
                        aria-label="Âge"
                      />
                    </td>
                    <td className="p-3">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleUserChange(index, "role", value)}
                      >
                        <SelectTrigger className="w-full border-border focus:ring-2 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="medecin">Médecin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      {user.role === "medecin" ? (
                        <Input
                          type="text"
                          value={user.specialite || ""}
                          onChange={(e) => handleUserChange(index, "specialite", e.target.value)}
                          placeholder="Spécialité..."
                          className="w-full border-border focus:ring-2 focus:ring-primary/20"
                          aria-label="Spécialité"
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          onClick={() => saveUser(index)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                          aria-label={`Modifier l'utilisateur ${user.username}`}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteUser(index)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs"
                          aria-label={`Supprimer l'utilisateur ${user.username}`}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex justify-end">
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Ajouter un nouvel utilisateur"
        >
          Ajouter un utilisateur
        </Button>
      </section>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-6 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Fermer la fenêtre d'ajout"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-foreground">Ajouter un utilisateur</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Nom *
                </label>
                <Input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full border-border focus:ring-2 focus:ring-primary/20"
                  required
                  aria-label="Nom d'utilisateur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border-border focus:ring-2 focus:ring-primary/20"
                  aria-label="Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Âge
                </label>
                <Input
                  type="number"
                  placeholder="Âge"
                  value={newUser.age}
                  onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                  className="w-full border-border focus:ring-2 focus:ring-primary/20"
                  aria-label="Âge"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Rôle
                </label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="w-full border-border focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="medecin">Médecin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUser.role === "medecin" && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Spécialité
                  </label>
                  <Input
                    type="text"
                    placeholder="Spécialité médicale"
                    value={newUser.specialite}
                    onChange={(e) => setNewUser({ ...newUser, specialite: e.target.value })}
                    className="w-full border-border focus:ring-2 focus:ring-primary/20"
                    aria-label="Spécialité"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="border-border hover:bg-muted/50 text-foreground"
                aria-label="Annuler l'ajout"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddUser}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!newUser.username.trim()}
                aria-label="Ajouter l'utilisateur"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UsersPage;