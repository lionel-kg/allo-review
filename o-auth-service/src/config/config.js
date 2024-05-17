// config.js
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const oidcStrategy = new OpenIDConnectStrategy(
  {
    issuer: 'https://accounts.google.com',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    tokenURL: 'https://oauth2.googleapis.com/token',
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK_URL, // URL de rappel après l'authentification
    userInfoURL: 'https://openidconnect.googleapis.com/v1/userinfo', // URL pour récupérer les informations utilisateur
    scope: 'openid profile email', // Les scopes requis
  },
  (issuer, profile, cb) => {
    return cb(null, profile);
  },
);

const githubStrategy = new GitHubStrategy(
  {
    issuer: 'https://github.com/',
    authorizationURL: 'https://github.com/login/oauth/authorize',
    tokenURL: 'https://github.com/login/oauth/access_token',
    userInfoURL: 'https://api.github.com/user',
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL,
    scope: 'user:email',
  },
  function (accessToken, refreshToken, profile, done) {
    done(null, profile, accessToken);
  },
);

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALL_BACK_URL,
    scope: ['identify', 'email'],
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    return cb(null, profile);
  },
);

passport.use('openid', oidcStrategy);
passport.use('github', githubStrategy);
passport.use('discord', discordStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
