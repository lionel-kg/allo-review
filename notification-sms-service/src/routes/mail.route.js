const express = require("express");
const router = express.Router();
const { sendMail, sendResetMail, envoyerEmailResetMotDePasse, genererToken } = require("../services/mail.service");
const { default: axios } = require("axios");

// Définir les routes de votre application
router.get("/send", async (req, res) => {
  console.log(req.body);
  const from = {
    Email: "lionelkomguemalma@gmail.com",
    Name: "lionel",
  };
  const toArray = [];
  toArray.push({
    Email: req.body.toEmail,
    Name: req.body.toName,
  });
  const duration = req.body.duration;
  const greeting = "salutation chers " + req.body.toName;
  const subject =
    "Nouvelle souscription d'abonnement " + duration ? duration : "1 mois";
  const text =
    "Ceci est un test d'envoi de courrier avec LoopBack 4 et mailjet.";
  const price = req.body.price;
  const nameSubcription = req.body.nameSubscription;
  try {
    const mail = await sendMail(
      from,
      toArray,
      subject,
      text,
      duration,
      price,
      nameSubcription
    );
    res.send({ message: "E-mail envoyé avec succès." });
  } catch (error) {
    console.log(error);
    res.send({
      message:
        "Erreur lors de l'envoi de l'e-mail. Veuillez consulter les log.",
    });
  }
});

router.post("/reset-mail", async (req, res) => {
  console.log(req.body);
  const from = {
    Email: "lionelkomguemalma@gmail.com",
    Name: "lionel",
  };
  const toArray = [];
  toArray.push({
    Email: req.body.to,
  });
  const subject = req.body.subject;
  const text = req.body.text;

  try {
    const mail = await sendResetMail(from, toArray, subject, text);
    res.send({ message: "E-mail envoyé avec succès." });
  } catch (error) {
    console.log(error);
    res.send({
      message:
        "Erreur lors de l'envoi de l'e-mail. Veuillez consulter les log.",
    });
  }
});

// POST route pour demander la réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  // Générer un token et une date d'expiration
  const token = genererToken();
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1); // Exemple : expiration dans 1 heure

  // Appel Axios pour créer un nouveau token dans la base de données
  try {
      await axios.post(`${process.env.BDD_API_URL}/reset-password-token`, {
          token,
          email,
          expiration
      });
  } catch (error) {
      console.error("Erreur lors de la création du token de réinitialisation :", error);
      return res.status(500).json({ error: "Erreur lors de la création du token de réinitialisation" });
  }

  // Envoyer l'e-mail de réinitialisation de mot de passe
  
  const lienResetMotDePasse = `${process.env.FRONT_URL}/reset-password`;
  envoyerEmailResetMotDePasse(email, lienResetMotDePasse, token);

  // Répondre à la demande avec un message indiquant que l'e-mail a été envoyé
  res.send("Un e-mail de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.");
});

// GET route pour réinitialiser le mot de passe avec le token
router.get('/reset-password/:token', async (req, res) => {
  const token = req.params.token;

  console.log(token)
  // Appel Axios pour récupérer le token de réinitialisation de mot de passe
  try {
      const response = await axios.get(`${process.env.BDD_API_URL}/reset-password-token/${token}`);
      const resetToken = response.data;
      // Vérifier si le token est valide
      if (resetToken && new Date(resetToken.expiration) > new Date()) {
        // Afficher la page de réinitialisation de mot de passe
        return res.json({isExpired: false});
      } 
      else {
        console.log(resetToken)
        return res.json({isExpired: true});
      }
  } catch (error) {
      console.error("Erreur lors de la récupération du token de réinitialisation :", error);
      return res.status(500).json({ error: "Erreur lors de la récupération du token de réinitialisation" });
  }
});

// POST route pour réinitialiser le mot de passe
router.post('/reset-password/:token', async (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;
  console.log(token)

  // Appel Axios pour récupérer le token de réinitialisation de mot de passe
  try {
      const response = await axios.get(`${process.env.BDD_API_URL}/reset-password-token/${token}`);
      const resetToken = response.data;

      // Vérifier si le token est valide
      if (resetToken && new Date(resetToken.expiration) > new Date()) {
          const email = resetToken.email;
          const user = (await axios.post(`${process.env.BDD_API_URL}/user/exists`,{email})).data;

          await axios.put(`${process.env.BDD_API_URL}/user/${user.id}`, {
            password: newPassword
          })
          // .then(async()=> {

          //   // Appel Axios pour supprimer le token associé à l'e-mail
          //   await axios.delete(`${process.env.BDD_API_URL}/reset-password-token/${resetToken.id}`);
          // })

          // Répondre à la demande avec un message indiquant que le mot de passe a été réinitialisé
          return res.send("Votre mot de passe a été réinitialisé avec succès.");
      } 
      // else {
      //     // Rediriger vers une page d'erreur si le token est invalide ou expiré
      //     return res.redirect('/erreur');
      // }
  } catch (error) {
      // console.error("Erreur lors de la réinitialisation du mot de passe :", error);
      return res.status(500).json({ error: "Erreur lors de la réinitialisation du mot de passe" });
  }
});
module.exports = router;
