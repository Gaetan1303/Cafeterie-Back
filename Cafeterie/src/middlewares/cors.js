// Middleware CORS pour Express
const cors = require('cors');

// Autoriser le front-end 
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://cafeterie-ksqrk3gwd-gaetan1303s-projects.vercel.app',
  'https://cafeterie.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (ex: Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
