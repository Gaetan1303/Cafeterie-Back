// Dashboard croisé : stats par consommateur, opérateur, catégorie, type, etc.
exports.getDashboardStats = async (req, res) => {
  try {
    // Statistiques globales
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'operator',
          foreignField: '_id',
          as: 'operatorInfo'
        }
      },
      {
        $lookup: {
          from: 'stockitems',
          localField: 'item',
          foreignField: '_id',
          as: 'itemInfo'
        }
      },
      { $unwind: { path: '$itemInfo', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$operatorInfo', preserveNullAndEmptyArrays: true } },
    ];

    const all = await StockHistory.aggregate([
      ...pipeline,
      {
        $group: {
          _id: null,
          totalSorties: { $sum: { $cond: [{ $eq: ["$action", "sortie"] }, "$quantity", 0] } },
          totalEntrees: { $sum: { $cond: [{ $eq: ["$action", "entrée"] }, "$quantity", 0] } },
          totalNettoyages: { $sum: { $cond: [{ $eq: ["$action", "nettoyage"] }, 1, 0] } },
          totalPreparations: { $sum: { $cond: [{ $eq: ["$action", "préparation"] }, 1, 0] } },
        }
      }
    ]);

    // Par utilisateur (consommateur)
    const byUser = await StockHistory.aggregate([
      ...pipeline,
      { $match: { user: { $ne: null } } },
      {
        $group: {
          _id: { user: "$user", type: "$itemInfo.type", category: "$itemInfo.category" },
          userInfo: { $first: "$userInfo" },
          totalSorties: { $sum: { $cond: [{ $eq: ["$action", "sortie"] }, "$quantity", 0] } },
          totalAchats: { $sum: { $cond: [{ $eq: ["$action", "sortie"] }, 1, 0] } },
        }
      },
      { $sort: { "totalSorties": -1 } }
    ]);

    // Par opérateur (nettoyage/préparation)
    const byOperator = await StockHistory.aggregate([
      ...pipeline,
      { $match: { operator: { $ne: null } } },
      {
        $group: {
          _id: { operator: "$operator", action: "$action", type: "$itemInfo.type", category: "$itemInfo.category" },
          operatorInfo: { $first: "$operatorInfo" },
          totalActions: { $sum: 1 },
          totalQuantite: { $sum: "$quantity" }
        }
      },
      { $sort: { "totalActions": -1 } }
    ]);

    // Par catégorie/type
    const byCategory = await StockHistory.aggregate([
      ...pipeline,
      {
        $group: {
          _id: { type: "$itemInfo.type", category: "$itemInfo.category", action: "$action" },
          total: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.category": 1, "_id.type": 1 } }
    ]);

    res.json({
      global: all[0] || {},
      byUser,
      byOperator,
      byCategory
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};
const StockHistory = require('../models/StockHistory');
const StockItem = require('../models/StockItem');

// Créer une entrée dans l'historique de stock
exports.logStockMovement = async ({ itemId, action, quantity, userId, operatorId, reason }) => {
  await StockHistory.create({
    item: itemId,
    action,
    quantity,
    user: userId,
    operator: operatorId,
    reason
  });
};

// Récupérer l'historique d'un item
exports.getItemHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await StockHistory.find({ item: id })
      .sort({ date: -1 })
      .populate('user', 'firstName lastName email')
      .populate('operator', 'firstName lastName email');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer l'historique global
exports.getAllHistory = async (req, res) => {
  try {
    const history = await StockHistory.find()
      .sort({ date: -1 })
      .populate('item')
      .populate('user', 'firstName lastName email')
      .populate('operator', 'firstName lastName email');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
