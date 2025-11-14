
const express = require('express');
const app = express();

const eventRoutes = require('./routes/event');
const logError = require('./utils/logError');

require('dotenv').config();

// Validation stricte de JWT_SECRET
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  // 32 caractères recommandés pour la sécurité
  console.error('ERREUR CRITIQUE : JWT_SECRET absent ou trop court (min 32 caractères)');
  process.exit(1);
}

const connectDB = require('./utils/db');



// Connexion à la base de données
connectDB();



// Middlewares
const compression = require('compression');
const cors = require('./middlewares/cors');
app.use(compression());
app.use(cors);
app.use(express.json());
app.use('/events', eventRoutes);

// Routes
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stock');
const purchaseRoutes = require('./routes/purchase');
const profileRoutes = require('./routes/profile');


const stockHistoryRoutes = require('./routes/stockHistory');
const consommableRoutes = require('./routes/consommable');
const machineRoutes = require('./routes/machine');

app.use('/auth', authRoutes);
app.use('/stock', stockRoutes);
app.use('/purchases', purchaseRoutes);
app.use('/profile', profileRoutes);
app.use('/stock-history', stockHistoryRoutes);
app.use('/machines', machineRoutes);
app.use('/consommables', consommableRoutes);



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
