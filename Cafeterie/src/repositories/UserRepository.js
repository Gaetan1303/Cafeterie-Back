const IRepository = require('./IRepository');
const User = require('../models/User');

/**
 * Repository pour les utilisateurs.
 */
class UserRepository extends IRepository {
  async findAll(filter = {}) {
    return User.find(filter);
  }

  async findById(id) {
    return User.findById(id);
  }

  async findOne(filter) {
    return User.findOne(filter);
  }

  async create(data) {
    return User.create(data);
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  async countDocuments(filter = {}) {
    return User.countDocuments(filter);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }
}

module.exports = UserRepository;
