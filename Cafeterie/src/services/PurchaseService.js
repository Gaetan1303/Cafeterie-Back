const mongoose = require('mongoose');
const StockItem = require('../models/StockItem');
const StockHistory = require('../models/StockHistory');

const PurchaseObserver = require('../utils/PurchaseObserver');
const purchaseObserver = new PurchaseObserver();

/**
 * Service métier pour les achats.
 * Responsabilités :
 * - Créer achat
 * - Décrémentation stock (transaction)
 * - Historique
 * - Lectures d'historique
 * - Notification via Observer
 */
class PurchaseService {
  constructor(purchaseRepository, stockRepository) {
    this.purchaseRepo = purchaseRepository;
    this.stockRepo = stockRepository;
    this.observer = purchaseObserver;
  }
  subscribe(fn) {
    this.observer.subscribe(fn);
  }
  unsubscribe(fn) {
    this.observer.unsubscribe(fn);
  }

  /**
   * Récupère les achats récents (derniers 30 jours) avec pagination.
   */
  async getRecentPurchases(skip = 0, limit = 50) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.purchaseRepo.findPaginated(
      { timestamp: { $gte: thirtyDaysAgo } },
      skip,
      limit
    );
  }

  /**
   * Retourne l'historique d'un utilisateur.
   */
  async getUserPurchases(userId, skip = 0, limit = 50) {
    return this.purchaseRepo.findByUserId(userId, skip, limit);
  }

  /**
   * Retourne tous les achats (admin).
   */
  async getAllPurchases(skip = 0, limit = 50) {
    return this.purchaseRepo.findPaginated({}, skip, limit);
  }

  /**
   * Crée un achat avec décrémentation de stock atomique et historique.
   * Utilise une transaction MongoDB.
   */
  async createPurchase(userId, items) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const purchases = [];
      for (const { type, subtype, quantity } of items) {
        const stockItem = await StockItem.findOneAndUpdate(
          { type, subtype, quantity: { $gte: quantity } },
          { $inc: { quantity: -quantity } },
          { new: true, session }
        );
        if (!stockItem) {
          throw new Error(`Stock insuffisant pour ${type}/${subtype}`);
        }
        const purchase = await this.purchaseRepo.createWithSession(
          {
            user: userId,
            stockItem: stockItem._id,
            quantity,
            timestamp: new Date()
          },
          session
        );
        await StockHistory.create(
          [{
            item: stockItem._id,
            action: 'sortie',
            quantity,
            user: userId,
            reason: 'Achat',
            date: new Date()
          }],
          { session }
        );
        purchases.push(purchase);
        // Notifier l'observer pour chaque achat
        this.observer.notify('create', purchase);
      }
      await session.commitTransaction();
      return purchases;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}

module.exports = PurchaseService;
