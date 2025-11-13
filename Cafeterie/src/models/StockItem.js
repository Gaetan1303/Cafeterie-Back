const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['cafe', 'the', 'nourriture'], required: true },
  subtype: { type: String },
  quantity: { type: Number, required: true },
  threshold: { type: Number, default: 0 },
  lastRestocked: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockItem', stockItemSchema);
