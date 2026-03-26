
require('dotenv').config();
// Chargement des observers (pattern Observer)
require('./observers');

const express = require('express');
const path = require('path');
const app = express();
const logError = require('./utils/logError');
const connectDB = require('./utils/db');
const compression = require('compression');
const cors = require('./middlewares/cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Pour corriger l'erreur X-Forwarded-For avec express-rate-limit sur Render ou tout proxy
app.set('trust proxy', 1);

// Validation stricte de JWT_SECRET
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('ERREUR CRITIQUE : JWT_SECRET absent ou trop court (min 32 caractères)');
  process.exit(1);
}

// Charger la configuration des types (config/types.json)
const { loadTypeConfig } = require('./config/loader');
loadTypeConfig();

// Connexion à la base de données
connectDB();

// Middlewares globaux
app.use(compression());
app.use(cors);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Configuration Swagger ---
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Cafeterie',
    version: '1.0.0',
    description: 'Documentation complète de l\'API Cafeterie — toutes les routes exposées',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Développement local' },
  ],
  components: {
    securitySchemes: {
      // Schéma de sécurité JWT Bearer utilisé sur toutes les routes protégées
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  // Scan de tous les fichiers de routes pour les annotations @swagger
  apis: [`${__dirname}/routes/*.js`],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stock');
const purchaseRoutes = require('./routes/purchase');
const profileRoutes = require('./routes/profile');
const eventRoutes = require('./routes/event');
const stockHistoryRoutes = require('./routes/stockHistory');
const consommableRoutes = require('./routes/consommable');
const machineRoutes = require('./routes/machine');
const barcodeRoutes = require('./routes/barcode');

app.use('/auth', authRoutes);
app.use('/stock', stockRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/profile', profileRoutes);
app.use('/events', eventRoutes);
app.use('/stock-history', stockHistoryRoutes);
app.use('/machines', machineRoutes);
app.use('/consommables', consommableRoutes);
app.use('/barcode', barcodeRoutes);

app.get('/', (req, res) => {
  res.send('API Cafétéria opérationnelle');
});

// Middleware de gestion des erreurs (structuré)
app.use((err, req, res, next) => {
  logError(err, `URL: ${req.originalUrl}`);
  if (res.headersSent) return next(err);
  // Si erreur structurée (AppError)
  if (err.code && err.status) {
    return res.status(err.status).json({
      error: err.message,
      code: err.code,
      details: err.details || undefined
    });
  }
  // Sinon, erreur générique
  res.status(500).json({ error: 'Erreur serveur, voir logs.' });
});

// Redirection 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ressource non trouvée' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
