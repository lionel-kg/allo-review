const express = require('express');
const router = express.Router();
const passport = require('../config/config.js');
const bcrypt = require('bcrypt');
const {generateToken, decode} = require('../services/jwt.js');
const axios = require('axios');
const options = require('../services/cookies.js');

// Route d'authentification
router.get('/google', passport.authenticate('openid'));
router.get('/github', passport.authenticate('github'));
router.get('/discord', passport.authenticate('discord'));

//callback google
router.get(
  '/openid/callback',
  passport.authenticate('openid', {
    failureRedirect: `${process.env.FRONT_URL}/login`,
  }),
  async (req, res) => {
    try {
      const existingUser = await axios.post(
        process.env.BDD_API_URL + '/user/exists',
        {email: req.user.emails[0].value},
      );

      if (existingUser.data) {
        if (existingUser.data.idGoogle) {
          const payload = {id: req.user.id, email: req.user.emails[0].value};
          const token = generateToken(payload);
          res.cookie('jwt', token, options);
          return res.redirect(`${process.env.FRONT_URL}/movies`);
        } else {
          await axios.put(
            process.env.BDD_API_URL + '/user/' + existingUser.data.id,
            {
              idGoogle: req.user.id,
            },
          );
        }
      } else {
        await axios.post(process.env.BDD_API_URL + '/user/', {
          email: req.user.emails[0].value,
          username: req.user.emails[0].value,
          idGoogle: req.user.id,
          password: '',
        });
      }

      // If user doesn't have idGoogle or it's a new user
      const payload = {id: req.user.id, email: req.user.emails[0].value};
      const token = generateToken(payload);
      res.cookie('jwt', token, options);

      res.redirect(`${process.env.FRONT_URL}/movies`);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'authentification Google :",
        error,
      );
      res.redirect(`${process.env.FRONT_URL}/login`);
    }
  },
);

//callback github
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONT_URL}/login`,
  }),
  async (req, res) => {
    try {
      const existingUser = await axios.post(
        process.env.BDD_API_URL + '/user/exists',
        {email: req.user.emails[0].value},
      );
      console.log(existingUser.data);
      if (existingUser.data) {
        if (existingUser.data.idGithub) {
          const payload = {id: req.user.id, email: req.user.emails[0].value}; // Customize as per your needs
          const token = generateToken(payload);
          res.cookie('jwt', token, options);
          return res.redirect(`${process.env.FRONT_URL}/movies`);
        } else {
          axios.put(process.env.BDD_API_URL + '/user/' + existingUser.data.id, {
            idGithub: req.user.id,
          });
        }
      } else {
        axios.post(process.env.BDD_API_URL + '/user/', {
          email: req.user.emails[0].value,
          username: req.user.emails[0].value,
          idGithub: req.user.id,
          password: '',
        });
      }
      const payload = {id: req.user.id, email: req.user.emails[0].value}; // Customize as per your needs
      const token = generateToken(payload);
      res.cookie('jwt', token, options);
      res.redirect(`${process.env.FRONT_URL}/movies`);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'authentification Google :",
        error,
      );
      res.redirect(`${process.env.FRONT_URL}/login`); // Redirection en cas d'erreur
    }
  },
);

//callback linkedin
router.get(
  '/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: `${process.env.FRONT_URL}/login`,
  }),
  async (req, res) => {
    try {
      console.log(req.user);
      const existingUser = await axios.post(
        process.env.BDD_API_URL + '/user/exists',
        {email: req.user.email},
      );
      console.log(existingUser);
      if (existingUser.data) {
        if (existingUser.data.idDiscord) {
          const payload = {id: req.user.id, email: req.user.email}; // Customize as per your needs
          const token = generateToken(payload);
          res.cookie('jwt', token, options);
          return res.redirect(`${process.env.FRONT_URL}/movies`);
        } else {
          axios.put(process.env.BDD_API_URL + '/user/' + existingUser.data.id, {
            idDiscord: req.user.id,
          });
        }
      } else {
        axios.post(process.env.BDD_API_URL + '/user/', {
          email: req.user.email,
          username: req.user.username,
          idDiscord: req.user.id,
          password: '',
        });
      }
      const payload = {id: req.user.id, email: req.user.email}; // Customize as per your needs
      const token = generateToken(payload);
      res.cookie('jwt', token, options);
      // Redirection vers la page de succès après l'authentification réussie
      res.redirect(`${process.env.FRONT_URL}/movies`);
    } catch (error) {
      console.error(
        "Erreur lors de la gestion de l'authentification Google :",
        error,
      );
      res.redirect(`${process.env.FRONT_URL}/login`); // Redirection en cas d'erreur
    }
  },
);

// getuser
router.get(
  '/user',

  async (req, res) => {
    try {
      let email;
      // Vérifier si l'utilisateur est authentifié et récupérer l'adresse e-mail
      // console.log(req.user);
      if (req.user) {
        email = req.user.emails[0].value;
      } else if (req.headers['authorization']) {
        // Si l'utilisateur n'est pas authentifié, récupérer l'adresse e-mail à partir du token JWT dans l'en-tête Authorization
        const token = req.headers['authorization'].replace('Bearer ', ''); // Ignorer "Bearer" et récupérer uniquement le token
        console.log('token ', token);
        const decodedToken = decode(token);
        console.log(decodedToken);
        if (!decodedToken || !decodedToken.email) {
          throw new Error(
            "Token JWT invalide ou manquant de l'adresse e-mail.",
          );
        }
        email = decodedToken.email;
      } else {
        throw new Error("Aucune information d'authentification trouvée.");
      }
      console.log(email);
      // Recherche de l'utilisateur dans la base de données en utilisant l'adresse e-mail
      const user = await axios.post(process.env.BDD_API_URL + '/user/exists', {
        email: email,
      });

      if (!user.data) {
        throw new Error('Utilisateur non trouvé.');
      }

      res.status(200).json({user: user.data});
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des informations utilisateur :',
        error,
      );
      res.status(500).json({error: error.message});
    }
  },
);

//manual login
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await axios.post(process.env.BDD_API_URL + '/user/exists', {
      email: email,
    });
    console.log(email, user.data.email);

    if (!user.data) {
      return res.status(404).json({message: "Nom d'utilisateur incorrect."});
    }

    const passwordMatch = await bcrypt.compare(password, user.data.password);
    if (!passwordMatch) {
      return res.status(401).json({message: 'Mot de passe incorrect.'});
    }

    const token = generateToken({id: user.data.id, email: user.data.email});
    res.status(200).json({token: token});
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res
      .status(500)
      .json({message: 'Une erreur est survenue lors de la connexion.'});
  }
});

//manual login
router.post('/register', async (req, res) => {
  const {username, email, password} = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await axios.post(
      process.env.BDD_API_URL + '/user/exists',
      {
        email: email,
      },
    );

    // Si l'utilisateur existe déjà, renvoyer un message d'erreur
    if (existingUser.data) {
      return res
        .status(400)
        .json({message: "Nom d'utilisateur ou email déjà utilisé."});
    }
    console.log(password);
    // Hasher le mot de passe avant de l'enregistrer dans la base de données

    // Créer un nouvel utilisateur dans la base de données
    const newUser = await axios.post(process.env.BDD_API_URL + '/user/', {
      username: username,
      email: email,
      password: password,
    });

    const token = generateToken({
      id: newUser.data.id,
      email: newUser.data.email,
    });
    res.status(200).json({token: token});
    // Renvoyer la réponse avec le nouvel utilisateur créé
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res
      .status(500)
      .json({message: "Une erreur est survenue lors de l'inscription."});
  }
});

// Logout
router.get('/logout', function (req, res) {
  req.logOut(function (err) {
    // Provide a callback function here
    if (err) {
      // Handle error if needed
      console.error(err);
    }

    res.clearCookie('jwt', options);
    res.send('logout'); // Remove the leading slash before 'http'
  });
});

//reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const {email} = req.body;

    // Vérifier si l'email existe dans votre système et récupérer l'utilisateur
    const user = await axios.post(process.env.BDD_API_URL + '/user/exists', {
      email: email,
    });

    if (!user.data) {
      // L'email n'existe pas dans votre système
      return res.status(404).json({error: 'Utilisateur introuvable.'});
    }

    // Générer un mot de passe aléatoire
    const randomPassword = 'test123';

    // Hasher le mot de passe aléatoire

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    await axios.put(process.env.BDD_API_URL + '/user/' + user.data.id, {
      password: randomPassword,
    });

    const response = await axios.post(
      process.env.MAIL_SMS_API_URL + '/mail/reset-mail',
      {
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Votre mot de passe a été réinitialisé avec succès. Votre nouveau mot de passe est: ${randomPassword}`,
      },
    );
    // Envoyer l'email avec le nouveau mot de passe à l'utilisateur

    return res.status(200).json({
      message:
        'Mot de passe réinitialisé avec succès. Vérifiez votre boîte de réception pour le nouveau mot de passe.',
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return res
      .status(500)
      .json({error: 'Erreur lors de la réinitialisation du mot de passe.'});
  }
});
module.exports = router;
