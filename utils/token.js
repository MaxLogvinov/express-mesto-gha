const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret';

function generateToken(payload) {
  return jwt.sign({ payload }, SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return false;
  }
}
module.exports = { generateToken, checkToken };
