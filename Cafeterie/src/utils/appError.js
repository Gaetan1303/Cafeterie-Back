// Définition d'erreurs applicatives structurées
class AppError extends Error {
  constructor(message, code = 'ERR_GENERIC', status = 500, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Erreurs métier courantes
const ERRORS = {
  STOCK_INSUFFICIENT: {
    code: 'ERR_STOCK_INSUFFICIENT',
    status: 400,
    message: 'Stock insuffisant pour réaliser l’opération.'
  },
  // ...autres erreurs à ajouter ici
};

module.exports = { AppError, ERRORS };
