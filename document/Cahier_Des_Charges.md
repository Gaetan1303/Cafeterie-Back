# CAHIER DES CHARGES - PROJET Cafeterie-Back

## 1. SYNOPSIS ET VISION

### Contexte et Concept
Le projet **Cafeterie-Back** est une application web dédiée à la gestion d'une cafétéria "universitaire". Elle permet de gérer les stocks, les achats, les machines, les événements, et les utilisateurs via une API REST sécurisée.

### Objectifs et Enjeux
L'application doit centraliser les interactions entre plusieurs acteurs clés :
- Les utilisateurs (clients de la cafétéria)
- Les administrateurs (gestionnaires des stocks, machines, et événements)

#### Fonctionnalités clés :
- Gestion des stocks et alertes sur les niveaux faibles
- Enregistrement des achats avec décrémentation automatique des stocks
- Enregistrement d'un produit par scan ou par photo utilisateur
- Gestion des machines (utilisation, nettoyage, maintenance)
- Organisation d'événements et participation des utilisateurs
- Authentification sécurisée avec JWT

---

## 2. GLOSSAIRE

- **Utilisateur** : Client de la cafétéria utilisant l'application pour consulter les stocks, participer à des événements, ou effectuer des achats.
- **Administrateur** : Gestionnaire ayant des privilèges pour gérer les stocks, les machines, et les événements.
- **Stock** : Ensemble des consommables disponibles dans la cafétéria.
- **Machine** : Équipement utilisé dans la cafétéria (ex. : machine à café, distributeur).
- **Événement** : Activité organisée par la cafétéria (ex. : dégustation, promotions).
- **JWT** : JSON Web Token, utilisé pour l'authentification sécurisée.
- **Scan produit** : Processus d'identification et d'enregistrement d'un produit via code-barres ou image.
- **Upload photo** : Téléversement manuel d'une image depuis l'appareil utilisateur.

---

## 3. SPÉCIFICATIONS FONCTIONNELLES (PAR EPICS)

### EPIC 1 : Gestion des stocks

#### Objectif :
Permettre aux administrateurs de gérer efficacement les stocks.

#### User Stories :
- **US 1** : En tant qu'administrateur, je veux consulter les niveaux de stock pour éviter les ruptures.
  - **Critères d'acceptation** :
    - CA 1 : Affichage des niveaux de stock par catégorie.
    - CA 2 : Alertes automatiques pour les stocks faibles.

- **US 2** : En tant qu'administrateur, je veux réapprovisionner les stocks.
  - **Critères d'acceptation** :
    - CA 1 : Formulaire de réapprovisionnement avec validation des données.
    - CA 2 : Mise à jour automatique des niveaux de stock.

---

### EPIC 2 : Gestion des achats

#### Objectif :
Permettre aux utilisateurs d'effectuer des achats et de suivre leur historique.

#### User Stories :
- **US 1** : En tant qu'utilisateur, je veux effectuer un achat pour consommer un produit.
  - **Critères d'acceptation** :
    - CA 1 : Décrémentation automatique des stocks après un achat.
    - CA 2 : Notification de confirmation de l'achat.

- **US 2** : En tant qu'utilisateur, je veux consulter l'historique de mes achats.
  - **Critères d'acceptation** :
    - CA 1 : Affichage des achats récents avec détails (produit, quantité, date).

---

### EPIC 3 : Gestion des machines

#### Objectif :
Assurer le suivi des machines et leur maintenance.

#### User Stories :
- **US 1** : En tant qu'administrateur, je veux suivre l'état des machines pour planifier leur maintenance.
  - **Critères d'acceptation** :
    - CA 1 : Affichage de l'état actuel des machines (utilisation, nettoyage, maintenance).
    - CA 2 : Notifications pour les machines nécessitant une intervention.

- **US 2** : En tant qu'utilisateur, je veux signaler un problème avec une machine.
  - **Critères d'acceptation** :
    - CA 1 : Formulaire de signalement avec description du problème.
    - CA 2 : Notification envoyée à l'administrateur.

---

### EPIC 4 : Gestion des événements

#### Objectif :
Organiser des événements et permettre la participation des utilisateurs.

#### User Stories :
- **US 1** : En tant qu'utilisateur, je veux consulter les événements à venir.
  - **Critères d'acceptation** :
    - CA 1 : Affichage des événements avec détails (date, lieu, description).
    - CA 2 : Possibilité de s'inscrire à un événement.

- **US 2** : En tant qu'administrateur, je veux créer et gérer des événements.
  - **Critères d'acceptation** :
    - CA 1 : Formulaire de création d'événements avec validation des données.
    - CA 2 : Possibilité de modifier ou supprimer un événement.

---

### EPIC 5 : Authentification et gestion des utilisateurs

#### Objectif :
Assurer une authentification sécurisée et une gestion efficace des utilisateurs.

#### User Stories :
- **US 1** : En tant qu'utilisateur, je veux m'inscrire et me connecter pour accéder aux fonctionnalités.
  - **Critères d'acceptation** :
    - CA 1 : Formulaire d'inscription avec validation des données.
    - CA 2 : Authentification sécurisée avec JWT.

- **US 2** : En tant qu'administrateur, je veux gérer les rôles des utilisateurs.
  - **Critères d'acceptation** :
    - CA 1 : Possibilité d'attribuer ou de retirer des rôles (utilisateur, administrateur).

---

### EPIC 6 : Scan et enregistrement produit par image

#### Objectif :
Permettre aux utilisateurs d'enregistrer un produit rapidement à partir d'un scan ou d'une photo.

#### User Stories :
- **US 1** : En tant qu'utilisateur, je veux prendre une photo d'un produit depuis mon téléphone afin de l'enregistrer automatiquement dans l'application.
  - **Critères d'acceptation** :
    - CA 1 : Depuis l'interface scan, je peux ouvrir la caméra du téléphone et capturer une photo.
    - CA 2 : Après capture, le système tente l'identification du produit.
    - CA 3 : Si le produit est reconnu, il est enregistré en base avec les métadonnées disponibles (nom, catégorie, horodatage, utilisateur).
    - CA 4 : Je reçois un message de confirmation en cas de succès.
    - CA 5 : En cas d'échec de reconnaissance, je reçois un message clair et je peux réessayer.

- **US 2** : En tant qu'utilisateur, je veux uploader manuellement une photo d'un produit afin de l'enregistrer même sans accès direct à la caméra.
  - **Critères d'acceptation** :
    - CA 1 : Je peux sélectionner une image depuis ma galerie ou mon ordinateur.
    - CA 2 : Les formats autorisés sont JPG, JPEG et PNG.
    - CA 3 : Le système applique les mêmes règles d'identification qu'avec la caméra.
    - CA 4 : Si le produit est reconnu, il est enregistré et visible dans l'historique des scans.

- **US 3** : En tant qu'utilisateur, je veux pouvoir enregistrer un produit soit par scan code-barres, soit par photo, afin d'avoir deux modes de saisie complémentaires.
  - **Critères d'acceptation** :
    - CA 1 : L'écran propose explicitement les deux options : Scanner un code-barres et Prendre/Importer une photo.
    - CA 2 : Les deux parcours aboutissent à une création d'entrée produit cohérente dans le stockage applicatif.
    - CA 3 : Chaque enregistrement conserve la source d'acquisition (scan ou photo).

---

## 4. SPÉCIFICATIONS TECHNIQUES (IMPOSÉES)

### Accessibilité de l'application
- Respect des normes WCAG.
- Application responsive.

### Qualité du code
- Séparation logique (modèles, contrôleurs, services, DTOs).
- Code commenté selon la notation JSDoc.

### Stack Technique
- **Backend** : Node.js (Express), MongoDB (Mongoose).
- **Frontend** : Vue.js.
- **Style** : Tailwind CSS.

### Exigences techniques complémentaires (scan photo)
- Intégration de la capture photo côté frontend (API navigateur ou composant mobile).
- Upload multipart/form-data côté backend pour les images produits.
- Validation des types MIME et de la taille des fichiers uploadés.
- Journalisation de la source d'acquisition du produit : `scan` ou `photo`.
- Conservation d'un historique minimal des scans/photos par utilisateur authentifié.

### Sécurité
- Authentification par JWT.
- Validation des données avec Zod.
- Protection contre les attaques XSS et injections SQL.
- Contrôle strict des uploads (type, taille, nom de fichier, stockage sécurisé).

---

## 5. ANNEXES ET DONNÉES

### Matrice des privilèges par rôle

| Fonctionnalité               | Utilisateur | Administrateur |
|------------------------------|-------------|----------------|
| Consulter les stocks         | ✅          | ✅             |
| Réapprovisionner les stocks  | ❌          | ✅             |
| Effectuer un achat           | ✅          | ✅             |
| Scanner/enregistrer un produit par photo | ✅ | ✅          |
| Gérer les machines           | ❌          | ✅             |
| Créer/modifier des événements| ❌          | ✅             |

---