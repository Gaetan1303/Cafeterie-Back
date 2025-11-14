const mongoose = require('mongoose');



const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stockItem: { type: mongoose.Schema.Types.ObjectId, ref: 'StockItem', required: true, index: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
