const IRepository = require('./IRepository');
const Purchase = require('../models/Purchase');

/**
 * Repository pour les achats.
 */
class PurchaseRepository extends IRepository {
  async findAll(filter = {}) {
    return Purchase.find(filter);
  }

  async findById(id) {
    return Purchase.findById(id);
  }

  async findOne(filter) {
    return Purchase.findOne(filter);
  }

  async create(data) {
    return Purchase.create(data);
  }

  async updateById(id, data) {
    return Purchase.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async deleteById(id) {
    return Purchase.findByIdAndDelete(id);
  }

  async countDocuments(filter = {}) {
    return Purchase.countDocuments(filter);
  }

  async findPaginated(filter = {}, skip = 0, limit = 50, sort = { timestamp: -1 }) {
    const items = await Purchase.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate('user', 'firstName lastName email');
    const total = await this.countDocuments(filter);
    return { items, total };
  }

  async findByUserId(userId, skip = 0, limit = 50) {
    return this.findPaginated({ user: userId }, skip, limit);
  }

  async createWithSession(data, session) {
    return Purchase.create([data], { session }).then(docs => docs[0]);
  }
}

module.exports = PurchaseRepository;
