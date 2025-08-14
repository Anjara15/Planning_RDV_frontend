import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import MedecinDashboard from "./MedecinDashboard";
import { Users2, CalendarCheck, Settings, X, Bell } from "lucide-react";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsersTable, setShowUsersTable] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", age: "", role: "patient", specialite: "", isNew: false });
  const [showRendezVous, setShowRendezVous] = useState(false);
  const [rendezVous, setRendezVous] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const navigate = useNavigate();

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

    // Create alerts for new users and appointments
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
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (currentUser && updatedUsers[index].username === currentUser.username && updatedUsers[index].role === currentUser.role) {
      setCurrentUser(updatedUsers[index]);
      localStorage.setItem("user", JSON.stringify(updatedUsers[index]));
    }
  };

  const saveUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].isNew = false; // Mark as viewed
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (currentUser && updatedUsers[index].username === currentUser.username && updatedUsers[index].role === currentUser.role) {
      setCurrentUser(updatedUsers[index]);
      localStorage.setItem("user", JSON.stringify(updatedUsers[index]));
    }

    setAlerts(alerts.filter(alert => alert.id !== `user-${updatedUsers[index].username}`));
    alert(`Utilisateur "${updatedUsers[index].username}" sauvegardé !`);
  };

  const deleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    setAlerts(alerts.filter(alert => alert.id !== `user-${users[index].username}`));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (currentUser && users[index].username === currentUser.username && users[index].role === currentUser.role) {
      localStorage.removeItem("user");
      setCurrentUser(null);
      navigate("/auth");
    }
  };

  const handleAddUser = () => {
    const updatedUsers = [...users, { ...newUser, isNew: true }];
    setUsers(updatedUsers);
    setAlerts([...alerts, { id: `user-${newUser.username}`, message: `Nouvel utilisateur ajouté: ${newUser.username}` }]);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setShowAddModal(false);

    alert(`Utilisateur "${newUser.username}" ajouté !`);
    setNewUser({ username: "", email: "", age: "", role: "patient", specialite: "", isNew: false });
  };

  const handleShowAlerts = () => {
    setShowAlerts(!showAlerts);
    if (!showAlerts) {
      // Mark all users and appointments as viewed
      const updatedUsers = users.map(user => ({ ...user, isNew: false }));
      const updatedRdv = rendezVous.map(rdv => ({ ...rdv, isNew: false }));
      setUsers(updatedUsers);
      setRendezVous(updatedRdv);
      setAlerts([]); // Clear alerts
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("rendezVous", JSON.stringify(updatedRdv));
    }
  };

  const AdminStaffDashboard = ({ label }) => (
    <div className="space-y-12">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-primary tracking-tight">
            Bienvenue, <span className="text-secondary">{label}</span>
          </h2>
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-full hover:bg-muted"
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

      <div className="grid md:grid-cols-3 gap-8">
        {/* Gestion des utilisateurs */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6">
          <h3 className="flex items-center gap-3 text-primary font-semibold text-lg mb-3">
            <Users2 className="w-6 h-6" />
            Utilisateurs
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Gérez les comptes et les rôles du personnel médical.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setShowUsersTable(!showUsersTable)}
              className="bg-primary hover:bg-primary-hover-600 text-primary-foreground transition-colors"
            >
              Gérer les comptes
            </Button>
          </div>
        </article>

        {/* Rendez-vous */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border-secondary border">
          <h3 className="flex items-center gap-3 text-secondary font-semibold text-lg mb-3">
            <CalendarCheck className="w-6 h-6" />
            Rendez-vous
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Supervisez et réaffectez les créneaux médicaux.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setShowRendezVous(!showRendezVous)}
              className="bg-secondary hover:bg-secondary-hover-600 text-white transition-colors"
            >
              Voir les rendez-vous
            </Button>
          </div>
        </article>

        {/* Configuration */}
        <article className="medical-card medical-shadow hover:medical-shadow-hover transition-transform duration-300 hover:-translate-y-1 p-6 border-accent border">
          <h3 className="flex items-center gap-3 text-accent font-semibold text-lg mb-3">
            <Settings className="w-6 h-6" />
            Configuration
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Spécialités,Historiques, disponibilités et autres paramètres.
          </p>
        </article>
      </div>

      {/* Tableau des utilisateurs */}
      {showUsersTable && (
        <div className="mt-8">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => setShowUsersTable(false)}
              className="text-white p-1 rounded-full flex items-center justify-center hover:bg-muted/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-auto max-h-[400px] border border-border rounded-lg">
            <table className="w-full border-collapse border border-border min-w-[700px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Âge</th>
                  <th className="border p-2">Rôle</th>
                  <th className="border p-2">Spécialités</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className={`hover:bg-muted/50 ${user.isNew ? "bg-yellow-100" : ""}`}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={user.username}
                        onChange={(e) => handleUserChange(index, "username", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="email"
                        value={user.email || ""}
                        onChange={(e) => handleUserChange(index, "email", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={user.age || ""}
                        onChange={(e) => handleUserChange(index, "age", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleUserChange(index, "role", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="patient">Patient</option>
                        <option value="medecin">Médecin</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      {user.role === "medecin" ? (
                        <input
                          type="text"
                          value={user.specialite || ""}
                          onChange={(e) => handleUserChange(index, "specialite", e.target.value)}
                          className="w-full border rounded px-2 py-1"
                          placeholder="Spécialité"
                        />
                      ) : "-"}
                    </td>
                    <td className="border p-2 flex gap-2 justify-center">
                      <Button size="sm" onClick={() => saveUser(index)} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Modifier
                      </Button>
                      <Button size="sm" onClick={() => deleteUser(index)} className="bg-red-500 hover:bg-red-600 text-white">
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setShowAddModal(true)} className="bg-green-500 hover:bg-green-600 text-white">
              Ajouter un nouvel utilisateur
            </Button>
          </div>
        </div>
      )}

      {/* Tableau des rendez-vous */}
      {showRendezVous && (
        <div className="mt-8">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => setShowRendezVous(false)}
              className="text-white p-1 rounded-full flex items-center justify-center hover:bg-muted/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-auto max-h-[400px] border border-border rounded-lg">
            <table className="w-full border-collapse border border-border min-w-[1000px]">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Prénom</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Téléphone</th>
                  <th className="border p-2">Spécialité</th>
                  <th className="border p-2">Médecin</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Heure</th>
                </tr>
              </thead>
              <tbody>
                {rendezVous.length > 0 ? (
                  rendezVous.map((rdv, index) => {
                    let username = rdv.username;
                    try {
                      const parsed = JSON.parse(rdv.username);
                      if (parsed.username) username = parsed.username;
                    } catch {
                      // Silently continue if username is not valid JSON
                    }
                    return (
                      <tr key={index} className={`hover:bg-muted/50 ${rdv.isNew ? "bg-yellow-100" : ""}`}>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">{username}</td>
                        <td className="border p-2">{rdv.nom || "-"}</td>
                        <td className="border p-2">{rdv.prenom || "-"}</td>
                        <td className="border p-2">{rdv.email || "-"}</td>
                        <td className="border p-2">{rdv.telephone || "-"}</td>
                        <td className="border p-2">{rdv.specialite || "-"}</td>
                        <td className="border p-2">{rdv.medecin || "-"}</td>
                        <td className="border p-2">{rdv.date || "-"}</td>
                        <td className="border p-2">{rdv.heure || rdv.time || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center p-4">Aucun rendez-vous enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal d'ajout utilisateur */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-2xl w-full max-w-2xl mx-auto my-auto p-10 relative shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors duration-200 rounded-full p-1 hover:bg-muted/50"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-4xl font-bold mb-8 text-center text-primary">Ajouter un utilisateur</h3>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Nom"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full border rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all duration-200"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all duration-200"
              />
              <input
                type="number"
                placeholder="Âge"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                className="w-full border rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all duration-200"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full border rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all duration-200"
              >
                <option value="patient">Patient</option>
                <option value="medecin">Médecin</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              {newUser.role === "medecin" && (
                <input
                  type="text"
                  placeholder="Spécialité"
                  value={newUser.specialite}
                  onChange={(e) => setNewUser({ ...newUser, specialite: e.target.value })}
                  className="w-full border rounded-xl px-5 py-4 focus:ring-4 focus:ring-primary/50 focus:outline-none transition-all duration-200"
                />
              )}
            </div>
            <div className="mt-10 flex justify-end gap-6">
              <Button
                onClick={handleAddUser}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Ajouter
              </Button>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="px-8 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen container mx-auto px-6 py-10 space-y-10 bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <h1 className="text-4xl font-extrabold text-primary">Tableau de bord</h1>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-primary hover:text-primary-hover font-medium">
            Accueil
          </Link>
          
          <Button
            variant="outline"
            onClick={logout}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Se déconnecter
          </Button>
        </nav>
      </header>

      {/* Contenu selon rôle */}
      {role === "patient" && <PatientDashboard currentUser={currentUser} />}
      {role === "medecin" && <MedecinDashboard currentUser={currentUser} />}
      {(role === "admin" || role === "staff") && <AdminStaffDashboard label={role === "admin" ? "Administrateur" : "Personnel"} />}
    </main>
  );
};

export default Dashboard;