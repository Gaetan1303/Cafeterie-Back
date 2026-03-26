/**
 * Data Transfer Objects for Machine operations
 * Validates and encapsulates machine input data
 */

/**
 * DTO for creating a machine
 */
class CreateMachineDTO {
  constructor(name, type, capacity, unit, consumables = []) {
    this.name = name;
    this.type = type;
    this.capacity = capacity;
    this.unit = unit;
    this.consumables = consumables;
  }

  /**
   * Validates machine creation DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
      errors.push('Machine name is required and must be a non-empty string');
    }

    if (!this.type || typeof this.type !== 'string' || this.type.trim().length === 0) {
      errors.push('Machine type is required and must be a non-empty string');
    }

    if (this.capacity == null || typeof this.capacity !== 'number' || this.capacity <= 0) {
      errors.push('Capacity must be a positive number');
    }

    if (!this.unit || typeof this.unit !== 'string' || this.unit.trim().length === 0) {
      errors.push('Unit is required (e.g., "tasses", "portions")');
    }

    if (this.consumables && !Array.isArray(this.consumables)) {
      errors.push('Consumables must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * DTO for using a machine (preparing servings)
 */
class UseMachineDTO {
  constructor(quantity, auteurId) {
    this.quantity = quantity;
    this.auteurId = auteurId;
  }

  /**
   * Validates machine usage DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (this.quantity == null || typeof this.quantity !== 'number' || this.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }

    if (!this.auteurId || typeof this.auteurId !== 'string') {
      errors.push('Operator ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * DTO for setting machine state
 */
class SetMachineStateDTO {
  constructor(state) {
    this.state = state;
  }

  /**
   * Validates machine state DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];
    const validStates = ['disponible', 'en panne', 'en nettoyage', 'maintenance'];

    if (!this.state || typeof this.state !== 'string') {
      errors.push('State is required and must be a string');
    } else if (!validStates.includes(this.state)) {
      errors.push(`State must be one of: ${validStates.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * DTO for updating machine details
 */
class UpdateMachineDTO {
  constructor(data = {}) {
    this.data = data;
  }

  /**
   * Validates machine update DTO (permissive - allows partial updates)
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];
    const allowedFields = ['name', 'type', 'capacity', 'unit', 'state', 'consumables'];

    // Check if at least one field is provided
    if (Object.keys(this.data).length === 0) {
      errors.push('At least one field must be provided for update');
    }

    // Validate individual fields if provided
    if (this.data.capacity !== undefined) {
      if (typeof this.data.capacity !== 'number' || this.data.capacity <= 0) {
        errors.push('Capacity must be a positive number');
      }
    }

    if (this.data.state !== undefined) {
      const validStates = ['disponible', 'en panne', 'en nettoyage', 'maintenance'];
      if (!validStates.includes(this.data.state)) {
        errors.push(`State must be one of: ${validStates.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = {
  CreateMachineDTO,
  UseMachineDTO,
  SetMachineStateDTO,
  UpdateMachineDTO
};
