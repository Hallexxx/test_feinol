import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  let [usersCount, setUsersCount] = useState([]);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: `http://localhost:${port}`,
        });
        const response = await api.get('/users');
        setUsersCount(response.data.Utilisateurs.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    countUsers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Users Manager</h1>
        <p>
          {usersCount} user already registered.
        </p>
      </header>
    </div>
  );
}

export default App;
