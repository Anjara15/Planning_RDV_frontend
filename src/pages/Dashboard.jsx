import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import MedecinDashboard from "./MedecinDashboard";
import Header from "./Historiques/Header";
import UserHistory from "./section/UserHistory";
import RdvHistory from "./section/RdvHistory";
import RdvPage from "./section/RdvPage";
import UsersPage from "./section/UsersPage";
import { Users2, CalendarCheck, X, Bell, History } from "lucide-react";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("users");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", age: "", role: "patient", specialite: "" });
  const [rendezVous, setRendezVous] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showHistorySelection, setShowHistorySelection] = useState(false);
  const [selectedHistoryType, setSelectedHistoryType] = useState(null);
  const [_history, setHistory] = useState([]);
  const [_historyFilter] = useState("all");

  const navigate = useNavigate();

  const addToHistory = (action, details, user = currentUser) => {
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user?.username || "Système",
      role: user?.role || "system",
      action,
      details,
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
    };

    const existingHistory = JSON.parse(localStorage.getItem("appHistory") || "[]");
    const updatedHistory = [historyEntry, ...existingHistory].slice(0, 1000);
    localStorage.setItem("appHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  useEffect(() => {
    const r = localStorage.getItem("role");
    const u = localStorage.getItem("user");
    if (!r || !u) {
      navigate("/auth");
      return;
    }
    setRole(r);

    const usersJSON = localStorage.getItem("users");
    let parsedUsers = [];
    if (usersJSON) {
      try {
        parsedUsers = JSON.parse(usersJSON);
        setUsers(parsedUsers);
        const foundUser = parsedUsers.find(user => user.username === JSON.parse(u).username && user.role === r);
        setCurrentUser(foundUser || JSON.parse(u));
      } catch {
        setCurrentUser(JSON.parse(u));
      }
    } else {
      setCurrentUser(JSON.parse(u));
    }

    const rdvJSON = localStorage.getItem("rendezVous");
    let parsedRdv = [];
    if (rdvJSON) {
      try {
        parsedRdv = JSON.parse(rdvJSON);
        setRendezVous(parsedRdv);
      } catch {
        setRendezVous([]);
      }
    }

    const historyJSON = localStorage.getItem("appHistory");
    if (historyJSON) {
      try {
        setHistory(JSON.parse(historyJSON));
      } catch {
        setHistory([]);
      }
    }

    const newUserAlerts = parsedUsers
      .filter(user => user.isNew)
      .map(user => ({
        id: `user-${user.username}`,
        message: `Nouvel utilisateur ajouté: ${user.username}`,
      }));
    const newRdvAlerts = parsedRdv
      .filter(rdv => rdv.isNew)
      .map(rdv => ({
        id: `rdv-${rdv.id || rdv.username}-${rdv.date}`,
        message: `Nouveau rendez-vous pour ${rdv.username} le ${rdv.date}`,
      }));
    setAlerts([...newUserAlerts, ...newRdvAlerts]);

    const foundUser = parsedUsers.find(user => user.username === JSON.parse(u).username && user.role === r) || JSON.parse(u);
    addToHistory("Connexion", `Connexion au tableau de bord`, foundUser);
  }, [navigate]);

  const logout = () => {
    addToHistory("Déconnexion", "Déconnexion de l'application");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...users];
    const oldValue = updatedUsers[index][field];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    addToHistory("Modification utilisateur", `Modification ${field}: "${oldValue}" → "${value}" pour ${updatedUsers[index].username}`);

    if (currentUser && updatedUsers[index].username === currentUser.username && updatedUsers[index].role === currentUser.role) {
      setCurrentUser(updatedUsers[index]);
      localStorage.setItem("user", JSON.stringify(updatedUsers[index]));
    }
  };

  const saveUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].isNew = false;
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    addToHistory("Sauvegarde utilisateur", `Sauvegarde des modifications pour l'utilisateur ${updatedUsers[index].username}`);

    setAlerts(alerts.filter(alert => alert.id !== `user-${updatedUsers[index].username}`));
    alert(`Utilisateur "${updatedUsers[index].username}" sauvegardé !`);
  };

  const deleteUser = (index) => {
    const userToDelete = users[index];
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    setAlerts(alerts.filter(alert => alert.id !== `user-${userToDelete.username}`));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    addToHistory("Suppression utilisateur", `Suppression de l'utilisateur ${userToDelete.username} (${userToDelete.role})`);

    if (currentUser && userToDelete.username === currentUser.username && userToDelete.role === currentUser.role) {
      localStorage.removeItem("user");
      setCurrentUser(null);
      navigate("/auth");
    }
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.age) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const updatedUsers = [...users, { ...newUser, isNew: true }];
    setUsers(updatedUsers);
    setAlerts([...alerts, { id: `user-${newUser.username}`, message: `Nouvel utilisateur ajouté: ${newUser.username}` }]);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    addToHistory("Ajout utilisateur", `Ajout d'un nouvel utilisateur: ${newUser.username} (${newUser.role})`);

    setShowAddModal(false);
    alert(`Utilisateur "${newUser.username}" ajouté !`);
    setNewUser({ username: "", email: "", age: "", role: "patient", specialite: "", isNew: false });
  };

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts) {
      const updatedUsers = users.map(user => ({ ...user, isNew: false }));
      const updatedRdv = rendezVous.map(rdv => ({ ...rdv, isNew: false }));
      setUsers(updatedUsers);
      setRendezVous(updatedRdv);
      setAlerts([]);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("rendezVous", JSON.stringify(updatedRdv));

      addToHistory("Consultation alertes", "Consultation et marquage des alertes comme lues");
    }
  };

  const dismissAlert = (id) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    const updatedUsers = users.map(user => ({ ...user, isNew: false }));
    const updatedRdv = rendezVous.map(rdv => ({ ...rdv, isNew: false }));
    setUsers(updatedUsers);
    setRendezVous(updatedRdv);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("rendezVous", JSON.stringify(updatedRdv));
    addToHistory("Suppression alertes", "Toutes les alertes ont été supprimées");
  };

  const handleHistoryClick = () => {
    setShowHistorySelection(true);
    addToHistory("Consultation historique", "Ouverture du menu de sélection d'historique");
  };

  const handleHistoryTypeSelection = (type) => {
    setShowHistorySelection(false);
    setSelectedHistoryType(type);
    addToHistory("Consultation historique", `Consultation de l'historique de ${type === "users" ? "gestion d'utilisateurs" : "rendez-vous"}`);
  };

  const handleShowRendezVous = () => {
    setActiveView("appointments");
    setSelectedHistoryType(null);
    addToHistory("Consultation rendez-vous", "Ouverture de la page des rendez-vous");
  };

  const handleShowUsers = () => {
    setActiveView("users");
    setSelectedHistoryType(null);
    addToHistory("Consultation utilisateurs", "Ouverture de la page des utilisateurs");
  };

  const AdminStaffDashboard = ({ label }) => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary tracking-tight">
          Bienvenue, <span className="text-secondary">{label}</span>
        </h2>
        <button
          onClick={handleShowAlerts}
          className="relative p-2 rounded-full hover:bg-muted transition-colors duration-200"
          aria-label="Voir les alertes"
        >
          <Bell className="w-6 h-6 text-primary" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
              {alerts.length}
            </span>
          )}
        </button>
      </div>

      {/* Alerts Section */}
      {showAlerts && (
        <div className="p-6 border rounded-xl bg-white shadow-md transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-primary">Alertes</h3>
            {alerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllAlerts}
                className="text-red-600 hover:text-red-700 border-red-600 hover:bg-red-50"
                aria-label="Supprimer toutes les alertes"
              >
                Tout supprimer
              </Button>
            )}
          </div>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune alerte pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {alerts.map(alert => (
                <li
                  key={alert.id}
                  className="p-3 bg-muted rounded-lg flex justify-between items-center transition-colors duration-200 hover:bg-muted/80"
                >
                  <span>{alert.message}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label={`Supprimer l'alerte ${alert.message}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* History Selection Modal */}
      {showHistorySelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background rounded-xl w-full max-w-lg p-8 relative shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in">
            <button
              onClick={() => setShowHistorySelection(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive rounded-full p-1 hover:bg-muted/50 transition-colors duration-200"
              aria-label="Fermer la sélection d'historique"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center text-primary">
              Sélectionner l'historique
            </h3>
            <div className="grid gap-4">
              <button
                onClick={() => handleHistoryTypeSelection("users")}
                className="p-6 border border-primary/20 hover:border-primary rounded-lg transition-all duration-300 hover:bg-primary/5 flex items-center gap-3"
                aria-label="Voir l'historique des utilisateurs"
              >
                <Users2 className="w-8 h-8 text-primary" />
                <span className="text-lg font-medium">Gestion d'utilisateurs</span>
              </button>
              <button
                onClick={() => handleHistoryTypeSelection("appointments")}
                className="p-6 border border-secondary/20 hover:border-secondary rounded-lg transition-all duration-300 hover:bg-secondary/5 flex items-center gap-3"
                aria-label="Voir l'historique des rendez-vous"
              >
                <CalendarCheck className="w-8 h-8 text-secondary" />
                <span className="text-lg font-medium">Rendez-vous</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-primary/10 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-105">
          <Users2 className="w-7 h-7 text-primary mx-auto mb-2" />
          <h4 className="text-lg font-semibold text-primary">{users.length}</h4>
          <p className="text-sm text-muted-foreground">Utilisateurs</p>
        </div>
        <div className="p-5 bg-secondary/10 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-105">
          <CalendarCheck className="w-7 h-7 text-secondary mx-auto mb-2" />
          <h4 className="text-lg font-semibold text-secondary">{rendezVous.length}</h4>
          <p className="text-sm text-muted-foreground">Rendez-vous</p>
        </div>
        <div className="p-5 bg-purple-50 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-105">
          <History className="w-7 h-7 text-purple-600 mx-auto mb-2" />
          <h4 className="text-lg font-semibold text-purple-600">{_history.length}</h4>
          <p className="text-sm text-muted-foreground">Historique</p>
        </div>
        <div className="p-5 bg-red-50 rounded-xl shadow-md text-center transition-transform duration-300 hover:scale-105">
          <Bell className="w-7 h-7 text-red-500 mx-auto mb-2" />
          <h4 className="text-lg font-semibold text-red-500">{alerts.length}</h4>
          <p className="text-sm text-muted-foreground">Alertes</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 border-b border-border pb-2">
        <Button
          onClick={handleShowUsers}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${activeView === "users" && !selectedHistoryType ? "bg-primary text-white shadow-sm" : "bg-transparent text-primary hover:bg-primary/10"}`}
          aria-label="Voir la gestion des utilisateurs"
        >
          <Users2 className="w-5 h-5 inline-block mr-2" />
          Utilisateurs
        </Button>
        <Button
          onClick={handleShowRendezVous}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${activeView === "appointments" && !selectedHistoryType ? "bg-secondary text-white shadow-sm" : "bg-transparent text-secondary hover:bg-secondary/10"}`}
          aria-label="Voir les rendez-vous"
        >
          <CalendarCheck className="w-5 h-5 inline-block mr-2" />
          Rendez-vous
        </Button>
        <Button
          onClick={handleHistoryClick}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${selectedHistoryType ? "bg-purple-600 text-white shadow-sm" : "bg-transparent text-purple-600 hover:bg-purple-600/10"}`}
          aria-label="Voir l'historique"
        >
          <History className="w-5 h-5 inline-block mr-2" />
          Historique
        </Button>
      </div>

      {/* Main Content */}
      <div className="transition-opacity duration-300 animate-in fade-in">
        {selectedHistoryType ? (
          <div className="bg-white rounded-xl shadow-md p-6 border border-border">
            <h3 className="text-2xl font-semibold text-center text-primary mb-6">
              {selectedHistoryType === "users" ? "Historique des utilisateurs" : "Historique des rendez-vous"}
            </h3>
            {selectedHistoryType === "users" ? (
              <UserHistory history={_history.filter(entry => entry.action.includes("utilisateur"))} />
            ) : (
              <RdvHistory history={_history.filter(entry => entry.action.includes("rendez-vous"))} />
            )}
          </div>
        ) : (
          <>
            {activeView === "users" && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-primary">Gestion des utilisateurs</h3>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    aria-label="Ajouter un nouvel utilisateur"
                  >
                    Ajouter un utilisateur
                  </Button>
                </div>
                <div className="overflow-auto max-h-[500px] border border-border rounded-lg">
                  <table className="w-full border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-muted sticky top-0">
                        <th className="border p-3 text-left text-sm font-semibold text-primary">Nom</th>
                        <th className="border p-3 text-left text-sm font-semibold text-primary">Email</th>
                        <th className="border p-3 text-left text-sm font-semibold text-primary">Âge</th>
                        <th className="border p-3 text-left text-sm font-semibold text-primary">Rôle</th>
                        <th className="border p-3 text-left text-sm font-semibold text-primary">Spécialités</th>
                        <th className="border p-3 text-left text-sm font-semibold text-primary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index} className={`hover:bg-muted/50 transition-colors duration-200 ${user.isNew ? "bg-yellow-50" : ""}`}>
                          <td className="border p-3">
                            <input
                              type="text"
                              value={user.username}
                              onChange={(e) => handleUserChange(index, "username", e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                              aria-label="Nom de l'utilisateur"
                            />
                          </td>
                          <td className="border p-3">
                            <input
                              type="email"
                              value={user.email || ""}
                              onChange={(e) => handleUserChange(index, "email", e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                              aria-label="Email de l'utilisateur"
                            />
                          </td>
                          <td className="border p-3">
                            <input
                              type="number"
                              value={user.age || ""}
                              onChange={(e) => handleUserChange(index, "age", e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                              aria-label="Âge de l'utilisateur"
                            />
                          </td>
                          <td className="border p-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleUserChange(index, "role", e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                              aria-label="Rôle de l'utilisateur"
                            >
                              <option value="patient">Patient</option>
                              <option value="medecin">Médecin</option>
                              <option value="admin">Admin</option>
                              <option value="staff">Staff</option>
                            </select>
                          </td>
                          <td className="border p-3">
                            {user.role === "medecin" ? (
                              <input
                                type="text"
                                value={user.specialite || ""}
                                onChange={(e) => handleUserChange(index, "specialite", e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                                placeholder="Spécialité"
                                aria-label="Spécialité du médecin"
                              />
                            ) : "-"}
                          </td>
                          <td className="border p-3 flex gap-2 justify-center">
                            <Button
                              size="sm"
                              onClick={() => saveUser(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                              aria-label={`Sauvegarder les modifications pour ${user.username}`}
                            >
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => deleteUser(index)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                              aria-label={`Supprimer l'utilisateur ${user.username}`}
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeView === "appointments" && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-border">
                <h3 className="text-2xl font-semibold text-center text-primary mb-6">Gestion des rendez-vous</h3>
                <RdvPage rendezVous={rendezVous} setRendezVous={setRendezVous} addToHistory={addToHistory} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-background rounded-xl w-full max-w-md p-8 relative shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive rounded-full p-1 hover:bg-muted/50 transition-colors duration-200"
              aria-label="Fermer le formulaire d'ajout"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center text-primary">Ajouter un utilisateur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Nom *</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  aria-label="Nom du nouvel utilisateur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  aria-label="Email du nouvel utilisateur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Âge *</label>
                <input
                  type="number"
                  placeholder="Âge"
                  value={newUser.age}
                  onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  aria-label="Âge du nouvel utilisateur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Rôle</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  aria-label="Rôle du nouvel utilisateur"
                >
                  <option value="patient">Patient</option>
                  <option value="medecin">Médecin</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              {newUser.role === "medecin" && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Spécialité</label>
                  <input
                    type="text"
                    placeholder="Spécialité"
                    value={newUser.specialite}
                    onChange={(e) => setNewUser({ ...newUser, specialite: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                    aria-label="Spécialité du médecin"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={handleAddUser}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                aria-label="Ajouter l'utilisateur"
              >
                Ajouter
              </Button>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="px-6 py-2 rounded-lg font-medium"
                aria-label="Annuler l'ajout"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const roleConfig = [
    {
      role: "patient",
      component: <PatientDashboard currentUser={currentUser} addToHistory={addToHistory} logout={logout} />,
      header: <Header logout={logout} />,
    },
    {
      role: "medecin",
      component: <MedecinDashboard currentUser={currentUser} logout={logout} />,
      header: <Header logout={logout} />,
    },
    {
      role: "admin",
      component: <AdminStaffDashboard label="Administrateur" />,
      header: (
        <header className="flex items-center justify-between border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Accueil
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
              aria-label="Se déconnecter"
            >
              Se déconnecter
            </Button>
          </nav>
        </header>
      ),
    },
    {
      role: "staff",
      component: <AdminStaffDashboard label="Personnel" />,
      header: (
        <header className="flex items-center justify-between border-b border-border pb-4">
          <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Accueil
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
              aria-label="Se déconnecter"
            >
              Se déconnecter
            </Button>
          </nav>
        </header>
      ),
    },
  ];

  return (
    <main className="min-h-screen container mx-auto px-4 sm:px-6 py-8 bg-background text-foreground">
      {roleConfig.map(
        (config) =>
          config.role === role && (
            <div key={config.role}>
              {config.header}
              {config.component}
            </div>
          )
      )}
    </main>
  );
};

export default Dashboard;