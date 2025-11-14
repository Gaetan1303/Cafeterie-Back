// Statistiques globales sur le stock
exports.getStockStats = async (req, res) => {
  try {
    const stock = await StockItem.find();
    let totalItems = stock.length;
    let totalQuantity = stock.reduce((sum, item) => sum + (item.quantity || 0), 0);
    let totalCups = stock.reduce((sum, item) => sum + (estimateCups(item) || 0), 0);
    let alerts = stock.filter(item => item.threshold != null && item.quantity <= item.threshold).length;
    res.json({ totalItems, totalQuantity, totalCups, alerts });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Items en alerte de stock bas
exports.getStockAlerts = async (req, res) => {
  try {
    const stock = await StockItem.find();
    const alerts = stock.filter(item => item.threshold != null && item.quantity <= item.threshold)
      .map(item => {
        const cups = estimateCups(item);
        return {
          ...item.toObject(),
          cupsEstimate: cups,
          alertLowStock: true
        };
      });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Créer un nouvel item de stock
exports.createStockItem = async (req, res) => {
  try {
    const { type, subtype, quantity, threshold } = req.body;
    if (!type || quantity == null) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    const exists = await StockItem.findOne({ type, subtype });
    if (exists) {
      return res.status(409).json({ error: 'Cet item existe déjà' });
    }
    const item = await StockItem.create({ type, subtype, quantity, threshold });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Lire un item de stock par ID
exports.getStockItem = async (req, res) => {
  try {
    const item = await StockItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un item de stock
exports.updateStockItem = async (req, res) => {
  try {
    const { quantity, threshold } = req.body;
    const item = await StockItem.findByIdAndUpdate(
      req.params.id,
      { $set: { quantity, threshold } },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un item de stock
exports.deleteStockItem = async (req, res) => {
  try {
    const item = await StockItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item non trouvé' });
    res.json({ message: 'Item supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
const StockItem = require('../models/StockItem');

// Obtenir le stock actuel

// Estimation tasses par paquet (exemple : 1 café = 20 tasses, 1 thé = 40 tasses)
function estimateCups(item) {
  if (item.type === 'cafe') return item.quantity * 20;
  if (item.type === 'the') return item.quantity * 40;
  return null;
}

exports.getStock = async (req, res) => {
  try {
    const stock = await StockItem.find();
    const stockWithEstimation = stock.map(item => {
      const cups = estimateCups(item);
      const alert = item.threshold != null && item.quantity <= item.threshold;
      return {
        ...item.toObject(),
        cupsEstimate: cups,
        alertLowStock: alert
      };
    });
    res.json(stockWithEstimation);
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
