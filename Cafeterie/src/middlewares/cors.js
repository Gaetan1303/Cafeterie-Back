// Middleware CORS pour Express
const cors = require('cors');

// Autoriser le front-end 
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://cafeterie-ksqrk3gwd-gaetan1303s-projects.vercel.app',
  'https://cafeterie.vercel.app',
];

const corsOptions = {
  origin: true, // Autorise toutes les origines temporairement
  credentials: true,
};

module.exports = cors(corsOptions);
