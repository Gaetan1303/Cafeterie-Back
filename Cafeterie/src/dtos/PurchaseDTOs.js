/**
 * Data Transfer Objects for Purchase operations
 * Validates and encapsulates input data for purchase-related operations
 */

/**
 * DTO for creating a new purchase
 */
class CreatePurchaseDTO {
  constructor(stockItem, quantity) {
    this.stockItem = stockItem;
    this.quantity = quantity;
  }

  /**
   * Validates the purchase creation DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.stockItem) {
      errors.push('Stock item ID is required');
    } else if (typeof this.stockItem !== 'string') {
      errors.push('Stock item ID must be a valid MongoDB ID string');
    }

    if (this.quantity == null) {
      errors.push('Quantity is required');
    } else if (typeof this.quantity !== 'number' || this.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * DTO for purchase query/pagination parameters
 */
class GetPurchasesQueryDTO {
  constructor(page = 1, limit = 5, userId = null, isAdmin = false) {
    this.page = page;
    this.limit = limit;
    this.userId = userId;
    this.isAdmin = isAdmin;
  }

  /**
   * Validates the purchase query DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    const pageNum = parseInt(this.page);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push('Page must be a positive number');
    }

    const limitNum = parseInt(this.limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 500) {
      errors.push('Limit must be a number between 1 and 500');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Gets normalized pagination parameters
   * @returns {object} { page: number, limit: number }
   */
  getParams() {
    return {
      page: Math.max(1, parseInt(this.page) || 1),
      limit: Math.min(500, Math.max(1, parseInt(this.limit) || 5))
    };
  }

  /**
   * Builds a filter object for purchases based on user role
   * @returns {object} MongoDB filter
   */
  getFilter() {
    if (this.isAdmin) {
      return {}; // Admins see all purchases
    }
    return { user: this.userId }; // Non-admins see only their purchases
  }
}

module.exports = {
  CreatePurchaseDTO,
  GetPurchasesQueryDTO
};
