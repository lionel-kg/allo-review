# Utiliser une image Node.js officielle comme image de base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json dans le répertoire de travail
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application dans le conteneur
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port sur lequel l'application Next.js sera accessible
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
