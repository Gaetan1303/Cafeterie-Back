// ConsommableRepository.js
// Repository pour la gestion des consommables
const StockItem = require('../models/StockItem');

class ConsommableRepository {
  async createConsommable(data) {
    return await StockItem.create(data);
  }
}

module.exports = new ConsommableRepository();