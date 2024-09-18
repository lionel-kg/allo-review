const options =
  process.env.ENV === 'production'
    ? {
        domain: '.front-faille.lionelkg.com',
        secure: true,
        sameSite: 'none',
      }
    : {secure: true};

module.exports = options;
