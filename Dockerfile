# Utilisation de l'image Node.js officielle
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json de la racine et du backend
COPY package.json ./
COPY Cafeterie/package.json ./Cafeterie/

# Installer les dépendances racine (si besoin)
RUN npm install || true

# Installer les dépendances du backend
WORKDIR /app/Cafeterie
RUN npm install

# Copier tout le code
WORKDIR /app
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]