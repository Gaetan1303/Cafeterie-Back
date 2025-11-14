# Cafeterie-Back

Back-end Node.js/Express pour la gestion d'une cafétéria universitaire.

## Fonctionnalités principales

- Authentification JWT (utilisateurs/admins)
- Gestion des utilisateurs (CRUD, rôles)
- Gestion du stock (CRUD, alertes seuil, historique mouvements)
- Gestion des achats et consommations
- Catégorisation des produits
- Gestion des machines (CRUD, suivi)
- Gestion des évènements (CRUD, participations, alertes)
- Dashboard statistiques (stock, utilisateurs, évènements, participations)
- Initialisation et nettoyage de la base de données
- Logs d’erreurs centralisés

## Structure du projet

```
Cafeterie-Back/
├── Cafeterie/
│   ├── src/
│   │   ├── controllers/   # Logique métier (stock, users, events...)
│   │   ├── models/        # Schémas Mongoose
│   │   ├── routes/        # Endpoints Express
│   │   ├── utils/         # Utilitaires (connexion DB, logs...)
│   │   └── app.js         # Point d’entrée API
│   ├── .env.example       # Variables d’environnement
│   └── package.json
└── README.md
```

## Installation

1. **Cloner le repo**
	```bash
	git clone https://github.com/Gaetan1303/Cafeterie-Back.git
	cd Cafeterie-Back/Cafeterie
	```
2. **Installer les dépendances**
	```bash
	npm install
	```
3. **Configurer l’environnement**
	- Copier `.env.example` en `.env` et adapter les variables (MongoDB, JWT_SECRET...)

4. **Lancer le serveur**
	```bash
	npm start
	```

## Endpoints principaux

- `/auth` : Authentification (login/register)
- `/users` : Gestion des utilisateurs
- `/stock` : Gestion du stock
- `/machines` : Gestion des machines
- `/events` : Gestion des évènements
- `/stock-history` : Historique des mouvements de stock
- `/dashboard` : Statistiques croisées (stock, users, opérations...)
- `/events/dashboard` : Statistiques évènements/participations

> Tous les endpoints sont sécurisés (JWT, rôle admin pour certaines opérations).

## Scripts utiles

- `npm run clean` : Nettoyer la base de données
- `npm run init` : Initialiser la base avec des données de test

## Contribution

1. Forker le repo
2. Créer une branche (`feature/ma-fonctionnalite`)
3. Commit & push vos modifications
4. Ouvrir une Pull Request

## Auteurs
- Gaetan1303
- Billy

## Licence
MIT