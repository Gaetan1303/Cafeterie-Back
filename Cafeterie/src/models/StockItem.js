const mongoose = require('mongoose');


const stockItemSchema = new mongoose.Schema({
  code: { type: String, index: true, sparse: true },
  name: { type: String },
  brand: { type: String },
  image: { type: String },
  scannedAt: { type: Date },
  source: { type: String, default: 'manual' },
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
    required: true,
    index: true
  },
  quantity: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  lastRestocked: { type: Date, default: Date.now }
});
// Unicité sur type+subtype
stockItemSchema.index({ type: 1, subtype: 1 }, { unique: true });
// Unicité optionnelle sur code-barres pour les produits scannés
stockItemSchema.index({ code: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('StockItem', stockItemSchema);
