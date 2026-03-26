/**
 * DTO pour la requête GET stock.
 */
class GetStockQueryDTO {
  constructor(page = 1, limit = 10) {
    this.page = Math.max(1, parseInt(page) || 1);
    this.limit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  }
}

/**
 * DTO pour la requête POST stock (créer un item).
 */
class CreateStockItemDTO {
  constructor(body) {
    const { type, subtype, category, quantity, threshold } = body;
    this.type = type;
    this.subtype = subtype || '';
    this.category = category || 'Autres';
    this.quantity = parseInt(quantity) || 0;
    this.threshold = parseInt(threshold) || 0;
  }

  validate() {
    const errors = [];
    if (!this.type) errors.push('type is required');
    if (this.quantity < 0) errors.push('quantity must be >= 0');
    if (this.threshold < 0) errors.push('threshold must be >= 0');
    return { isValid: errors.length === 0, errors };
  }
}

/**
 * DTO pour la requête POST restock.
 */
class RestockDTO {
  constructor(body) {
    const { type, subtype, quantity } = body;
    this.type = type;
    this.subtype = subtype || '';
    this.quantity = parseInt(quantity) || 0;
  }

  validate() {
    const errors = [];
    if (!this.type) errors.push('type is required');
    if (this.quantity <= 0) errors.push('quantity must be > 0');
    return { isValid: errors.length === 0, errors };
  }
}

module.exports = {
  GetStockQueryDTO,
  CreateStockItemDTO,
  RestockDTO
};
