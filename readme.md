# Installation guide

## Requirements

- Node js
- Docker
- Google cloud cli

Once you have installed all the requirements you can clone the project :

− git clone https://github.com/lionel-kg/allo-review.git

for each folder rename the .env.example to .env then fill up the variables

## BDD Service

− cd bdd-api-service
− npm install
− docker compose up -d
− npx prisma migrate dev
− npm run seed_genres
− npm run seed_categories
− npm run seed_appreciations
− npm run seed_movies
− npm run start

## IA Service

You have to authenticate to google cloud CLI and add the credentials.json at the base of the IA folder.

- cd ia-service
- npm install
- npm run start

## Oauth Service

- cd o-auth-service
- npm install
- npm run start

## Payment Service

- cd payment-handler-service
- npm install
- npm run start

## Notification Service

- cd notification-sms-service
- npm install
- npm run start

## Front

- cd front
- npm install
- npm run dev
