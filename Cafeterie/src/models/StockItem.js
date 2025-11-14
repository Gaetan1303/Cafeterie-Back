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
  ], required: true, index: true },
  subtype: { type: String, index: true },
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
    required: true,
    index: true
  },
  quantity: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  lastRestocked: { type: Date, default: Date.now }
});
// Unicité sur type+subtype
stockItemSchema.index({ type: 1, subtype: 1 }, { unique: true });

module.exports = mongoose.model('StockItem', stockItemSchema);
