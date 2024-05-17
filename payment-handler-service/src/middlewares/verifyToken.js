const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.replace('Bearer ', '');
    req.token = token;

    jwt.verify(req.token, 'secret', (error, authData) => {
      if (error) {
        res.sendStatus(403);
      } else {
        req.userToken = authData;
        next();
      }
    });
  } else {
    // 401 Unauthorized
    res.sendStatus(401);
  }
}

module.exports = verifyToken;
