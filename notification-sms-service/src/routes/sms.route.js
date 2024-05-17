const express = require("express");
const router = express.Router();
const { sendSMS } = require("../services/sms.service");
const axios = require("axios");

// Définir les routes de votre application
router.post("/send", async (req, res) => {
  let number = req.body.toPhoneNumber;
  number = number.slice(1);

  try {
    // Enregistrer le code dans la base de données
    console.log(process.env.BDD_API_URL + "/code/");
    const createdCode = await axios.post(process.env.BDD_API_URL + "/code/", {
      code: req.body.pincode,
    });

    console.log(createdCode);
    const toPhoneNumber = "+33" + number;
    const message = "Votre code de verification est: " + req.body.pincode;
    const smsSid = await sendSMS(toPhoneNumber, message);

    res
      .status(200)
      .json({ message: "SMS envoyé avec succès.", codeSended: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du SMS." });
  }
});

module.exports = router;
