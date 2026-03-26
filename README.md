# Cafeterie-Back

Back-end Node.js et Express pour la gestion d'une cafeteria universitaire.

## Objectif

Ce projet expose une API REST pour :
- Authentifier des utilisateurs avec JWT
- Gérer le stock et son historique
- Enregistrer les achats
- Gérer des machines et des événements
- Fournir des données de dashboard

## Stack technique

- **Node.js** : Environnement d'exécution JavaScript
- **Express** : Framework web minimaliste
- **MongoDB avec Mongoose** : Base de données NoSQL et ORM
- **JWT** : Authentification sécurisée
- **Swagger** : Documentation API

## Architecture

L'API suit une architecture en couches pour une meilleure organisation et maintenabilité :

- **Controllers** : Gestion des requêtes HTTP et des réponses.
- **DTOs (Data Transfer Objects)** : Validation et normalisation des données entrantes.
- **Actions (anciennement UseCases)** : Orchestration des cas métier.
- **Services** : Contiennent la logique métier.
- **Repositories** : Accès aux données via Mongoose.
- **Models** : Définition des schémas de données.
- **Observers** : Implémentation du pattern Observer pour surveiller les événements métier.

## Principales fonctionnalités

### Authentification
- Inscription et connexion des utilisateurs avec JWT.
- Gestion des rôles (utilisateur, administrateur).

### Gestion des stocks
- Consultation des stocks disponibles.
- Alertes sur les stocks faibles.
- Historique des opérations de stock.
- Réapprovisionnement des consommables.

### Gestion des achats
- Enregistrement des achats avec décrémentation automatique du stock.
- Historique des achats par utilisateur.
- Notifications via le pattern Observer.

### Gestion des machines
- Suivi des états des machines (utilisation, nettoyage, maintenance).
- Gestion des opérations administratives sur les machines.

### Gestion des événements
- Création et gestion des événements.
- Participation des utilisateurs aux événements.
- Données analytiques pour les dashboards.

## DTOs

Les DTOs assurent la validation des données entrantes. Voici quelques exemples :

- **UserDTO** :
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "string"
  }
  ```
- **PurchaseDTO** :
  ```json
  {
    "userId": "string",
    "items": [
      { "type": "string", "subtype": "string", "quantity": "number" }
    ]
  }
  ```
- **StockDTO** :
  ```json
  {
    "type": "string",
    "subtype": "string",
    "quantity": "number"
  }
  ```

## Actions (UseCases)

Les actions orchestrent les cas métier. Voici quelques exemples :

- **CreatePurchaseAction** :
  - Vérifie la disponibilité des stocks.
  - Crée un achat et met à jour l'historique.
  - Notifie les observers.
- **RestockAction** :
  - Ajoute des quantités au stock existant.
  - Enregistre l'opération dans l'historique.
- **ParticipateEventAction** :
  - Ajoute un utilisateur à un événement.
  - Met à jour les statistiques de participation.

## Installation

1. Installer les dépendances :

```bash
cd Cafeterie
npm install
```

2. Configurer les variables d'environnement dans un fichier `.env` :

Variables minimales :
- `PORT=3000`
- `MONGODB_URI=mongodb://localhost:27017/cafeterie`
- `JWT_SECRET=chaine_d_au_moins_32_caracteres`

3. Lancer le serveur :

```bash
npm start
```

Le serveur écoute par défaut sur [http://localhost:3000](http://localhost:3000).

## Documentation API

Swagger est disponible sur :
- [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Routes principales

### Auth
- POST /auth/register
- POST /auth/login

### Profile
- GET /profile/me
- PUT /profile/me

### Stock
- GET /stock
- GET /stock/stats
- GET /stock/alerts
- GET /stock/:id
- POST /stock (admin)
- PUT /stock/:id (admin)
- DELETE /stock/:id (admin)
- POST /stock/restock (admin)

### Purchases
- GET /purchases/recent
- GET /purchases/me
- GET /purchases/all (admin)
- POST /purchases

### Events
- GET /events
- GET /events/:id
- POST /events (admin)
- PUT /events/:id (admin)
- DELETE /events/:id (admin)
- POST /events/:id/participate
- POST /events/:id/unparticipate
- GET /events/dashboard
- GET /events/alert/critical

### Machines
- GET /machines
- GET /machines/:id
- POST /machines (admin)
- PUT /machines/:id (admin)
- DELETE /machines/:id (admin)
- POST /machines/:id/use
- POST /machines/:id/clean
- POST /machines/:id/state (admin)

### Stock history
- GET /stock-history (admin)
- GET /stock-history/dashboard (admin)
- GET /stock-history/:id
- POST /stock-history/operation

### Barcode
- POST /barcode/scan
- GET /barcode/scanned

### Consommables
- POST /consommables
- GET /consommables
- GET /consommables/:id
- PUT /consommables/:id (admin)
- DELETE /consommables/:id (admin)

