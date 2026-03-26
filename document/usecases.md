# Use Cases — Cafeterie

## 1. Authentification
- **Acteur principal** : Utilisateur
- **But** : Se connecter à la plateforme pour accéder à ses fonctionnalités.
- **Scénario principal** :
  1. L'utilisateur saisit son identifiant et son mot de passe.
  2. Le système vérifie les informations.
  3. Si elles sont valides, l'utilisateur reçoit un token d'accès.

## 2. Consultation du profil
- **Acteur principal** : Utilisateur
- **But** : Consulter ses informations personnelles et son solde.
- **Scénario principal** :
  1. L'utilisateur accède à la page profil.
  2. Le système affiche les informations et le solde.

## 3. Achat d’un produit
- **Acteur principal** : Utilisateur
- **But** : Acheter un produit via une machine ou le stock.
- **Scénario principal** :
  1. L'utilisateur sélectionne un produit.
  2. Le système vérifie le solde et la disponibilité.
  3. Le système enregistre l'achat et met à jour le stock et le solde.

## 4. Gestion du stock
- **Acteur principal** : Administrateur
- **But** : Ajouter, modifier ou supprimer des produits du stock.
- **Scénario principal** :
  1. L'administrateur accède à la gestion du stock.
  2. Il ajoute/modifie/supprime un produit.
  3. Le système met à jour le stock.

## 5. Consultation de l’historique des achats
- **Acteur principal** : Utilisateur
- **But** : Voir la liste de ses achats passés.
- **Scénario principal** :
  1. L'utilisateur accède à l'historique.
  2. Le système affiche la liste des achats.

## 6. Gestion des utilisateurs
- **Acteur principal** : Administrateur
- **But** : Créer, modifier, supprimer des comptes utilisateurs.
- **Scénario principal** :
  1. L'administrateur accède à la gestion des utilisateurs.
  2. Il effectue les opérations nécessaires.
  3. Le système met à jour les comptes.

## 7. Gestion des événements
- **Acteur principal** : Administrateur
- **But** : Créer et gérer des événements spéciaux (ex : promotions).
- **Scénario principal** :
  1. L'administrateur crée/modifie/supprime un événement.
  2. Le système applique les changements.

## 8. Scan et enregistrement d'un produit
- **Acteur principal** : Utilisateur
- **But** : Enregistrer un produit via scan code-barres ou photo (caméra ou upload manuel).
- **Scénario principal** :
  1. L'utilisateur ouvre l'écran d'ajout produit.
  2. Il choisit l'un des modes : scanner un code-barres, prendre une photo ou uploader une photo.
  3. Le système analyse l'entrée et tente d'identifier le produit.
  4. Si le produit est reconnu, le système enregistre le produit et trace la source d'acquisition (`scan` ou `photo`).
  5. Le système affiche une confirmation de création.
- **Extensions** :
  1. Si l'image est invalide (format/taille), le système refuse le fichier avec un message explicite.
  2. Si la reconnaissance échoue, l'utilisateur peut réessayer avec une autre image.

---

N’hésite pas à préciser si tu veux des cas d’usage plus détaillés ou des extensions/alternatives pour chaque scénario.