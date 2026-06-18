import axios from 'axios';
import { getUsers, addUser, getUserDetails, deleteUser } from './api';

jest.mock('axios');

test('récupère les utilisateurs', () => {
    const users = [
        { id: 1, nom: 'Perez', prenom: 'Alexandre', email: 'alex@test.com' }
    ];
    const response = {
        data: {
        Utilisateurs: users
        }
    };
    axios.get.mockResolvedValue(response);
    return getUsers().then((data) => {
        expect(data).toEqual(users);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/users');
    });
});

test('ajoute un utilisateur', () => {
    const response = {
        data: {
        message: 'Utilisateur ajouté'
        }
    };
    axios.post.mockResolvedValue(response);
    return addUser('Perez', 'Alexandre', 'alex@test.com').then((data) => {
        expect(data).toEqual(response.data);
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/users', {
        nom: 'Perez',
        prenom: 'Alexandre',
        email: 'alex@test.com'
        });
    });
});

test('récupère les informations privées utilisateur', () => {
    const user = {
        id: 1,
        nom: 'Perez',
        prenom: 'Alexandre',
        email: 'alex@test.com',
        password: 'secret',
        role: 'user'
    };
    const response = {
        data: {
        Utilisateur: user
        }
    };
    axios.get.mockResolvedValue(response);
    return getUserDetails(1).then((data) => {
        expect(data).toEqual(user);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/users/1');
    });
});

test('supprime un utilisateur', () => {
    const response = {
        data: {
        message: 'Utilisateur supprimé'
        }
    };
    axios.delete.mockResolvedValue(response);
    return deleteUser(1).then((data) => {
        expect(data).toEqual(response.data);
        expect(axios.delete).toHaveBeenCalledWith('http://localhost:8000/users/1');
    });
});

test('gère une erreur API', () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    return expect(getUsers()).rejects.toThrow('Network Error');
});