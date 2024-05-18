const options =
  process.env.ENV === 'production'
    ? {
        domain: '.lionelkg.com',
        secure: true,
        sameSite: 'none',
      }
    : {secure: true};

export default options;
