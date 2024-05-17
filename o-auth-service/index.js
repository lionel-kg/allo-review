require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env
const express = require('express');
const session = require('express-session');
const passport = require('./src/config/config.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const Router = require('./src/routes');
const app = express();

app.use(cors());
app.use(
  session({
    secret: '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',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use('/', Router);

app.listen(process.env.API_PORT, () => {
  console.log('server listening on port ' + process.env.API_PORT);
});
