const mongoose = require('mongoose');


const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI non défini dans .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 20, // Limite le pool de connexions à 20 (ajustable selon la charge)
      minPoolSize: 2,  // Minimum de connexions maintenues
      socketTimeoutMS: 30000, // Timeout socket
      retryWrites: true, // Active le retry automatique des écritures
      w: 'majority' // Sécurité d'écriture
    });
    console.log('Connexion à MongoDB réussie');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
