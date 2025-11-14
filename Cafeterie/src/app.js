const logError = require('./utils/logError');
require('dotenv').config();

const express = require('express');
const connectDB = require('./utils/db');
const app = express();



// Connexion à la base de données
connectDB();

// Middlewares
app.use(express.json());

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

// Middleware de gestion des erreurs (log + réponse générique)
app.use((err, req, res, next) => {
  logError(err, `URL: ${req.originalUrl}`);
  if (res.headersSent) return next(err);
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
