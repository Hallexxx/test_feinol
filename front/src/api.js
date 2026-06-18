import axios from 'axios';

const port = process.env.REACT_APP_SERVER_PORT || 8000;
const API = `http://localhost:${port}`;

export function getUsers() {
  return axios.get(`${API}/users`).then((response) => response.data.Utilisateurs);
}

export function addUser(nom, prenom, email) {
  return axios.post(`${API}/users`, {
    nom,
    prenom,
    email
  }).then((response) => response.data);
}

export function getUserDetails(id) {
  return axios.get(`${API}/users/${id}`).then((response) => response.data.Utilisateur);
}

export function deleteUser(id) {
  return axios.delete(`${API}/users/${id}`).then((response) => response.data);
}