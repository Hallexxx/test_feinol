import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.REACT_APP_SERVER_PORT = '8000';
  process.env.REACT_APP_ADMIN_EMAIL = 'loise.fenoll@ynov.com';
  process.env.REACT_APP_ADMIN_PASSWORD = 'PvdrTAzTeR247sDnAZBr';
});

test('affiche le formulaire utilisateur', async () => {
  axios.get.mockResolvedValue({ data: { Utilisateurs: [] } });
  render(<App />);
  expect(await screen.findByText(/Users Manager/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Nom')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Prénom')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByText('Ajouter')).toBeInTheDocument();
});

test('affiche une erreur si email invalide', async () => {
  axios.get.mockResolvedValue({ data: { Utilisateurs: [] } });
  render(<App />);
  await screen.findByText(/Users Manager/i);
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'email-invalide' }
  });
  fireEvent.click(screen.getByText('Ajouter'));
  expect(screen.getByText('Erreur')).toBeInTheDocument();
});

test('affiche la liste des utilisateurs', async () => {
  axios.get.mockResolvedValue({
    data: {
      Utilisateurs: [
        { id: 1, nom: 'Perez', prenom: 'Alexandre', email: 'alex@test.com' }
      ]
    }
  });
  render(<App />);
  expect(await screen.findByText(/Perez/i)).toBeInTheDocument();
  expect(screen.getByText(/Alexandre/i)).toBeInTheDocument();
});

test('ajoute un utilisateur valide', async () => {
  axios.get
    .mockResolvedValueOnce({ data: { Utilisateurs: [] } })
    .mockResolvedValueOnce({
      data: {
        Utilisateurs: [
          { id: 1, nom: 'Perez', prenom: 'Alexandre', email: 'alex@test.com' }
        ]
      }
    });
  axios.post.mockResolvedValue({ data: { message: 'Utilisateur ajouté' } });
  render(<App />);
  await screen.findByText(/Users Manager/i);
  fireEvent.change(screen.getByPlaceholderText('Nom'), {
    target: { value: 'Perez' }
  });
  fireEvent.change(screen.getByPlaceholderText('Prénom'), {
    target: { value: 'Alexandre' }
  });
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'alex@test.com' }
  });
  fireEvent.click(screen.getByText('Ajouter'));
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
  });
});

test('refuse suppression si admin incorrect', async () => {
  axios.get.mockResolvedValue({
    data: {
      Utilisateurs: [
        { id: 1, nom: 'Perez', prenom: 'Alexandre', email: 'alex@test.com' }
      ]
    }
  });
  render(<App />);
  await screen.findByText(/Perez/i);
  fireEvent.change(screen.getByPlaceholderText('Email admin'), {
    target: { value: 'wrong@test.com' }
  });
  fireEvent.change(screen.getByPlaceholderText('Mot de passe admin'), {
    target: { value: 'wrong' }
  });
  fireEvent.click(screen.getByText('Supprimer'));
  expect(screen.getByText('Erreur')).toBeInTheDocument();
});

test('affiche les informations privées', async () => {
  axios.get
    .mockResolvedValueOnce({
      data: {
        Utilisateurs: [
          { id: 1, nom: 'Perez', prenom: 'Alexandre', email: 'alex@test.com' }
        ]
      }
    })
    .mockResolvedValueOnce({
      data: {
        Utilisateur: {
          id: 1,
          email: 'alex@test.com',
          password: 'secret',
          role: 'user'
        }
      }
    });
  render(<App />);
  await screen.findByText(/Perez/i);
  fireEvent.click(screen.getByText('Voir détails'));
  expect(await screen.findByText('secret')).toBeInTheDocument();
  expect(screen.getByText('user')).toBeInTheDocument();
});