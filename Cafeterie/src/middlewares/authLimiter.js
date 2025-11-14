// Middleware de rate limiting pour Express
const rateLimit = require('express-rate-limit');

// Limite : 5 tentatives par 15 minutes par IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Trop de tentatives, réessayez plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = authLimiter;
