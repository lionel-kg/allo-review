# Utiliser une image Node.js officielle comme image de base
FROM node:18-alpine

# Installer Python et autres dépendances nécessaires pour node-gyp
RUN apk add --no-cache python3 make g++

# Créer un lien symbolique pour python3
RUN ln -sf python3 /usr/bin/python

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json dans le répertoire de travail
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel le serveur écoute
EXPOSE 9000

# Lancer la commande de démarrage de ton serveur
CMD ["npm", "start"]
