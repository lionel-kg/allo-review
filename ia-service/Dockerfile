# Utiliser une image de Node.js comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de package.json et package-lock.json (s'ils existent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Copier le fichier de credentials.json dans le conteneur
COPY credentials.json /app/google-cloud-key.json

# Définir l'environnement pour utiliser les credentials de Google Cloud
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-cloud-key.json

# Exposer le port sur lequel le serveur écoute
EXPOSE 8000

# Lancer la commande de démarrage de ton serveur
CMD ["npm", "start"]
