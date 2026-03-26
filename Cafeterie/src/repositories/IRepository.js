/**
 * Interface abstraite pour les repositories.
 * Tous les repositories doivent implémenter ces méthodes.
 */
class IRepository {
  async findAll() {
    throw new Error('findAll() not implemented');
  }

  async findById(id) {
    throw new Error('findById() not implemented');
  }

  async create(data) {
    throw new Error('create() not implemented');
  }

  async updateById(id, data) {
    throw new Error('updateById() not implemented');
  }

  async deleteById(id) {
    throw new Error('deleteById() not implemented');
  }

  async findOne(filter) {
    throw new Error('findOne() not implemented');
  }

  async countDocuments(filter = {}) {
    throw new Error('countDocuments() not implemented');
  }
}

module.exports = IRepository;
