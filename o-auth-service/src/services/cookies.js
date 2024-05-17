const options =
  process.env.ENV === 'production'
    ? {
        domain: '.lionelkg.com',
        secure: true,
        sameSite: 'none',
      }
    : {secure: true};

module.exports = options;
