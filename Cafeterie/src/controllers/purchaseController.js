// Derniers achats (tous ou par utilisateur)
exports.getRecentPurchases = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }
    const purchases = await Purchase.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('user', 'firstName lastName email');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Historique global (admin)
exports.getAllPurchases = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const purchases = await Purchase.find().sort({ timestamp: -1 }).limit(limit).populate('user', 'firstName lastName email');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
const Purchase = require('../models/Purchase');
const StockItem = require('../models/StockItem');

// Liste des achats de l'utilisateur connecté
exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const purchases = await Purchase.find({ user: userId }).sort({ timestamp: -1 }).limit(limit);
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Enregistrer un achat
exports.createPurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, subtype, quantity } = req.body;
    if (!type || !quantity) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    // Décrémenter le stock
    const stockItem = await StockItem.findOne({ type, subtype });
    if (!stockItem || stockItem.quantity < quantity) {
      return res.status(400).json({ error: 'Stock insuffisant' });
    }
    stockItem.quantity -= quantity;
    await stockItem.save();
    // Enregistrer l'achat
    const purchase = await Purchase.create({ user: userId, type, subtype, quantity });
    res.status(201).json({ message: 'Achat enregistré', purchase });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
