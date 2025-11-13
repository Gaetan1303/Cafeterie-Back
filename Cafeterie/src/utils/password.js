// Utilitaires pour le hash de mot de passe
const bcrypt = require('bcrypt');

module.exports = {
  hashPassword: async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },
  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  }
};
