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
app.use('/auth', authRoutes);
app.use('/stock', stockRoutes);
app.use('/purchases', purchaseRoutes);


app.get('/', (req, res) => {
  res.send('API Cafétéria opérationnelle');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
