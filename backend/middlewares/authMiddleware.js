const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format' });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; 
    next();
  });
};
