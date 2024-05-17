require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Router = require("./src/routes");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", Router);

app.listen(process.env.API_PORT, () => {
  console.log("server listening on port " + process.env.API_PORT);
});
