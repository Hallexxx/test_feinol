import './App.css';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

function App() {
  const localApiUrl = `http://localhost:${process.env.REACT_APP_SERVER_PORT || 8000}`;
  const apiUrl = (
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://test-feinol-3mb2.vercel.app'
      : localApiUrl)
  ).replace(/\/$/, '');
  const [users, setUsers] = useState([]);
  const [privateUser, setPrivateUser] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data.Utilisateurs);
    } catch (error) {
      setError('Erreur');
    }
  }, [apiUrl]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleSubmit() {
    const nom = document.querySelector('[data-cy=nom]').value;
    const prenom = document.querySelector('[data-cy=prenom]').value;
    const email = document.querySelector('[data-cy=email]').value;
    if (!email.includes('@')) {
      setError('Erreur');
      return;
    }
    try {
      await axios.post(
        `${apiUrl}/users`,
        {
          nom,
          prenom,
          email
        }
      );
      await loadUsers();
      setError('');
    }
    catch (error) {
      setError('Erreur');
    }
  }

  async function showDetails(id) {
    const response = await axios.get(`${apiUrl}/users/${id}`);
    setPrivateUser(response.data.Utilisateur);
  }

  async function deleteUser(id) {
    const adminEmail = document.querySelector('[data-cy=admin-email]').value;
    const adminPassword = document.querySelector('[data-cy=admin-password]').value;
    if (
      adminEmail !== process.env.REACT_APP_ADMIN_EMAIL ||
      adminPassword !== process.env.REACT_APP_ADMIN_PASSWORD
    ) {
      setError('Erreur');
      return;
    }
    await axios.delete(`${apiUrl}/users/${id}`);
    loadUsers();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Users Manager</h1>
        <p>{users.length} user already registered</p>
        <button>Formulaire</button>
        <form>
          <input data-cy="nom" placeholder="Nom" />
          <input data-cy="prenom" placeholder="Prénom" />
          <input data-cy="email" placeholder="Email" />
          <button data-cy="submit" type="button" onClick={handleSubmit}>
            Ajouter
          </button>
        </form>
        <h2>Admin</h2>
        <input data-cy="admin-email" placeholder="Email admin" />
        <input data-cy="admin-password" placeholder="Mot de passe admin" />
        <h2>Utilisateurs</h2>
        {users.map((user) => (
          <div key={user.id || user[0]}>
            <p>
              {user.nom || user[1]} {user.prenom || user[2]}
            </p>
            <button
              data-cy={`details-${user.id || user[0]}`}
              onClick={() => showDetails(user.id || user[0])}
            >
              Voir détails
            </button>
            <button
              data-cy={`delete-${user.id || user[0]}`}
              onClick={() => deleteUser(user.id || user[0])}
            >
              Supprimer
            </button>
          </div>
        ))}
        {privateUser && (
          <div>
            <h2>Informations privées</h2>
            <p>{privateUser.email}</p>
            <p>{privateUser.password}</p>
            <p>{privateUser.role}</p>
          </div>
        )}
        {error && <p>{error}</p>}
      </header>
    </div>
  );
}

export default App;
