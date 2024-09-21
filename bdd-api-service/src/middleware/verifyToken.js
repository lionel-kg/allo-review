const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, 'secret', (error, authData) => {
      if (error) {
        res.sendStatus(403);
      } else {
        req.userToken = authData;
        next();
      }
    });
  }
}

module.exports = verifyToken;
