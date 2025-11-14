// Derniers achats (tous ou par utilisateur) avec pagination
exports.getRecentPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }
    const purchases = await Purchase.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select('stockItem quantity timestamp user')
      .populate('user', 'firstName lastName email')
      .populate('stockItem', 'type subtype category');
    const total = await Purchase.countDocuments(filter);
    res.json({
      data: purchases,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Historique global (admin) avec pagination
exports.getAllPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const purchases = await Purchase.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select('stockItem quantity timestamp user')
      .populate('user', 'firstName lastName email')
      .populate('stockItem', 'type subtype category');
    const total = await Purchase.countDocuments();
    res.json({
      data: purchases,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
const Purchase = require('../models/Purchase');
const StockItem = require('../models/StockItem');
const StockHistory = require('../models/StockHistory');

// Liste des achats de l'utilisateur connecté avec pagination
exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const purchases = await Purchase.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select('stockItem quantity timestamp')
      .populate('stockItem', 'type subtype category');
    const total = await Purchase.countDocuments({ user: userId });
    res.json({
      data: purchases,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Enregistrer un achat
const { AppError, ERRORS } = require('../utils/appError');
const mongoose = require('mongoose');
exports.createPurchase = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.id;
    const { stockItem: stockItemId, quantity } = req.body;
    if (!stockItemId || !quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    // Décrémenter le stock de façon atomique (anti-race condition)
    const stockItem = await StockItem.findOneAndUpdate(
      { _id: stockItemId, quantity: { $gte: quantity } },
      { $inc: { quantity: -quantity } },
      { new: true, session }
    );
    if (!stockItem) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError(ERRORS.STOCK_INSUFFICIENT.message, ERRORS.STOCK_INSUFFICIENT.code, ERRORS.STOCK_INSUFFICIENT.status));
    }
    // Enregistrer l'achat
    const purchase = await Purchase.create([{ user: userId, stockItem: stockItemId, quantity }], { session });
    // Log mouvement de stock (sortie)
    await StockHistory.create([{
      item: stockItem._id,
      action: 'sortie',
      quantity,
      user: userId,
      reason: 'Achat'
    }], { session });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: 'Achat enregistré', purchase: purchase[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
