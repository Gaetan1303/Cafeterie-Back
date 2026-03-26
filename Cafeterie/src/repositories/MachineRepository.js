/**
 * Machine Repository - Data access layer for machines
 * Handles all database operations for Machine model
 */

const IRepository = require('./IRepository');

class MachineRepository extends IRepository {
  constructor(machineModel) {
    super(machineModel);
  }

  /**
   * Find all machines with populated consumables
   * @returns {Promise<object[]>} Array of machines with populated consumables
   */
  async findAllWithConsumables() {
    return this.model.find().populate('consumables.stockRef');
  }

  /**
   * Find machine by ID with populated consumables
   * @param {string} id - Machine ID
   * @returns {Promise<object|null>} Machine with populated consumables or null
   */
  async findByIdWithConsumables(id) {
    return this.model.findById(id).populate('consumables.stockRef');
  }

  /**
   * Find machines by type
   * @param {string} type - Machine type
   * @returns {Promise<object[]>} Array of machines matching type
   */
  async findByType(type) {
    return this.model.find({ type });
  }

  /**
   * Update machine state
   * @param {string} id - Machine ID
   * @param {string} state - New state
   * @returns {Promise<object|null>} Updated machine or null
   */
  async updateState(id, state) {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { state } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update last used timestamp
   * @param {string} id - Machine ID
   * @returns {Promise<object|null>} Updated machine or null
   */
  async updateLastUsed(id) {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { lastUsed: new Date() } },
      { new: true }
    );
  }

  /**
   * Update last cleaned timestamp
   * @param {string} id - Machine ID
   * @returns {Promise<object|null>} Updated machine or null
   */
  async updateLastCleaned(id) {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { lastCleaned: new Date(), state: 'en nettoyage' } },
      { new: true }
    );
  }
}

module.exports = { MachineRepository };
