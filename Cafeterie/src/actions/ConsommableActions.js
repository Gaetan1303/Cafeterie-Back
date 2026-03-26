// ConsommableActions.js (ex-UseCases)
const consommableService = require('../services/ConsommableService');

async function createConsommableAction(dto, user) {
  if (!user || (user.role !== 'admin' && user.role !== 'user')) {
    const err = new Error('Accès réservé aux administrateurs ou utilisateurs');
    err.statusCode = 403;
    throw err;
  }
  return await consommableService.createConsommable(dto);
}

module.exports = { createConsommableAction };