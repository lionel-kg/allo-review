import jwt from 'jsonwebtoken';

export function generateToken(content) {
  return jwt.sign(content, 'secret', {expiresIn: '1h'});
}

export function decode(jwtToken) {
  try {
    const decodedToken = jwt.verify(jwtToken, 'secret');
    return decodedToken;
  } catch (error) {
    console.error('Erreur lors du décodage du token JWT :', error);
    return null;
  }
}
