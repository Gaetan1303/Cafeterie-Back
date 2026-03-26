/**
 * Machine Service - Business logic for machine operations
 * Handles CRUD, state management, and machine usage
 */

class MachineService {
  constructor(machineRepository) {
    this.repository = machineRepository;
  }

  /**
   * Get all machines with populated consumables
   * @returns {Promise<object[]>} Array of machines
   */
  async getAllMachines() {
    return this.repository.findAllWithConsumables();
  }

  /**
   * Get a specific machine by ID
   * @param {string} id - Machine ID
   * @returns {Promise<object|null>} Machine or null
   */
  async getMachineById(id) {
    return this.repository.findByIdWithConsumables(id);
  }

  /**
   * Get machines by type
   * @param {string} type - Machine type
   * @returns {Promise<object[]>} Array of machines
   */
  async getMachinesByType(type) {
    return this.repository.findByType(type);
  }

  /**
   * Create a new machine
   * @param {object} machineData - { name, type, capacity, unit, consumables, state }
   * @returns {Promise<object>} Created machine
   */
  async createMachine(machineData) {
    return this.repository.create(machineData);
  }

  /**
   * Update machine details
   * @param {string} id - Machine ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object|null>} Updated machine or null
   */
  async updateMachine(id, updates) {
    return this.repository.updateById(id, updates);
  }

  /**
   * Delete a machine
   * @param {string} id - Machine ID
   * @returns {Promise<object|null>} Deleted machine or null
   */
  async deleteMachine(id) {
    return this.repository.deleteById(id);
  }

  /**
   * Use a machine: validate state and capacity, then update lastUsed
   * @param {string} id - Machine ID
   * @param {number} quantity - Number of servings to prepare
   * @returns {Promise<object>} Updated machine
   * @throws {Error} If machine not available or capacity exceeded
   */
  async useMachine(id, quantity) {
    const machine = await this.repository.findByIdWithConsumables(id);
    
    if (!machine) {
      throw new Error('Machine non trouvée');
    }

    if (machine.state !== 'disponible') {
      throw new Error('Machine non disponible');
    }

    if (quantity > machine.capacity) {
      throw new Error('Capacité dépassée');
    }

    // Update lastUsed timestamp
    return this.repository.updateLastUsed(id);
  }

  /**
   * Mark machine as being cleaned
   * @param {string} id - Machine ID
   * @returns {Promise<object|null>} Updated machine or null
   */
  async cleanMachine(id) {
    return this.repository.updateLastCleaned(id);
  }

  /**
   * Set machine state
   * @param {string} id - Machine ID
   * @param {string} state - New state (disponible, en panne, en nettoyage, etc.)
   * @returns {Promise<object|null>} Updated machine or null
   */
  async setMachineState(id, state) {
    return this.repository.updateState(id, state);
  }
}

module.exports = { MachineService };
