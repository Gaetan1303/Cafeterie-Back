// consommableLogger.js
// Exemple d'observer : log chaque création de consommable
const fs = require('fs');
const path = require('path');
const consommableService = require('../services/ConsommableService');

function logConsommable(event, data) {
  if (event === 'create') {
    const logLine = `[${new Date().toISOString()}] Création consommable: ${JSON.stringify(data)}\n`;
    fs.appendFileSync(path.join(__dirname, 'consommable.log'), logLine);
  }
}

consommableService.subscribe(logConsommable);
