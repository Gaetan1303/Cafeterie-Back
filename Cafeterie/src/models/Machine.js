const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ex: Cafetière 1
  type: { type: String, enum: ['cafe', 'the'], required: true },
  capacity: { type: Number, required: true }, // nombre de tasses ou volume (en tasses)
  unit: { type: String, enum: ['tasse', 'litre', 'g', 'sachet'], default: 'tasse' },
  state: { type: String, enum: ['Disponible', 'Remplie', 'Eteinte', 'en nettoyage', 'en panne'], default: 'Disponible' },
  lastUsed: { type: Date },
  lastCleaned: { type: Date },
  consumables: [{
    name: String, // ex: Café en poudre, Sachet éléphant
    stockRef: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItem' },
    quantity: Number, // quantité restante pour cette machine
    unit: String // g, sachet, etc.
  }]
});

module.exports = mongoose.model('Machine', machineSchema);
