const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connexion à MongoDB réussie');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
