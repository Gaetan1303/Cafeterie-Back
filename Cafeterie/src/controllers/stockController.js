const StockItem = require('../models/StockItem');

// Obtenir le stock actuel
exports.getStock = async (req, res) => {
  try {
    const stock = await StockItem.find();
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Réapprovisionnement (admin)
exports.restock = async (req, res) => {
  try {
    const { type, subtype, quantity } = req.body;
    if (!type || !quantity) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    let item = await StockItem.findOne({ type, subtype });
    if (!item) {
      item = await StockItem.create({ type, subtype, quantity, lastRestocked: new Date() });
    } else {
      item.quantity += quantity;
      item.lastRestocked = new Date();
      await item.save();
    }
    res.json({ message: 'Stock réapprovisionné', item });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
