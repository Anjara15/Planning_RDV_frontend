import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEye, faEyeSlash, faUser, faLock, faEnvelope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@gmail.com' },
  { username: 'mika', password: 'patient123', role: 'patient', email: 'mika@gmail.com' },
  { username: 'drsmith', password: 'medecin123', role: 'medecin', email: 'drsmith@gmail.com' },
];

const Auth = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const getStoredUsers = () => {
    const stored = localStorage.getItem('users');
    if (!stored) return defaultUsers;
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : defaultUsers;
    } catch {
      return defaultUsers;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      navigate('/dashboard');
      onClose();
    } else {
      setError('Identifiants invalides !');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Fond flou + overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Contenu modal */}
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full z-10 animate-fadeIn">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Fermer"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-center text-3xl font-bold text-blue-700 mb-4">Cabinet Médical</h2>
        <p className="text-center text-gray-500 mb-6">
          {showRegister ? 'Créer un compte' : 'Espace de connexion'}
        </p>

        {showRegister ? (
          <Register setShowRegister={setShowRegister} onClose={onClose} />
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                {error}
                <button onClick={() => setError('')} className="absolute right-3 top-2">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Nom d'utilisateur</label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 text-gray-500">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 outline-none"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre identifiant"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Mot de passe</label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 text-gray-500">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="flex-grow px-3 py-2 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>

              {/* Link to register */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => setShowRegister(true)}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                  Pas de compte ? Inscrivez-vous
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Register = ({ setShowRegister, onClose }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    await new Promise((resolve) => setTimeout(resolve, 800));

    const storedUsers = JSON.parse(localStorage.getItem('users')) || defaultUsers;

    if (storedUsers.some((u) => u.username === form.username)) {
      setError('Ce nom d’utilisateur est déjà pris !');
      setIsLoading(false);
      return;
    }
    if (storedUsers.some((u) => u.email === form.email)) {
      setError('Cet email est déjà utilisé !');
      setIsLoading(false);
      return;
    }
    if (!form.role) {
      setError('Veuillez sélectionner un rôle !');
      setIsLoading(false);
      return;
    }

    const newUser = { ...form };
    localStorage.setItem('users', JSON.stringify([...storedUsers, newUser]));
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('role', newUser.role);
    navigate('/dashboard');
    onClose();
    setIsLoading(false);
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          {error}
          <button onClick={() => setError('')} className="absolute right-3 top-2">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Username */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nom d'utilisateur</label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="text"
              className="flex-grow px-3 py-2 outline-none"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              className="flex-grow px-3 py-2 outline-none"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Mot de passe</label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="flex-grow px-3 py-2 outline-none"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="px-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Rôle</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Choisir un rôle --</option>
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          disabled={isLoading}
        >
          {isLoading ? 'Inscription...' : "S'inscrire"}
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-green-600 hover:underline font-medium"
            onClick={() => setShowRegister(false)}
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
            Déjà un compte ? Se connecter
          </button>
        </div>
      </form>
    </>
  );
};

export default Auth;
