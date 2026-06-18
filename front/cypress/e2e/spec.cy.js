describe('User form e2e', () => {
  it('ajoute un utilisateur sans erreur', () => {
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' }
        ]
      }
    }).as('getUsersBefore')
    cy.visit('http://localhost:3000')
    cy.wait('@getUsersBefore')
    cy.contains('1 user already registered')
    cy.intercept('POST', 'http://localhost:8000/users', {
      statusCode: 200,
      body: { message: 'Utilisateur ajouté' }
    }).as('addUser')

    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' },
          { id: 2, nom: 'Perez', prenom: 'Alexandre', email: 'alex@ynov.com' }
        ]
      }
    }).as('getUsersAfter')
    cy.get('[data-cy=nom]').type('Perez')
    cy.get('[data-cy=prenom]').type('Alexandre')
    cy.get('[data-cy=email]').type('alex@ynov.com')
    cy.get('[data-cy=submit]').click()
    cy.wait('@addUser')
    cy.wait('@getUsersAfter')
    cy.contains('2 user already registered')
  })
  it('n’ajoute pas un utilisateur avec erreur de formulaire', () => {
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' }
        ]
      }
    }).as('getUsers')
    cy.visit('http://localhost:3000')
    cy.wait('@getUsers')
    cy.contains('1 user already registered')
    cy.get('[data-cy=nom]').type('Perez')
    cy.get('[data-cy=prenom]').type('Alexandre')
    cy.get('[data-cy=email]').type('email-invalide')
    cy.get('[data-cy=submit]').click()
    cy.contains('Erreur')
    cy.contains('1 user already registered')
  })
  it('mode offline : erreur API', () => {
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' }
        ]
      }
    }).as('getUsers')
    cy.visit('http://localhost:3000')
    cy.wait('@getUsers')
    cy.contains('1 user already registered')
    cy.intercept('POST', 'http://localhost:8000/users', {
      statusCode: 500,
      body: { message: 'Erreur serveur' }
    }).as('addUserError')
    cy.get('[data-cy=nom]').type('Perez')
    cy.get('[data-cy=prenom]').type('Alexandre')
    cy.get('[data-cy=email]').type('alex@ynov.com')
    cy.get('[data-cy=submit]').click()
    cy.wait('@addUserError')
    cy.contains('Erreur')
  })
    it('affiche la liste des utilisateurs avec informations réduites', () => {
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' },
          { id: 2, nom: 'Perez', prenom: 'Alexandre', email: 'alex@ynov.com' }
        ]
      }
    }).as('getUsers')
    cy.visit('http://localhost:3000')
    cy.wait('@getUsers')
    cy.contains('Test')
    cy.contains('User')
    cy.contains('Perez')
    cy.contains('Alexandre')
  })

  it('affiche les informations privées d’un utilisateur', () => {
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' }
        ]
      }
    }).as('getUsers')
    cy.intercept('GET', 'http://localhost:8000/users/1', {
      statusCode: 200,
      body: {
        Utilisateur: {
          id: 1,
          nom: 'Test',
          prenom: 'User',
          email: 'test@ynov.com',
          password: 'secret',
          role: 'user'
        }
      }
    }).as('getPrivateUser')
    cy.visit('http://localhost:3000')
    cy.wait('@getUsers')
    cy.get('[data-cy=details-1]').click()
    cy.wait('@getPrivateUser')
    cy.contains('test@ynov.com')
    cy.contains('secret')
    cy.contains('user')
  })

  it('supprime un utilisateur avec un compte admin', () => {
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' },
          { id: 2, nom: 'Perez', prenom: 'Alexandre', email: 'alex@ynov.com' }
        ]
      }
    }).as('getUsersBefore')
    cy.visit('http://localhost:3000')
    cy.wait('@getUsersBefore')
    cy.contains('2 user already registered')
    cy.get('[data-cy=admin-email]').type('loise.fenoll@ynov.com')
    cy.get('[data-cy=admin-password]').type('PvdrTAzTeR247sDnAZBr')
    cy.intercept('DELETE', 'http://localhost:8000/users/2', {
      statusCode: 200,
      body: { message: 'Utilisateur supprimé' }
    }).as('deleteUser')
    cy.intercept('GET', 'http://localhost:8000/users', {
      statusCode: 200,
      body: {
        Utilisateurs: [
          { id: 1, nom: 'Test', prenom: 'User', email: 'test@ynov.com' }
        ]
      }
    }).as('getUsersAfter')
    cy.get('[data-cy=delete-2]').click()
    cy.wait('@deleteUser')
    cy.wait('@getUsersAfter')
    cy.contains('1 user already registered')
  })
})