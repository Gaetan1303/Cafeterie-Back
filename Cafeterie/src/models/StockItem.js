const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
  type: { type: String, enum: [
    'cafe',
    'the',
    'nourriture',
    'jus',
    'viennoiserie',
    'apero',
    'petit-dejeuner',
    'fruit'
  ], required: true },
  subtype: { type: String },
  category: {
    type: String,
    enum: [
      'Boisson chaude',
      'Boisson froide',
      'Viennoiserie',
      'Apéro',
      'Petit déjeuner',
      'Fruits et Légumes'
    ],
    required: true
  },
  quantity: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  lastRestocked: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockItem', stockItemSchema);
