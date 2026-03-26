const IRepository = require('./IRepository');
const StockItem = require('../models/StockItem');

/**
 * Repository pour la gestion des items de stock.
 * Isolé de Mongoose dans les services métier.
 */
class StockRepository extends IRepository {
  async findAll(filter = {}) {
    return StockItem.find(filter);
  }

  async findById(id) {
    return StockItem.findById(id);
  }

  async findOne(filter) {
    return StockItem.findOne(filter);
  }

  async create(data) {
    return StockItem.create(data);
  }

  async updateById(id, data) {
    return StockItem.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  }

  async upsert(filter, data, setOnInsert = {}) {
    return StockItem.findOneAndUpdate(
      filter,
      { $set: data, $setOnInsert },
      { new: true, upsert: true, runValidators: true }
    );
  }

  async deleteById(id) {
    return StockItem.findByIdAndDelete(id);
  }

  async countDocuments(filter = {}) {
    return StockItem.countDocuments(filter);
  }

  async findPaginated(filter = {}, skip = 0, limit = 50, sort = {}) {
    const items = await StockItem.find(filter).skip(skip).limit(limit).sort(sort);
    const total = await this.countDocuments(filter);
    return { items, total };
  }

  async findByTypeAndSubtype(type, subtype) {
    return StockItem.findOne({ type, subtype });
  }
}

module.exports = StockRepository;
