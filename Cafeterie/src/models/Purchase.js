const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['cafe', 'the', 'nourriture'], required: true },
  subtype: { type: String },
  category: { type: String, enum: ['boisson', 'nourriture'], required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
