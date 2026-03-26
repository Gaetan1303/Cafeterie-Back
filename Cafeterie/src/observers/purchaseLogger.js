// Logger observer pour les achats
const fs = require('fs');
const path = require('path');
const PurchaseService = require('../services/PurchaseService');
const PurchaseRepository = require('../repositories/PurchaseRepository');
const StockRepository = require('../repositories/StockRepository');

const purchaseRepository = new PurchaseRepository();
const stockRepository = new StockRepository();
const purchaseService = new PurchaseService(purchaseRepository, stockRepository);

function logPurchase(event, data) {
  if (event === 'create') {
    const logLine = `[${new Date().toISOString()}] Création achat: ${JSON.stringify(data)}\n`;
    fs.appendFileSync(path.join(__dirname, 'purchase.log'), logLine);
  }
}

purchaseService.subscribe(logPurchase);