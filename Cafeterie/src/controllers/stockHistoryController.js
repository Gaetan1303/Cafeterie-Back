/**
 * Retourne les statistiques croisées du tableau de bord de l'historique de stock.
 * Agrège par consommateur, opérateur, catégorie et type via plusieurs pipelines MongoDB.
 *
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse avec { global, byUser, byAuteur, byCategory }
 * @returns {void} 200 avec les statistiques agrégées (admin uniquement)
 */
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
          localField: 'auteur',
          foreignField: '_id',
          as: 'auteurInfo'
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
  { $unwind: { path: '$auteurInfo', preserveNullAndEmptyArrays: true } },
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
    const byAuteur = await StockHistory.aggregate([
      ...pipeline,
      { $match: { auteur: { $ne: null } } },
      {
        $group: {
          _id: { auteur: "$auteur", action: "$action", type: "$itemInfo.type", category: "$itemInfo.category" },
          auteurInfo: { $first: "$auteurInfo" },
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
      byAuteur,
      byCategory
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};
const StockHistory = require('../models/StockHistory');
const StockItem = require('../models/StockItem');

/**
 * Crée une entrée dans l'historique de stock.
 * Fonction utilitaire appelée par d'autres contrôleurs (restock, createPurchase, etc.).
 *
 * @param {object} params - Paramètres du mouvement
 * @param {string} params.itemId - ID de l'item de stock
 * @param {string} params.action - Type d'action ('entrée' | 'sortie' | 'nettoyage' | 'préparation')
 * @param {number} params.quantity - Quantité impliquée
 * @param {string} [params.userId] - ID de l'utilisateur consommateur
 * @param {string} [params.auteurId] - ID de l'opérateur (admin/machine)
 * @param {string} [params.reason] - Motif de l'opération
 * @returns {Promise<void>}
 */
exports.logStockMovement = async ({ itemId, action, quantity, userId, auteurId, reason }) => {
  await StockHistory.create({
    item: itemId,
    action,
    quantity,
    user: userId,
    auteur: auteurId,
    reason
  });
};

/**
 * Retourne l'historique complet d'un item de stock trié par date décroissante.
 *
 * @param {import('express').Request} req - Requête avec req.params.id (ID de l'item)
 * @param {import('express').Response} res - Réponse avec la liste des mouvements peuplés
 * @returns {void} 200 avec l'historique de l'item
 */
exports.getItemHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await StockHistory.find({ item: id })
      .sort({ date: -1 })
      .populate('user', 'firstName lastName email')
      .populate('auteur', 'firstName lastName email');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Retourne l'historique global de tous les mouvements de stock, trié par date décroissante.
 *
 * @param {import('express').Request} req - Requête Express
 * @param {import('express').Response} res - Réponse avec tous les mouvements peuplés (item, user, auteur)
 * @returns {void} 200 avec l'historique complet
 */
exports.getAllHistory = async (req, res) => {
  try {
    const history = await StockHistory.find()
      .sort({ date: -1 })
      .populate('item')
      .populate('user', 'firstName lastName email')
      .populate('auteur', 'firstName lastName email');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
