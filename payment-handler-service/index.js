require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./src/routes/index.js');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Middleware spécifique pour le traitement conditionnel de JSON
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Pour les webhook, passer sans transformer en JSON
  } else {
    express.json()(req, res, next); // Pour les autres routes, appliquer bodyParser.json()
  }
});

app.use('', apiRouter);

app.listen(process.env.API_PORT, () =>
  console.log('Running on port ' + process.env.API_PORT),
);
