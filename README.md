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
│   ├── .env       # Variables d’environnement
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
	- Faites un `.env` et adapter les variables (MongoDB, JWT_SECRET...)

4. **Lancer le serveur**
	```bash
	npm start
	```


## Endpoints principaux

### Authentification ( PUBLIC )
- `POST /auth/register` : Inscription utilisateur
- `POST /auth/login` : Connexion utilisateur

> Tous les endpoints suivant sont sécurisés (JWT, rôle admin pour certaines opérations).

### Utilisateurs
- `GET /profile` : Infos du profil connecté
- `PUT /profile` : Modifier son profil

### Stock
- `GET /stock` : Liste paginée du stock
- `GET /stock/:id` : Détail d’un item
- `POST /stock` : Créer un item (admin)
- `PUT /stock/:id` : Modifier un item (admin)
- `DELETE /stock/:id` : Supprimer un item (admin)
- `GET /stock/stats` : Statistiques globales
- `GET /stock/alerts` : Items en alerte
- `POST /stock/restock` : Réapprovisionnement (admin)

### Achats
- `GET /purchases/recent` : Derniers achats (pag.)
- `GET /purchases/me` : Historique de l’utilisateur connecté
- `GET /purchases/all` : Historique global (admin)
- `POST /purchases` : Enregistrer un achat

### Évènements
- `GET /events` : Liste paginée des évènements
- `GET /events/:id` : Détail d’un évènement
- `POST /events` : Créer un évènement (admin)
- `PUT /events/:id` : Modifier (admin)
- `DELETE /events/:id` : Supprimer (admin)
- `POST /events/:id/participate` : Participer
- `POST /events/:id/unparticipate` : Se désinscrire
- `GET /events/dashboard` : Statistiques évènements
- `GET /events/alert/critical` : Alertes seuil critique

### Machines
- `GET /machines` : Liste des machines
- `GET /machines/:id` : Détail d’une machine
- `POST /machines` : Créer (admin)
- `PUT /machines/:id` : Modifier (admin)
- `DELETE /machines/:id` : Supprimer (admin)
- `POST /machines/:id/use` : Utiliser/préparer
- `POST /machines/:id/clean` : Nettoyer
- `POST /machines/:id/state` : Changer état (admin)

### Historique de stock
- `GET /stock-history/:id` : Historique d’un item
- `GET /stock-history` : Historique global (admin)
- `GET /stock-history/dashboard` : Dashboard croisé (admin)
- `POST /stock-history/operation` : Log opération (nettoyage/préparation)


---

## Modèles principaux (Mongoose)

### User
```js
{
	firstName: String,
	lastName: String,
	email: String (unique),
	password: String (hashé),
	role: 'user' | 'admin',
	createdAt: Date
}
```

### StockItem
```js
{
	type: String (enum),
	subtype: String,
	category: String (enum),
	quantity: Number,
	threshold: Number,
	lastRestocked: Date
}
```

### Purchase
```js
{
	user: ObjectId (User),
	stockItem: ObjectId (StockItem),
	quantity: Number,
	timestamp: Date
}
```

### Event
```js
{
	title: String,
	description: String,
	date: Date,
	type: String (enum),
	participants: [ObjectId (User)],
	maxParticipants: Number,
	alertThreshold: Number,
	createdAt: Date
}
```

### Machine
```js
{
	name: String,
	type: String (enum),
	capacity: Number,
	unit: String (enum),
	state: String (enum),
	lastUsed: Date,
	lastCleaned: Date,
	consumables: [{
		name: String,
		stockRef: ObjectId (StockItem),
		quantity: Number,
		unit: String
	}]
}
```

### StockHistory
```js
{
	item: ObjectId (StockItem),
	action: 'entrée' | 'sortie' | 'nettoyage' | 'préparation',
	quantity: Number,
	date: Date,
	user: ObjectId (User),
	Auteur: ObjectId (User),
	reason: String
}
```

---

## DTO


### User
```json
{
	"firstName": "string",
	"lastName": "string",
	"email": "string",
	"role": "user | admin",
	"createdAt": "date"
}
```

### StockItem
```json
{
	"type": "string",
	"subtype": "string",
	"category": "string",
	"quantity": "number",
	"threshold": "number",
	"lastRestocked": "date"
}
```

### Purchase
```json
{
	"user": "ObjectId",
	"stockItem": "ObjectId",
	"quantity": "number",
	"timestamp": "date"
}
```

### Event
```json
{
	"title": "string",
	"description": "string",
	"date": "date",
	"type": "string",
	"participants": ["ObjectId"],
	"maxParticipants": "number",
	"alertThreshold": "number",
	"createdAt": "date"
}
```

### Machine
```json
{
	"name": "string",
	"type": "string",
	"capacity": "number",
	"unit": "string",
	"state": "string",
	"lastUsed": "date",
	"lastCleaned": "date",
	"consumables": [
		{
			"name": "string",
			"stockRef": "ObjectId",
			"quantity": "number",
			"unit": "string"
		}
	]
}
```

### StockHistory
```json
{
	"item": "ObjectId",
	"action": "entrée | sortie | nettoyage | préparation",
	"quantity": "number",
	"date": "date",
	"user": "ObjectId",
	"Auteur": "ObjectId",
	"reason": "string"
}
```

## Enums utilisés dans les modèles

### User
- `role` :
  - `user`
  - `admin`

### StockItem
- `type` :
  - `cafe`, `the`, `nourriture`, `jus`, `viennoiserie`, `apero`, `petit-dejeuner`, `fruit`
- `category` :
  - `Boisson chaude`, `Boisson froide`, `Viennoiserie`, `Apéro`, `Petit déjeuner`, `Fruits et Légumes`

### Event
- `type` :
  - `sortie`, `aquapiscine`, `autre`

### Machine
- `type` :
  - `cafe`, `the`
- `unit` :
  - `tasse`, `litre`, `g`, `sachet`
- `state` :
  - `Disponible`, `Remplie`, `Eteinte`, `en nettoyage`, `en panne`

### StockHistory
- `action` :
  - `entrée`, `sortie`, `nettoyage`, `préparation`

---

## Exemples d’utilisation API

### Authentification (inscription)
```http
POST /auth/register
{
	"firstName": "Alice",
	"lastName": "Martin",
	"email": "alice@univ.fr",
	"password": "MotDePasseS3cur!"
}
```

### Enregistrer un achat
```http
POST /purchases
Authorization: Bearer <token>
{
	"stockItem": "<id de l’item>",
	"quantity": 2
}
```

### Créer un évènement (admin)
```http
POST /events
Authorization: Bearer <token admin>
{
	"title": "Sortie Bowling",
	"date": "2025-12-01T19:00:00Z",
	"type": "sortie",
	"maxParticipants": 12
}
```

---

## Lancer les tests

Des tests unitaires et d’intégration sont recommandés (ex : Jest, Supertest).

---

## Sécurité & production

- JWT_SECRET fort et confidentiel
- Limitation de débit (rate limiting)
- Validation stricte des entrées (express-validator)
- Pool de connexions MongoDB optimisé
- Logs centralisés (Winston)
- CORS configuré

---

## Contact & contribution

Pour toute question ou contribution, ouvrez une issue ou une pull request sur GitHub.

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
Mimine For ever