const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItem', required: true },
  action: { type: String, enum: ['entrée', 'sortie', 'nettoyage', 'préparation'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // qui consomme (ex: acheteur)
  Auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // qui opère (ex: nettoyeur, préparateur)
  reason: { type: String },
});

module.exports = mongoose.model('StockHistory', stockHistorySchema);
