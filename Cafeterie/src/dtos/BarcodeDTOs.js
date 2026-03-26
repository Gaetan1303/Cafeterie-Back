/**
 * Data Transfer Objects for Barcode operations
 * Validates and encapsulates input data for barcode scanning and listing
 */

/**
 * DTO for barcode scanning validation
 */
class ScanBarcodeDTO {
  constructor(barcode) {
    this.barcode = barcode;
  }

  /**
   * Validates the barcode DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.barcode) {
      errors.push('Barcode is required');
    } else if (typeof this.barcode !== 'string') {
      errors.push('Barcode must be a string');
    } else if (this.barcode.trim().length === 0) {
      errors.push('Barcode cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * DTO for barcode list query validation
 */
class ListScannedDTO {
  constructor(sortBy = 'scannedAt', order = 'desc') {
    this.sortBy = sortBy;
    this.order = order;
  }

  /**
   * Validates the list query DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];
    const validSortFields = ['name', 'brand', 'category', 'type', 'scannedAt'];
    const validOrders = ['asc', 'desc'];

    if (!validSortFields.includes(this.sortBy)) {
      errors.push(`sortBy must be one of: ${validSortFields.join(', ')}`);
    }

    if (!validOrders.includes(this.order)) {
      errors.push('order must be "asc" or "desc"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * DTO for product scan by photo payload validation
 */
class ScanPhotoDTO {
  constructor({ imageBase64, productName, brand, category, type, quantity } = {}) {
    this.imageBase64 = imageBase64;
    this.productName = productName;
    this.brand = brand;
    this.category = category;
    this.type = type;
    this.quantity = quantity;
  }

  /**
   * Validates the photo payload DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];
    const validTypes = [
      'cafe',
      'the',
      'nourriture',
      'jus',
      'viennoiserie',
      'apero',
      'petit-dejeuner',
      'fruit'
    ];

    if (!this.imageBase64 || typeof this.imageBase64 !== 'string') {
      errors.push('imageBase64 is required and must be a string');
    } else {
      const isDataUri = this.imageBase64.startsWith('data:image/');
      if (!isDataUri) {
        errors.push('imageBase64 must be a valid image data URI');
      }
      const maxSizeBytes = 5 * 1024 * 1024;
      const rawBase64 = this.imageBase64.split(',')[1] || '';
      const approxSizeBytes = Math.floor((rawBase64.length * 3) / 4);
      if (approxSizeBytes > maxSizeBytes) {
        errors.push('imageBase64 exceeds max size of 5MB');
      }
    }

    if (this.type && !validTypes.includes(this.type)) {
      errors.push(`type must be one of: ${validTypes.join(', ')}`);
    }

    if (this.quantity !== undefined) {
      const parsed = Number(this.quantity);
      if (!Number.isFinite(parsed) || parsed < 0) {
        errors.push('quantity must be a positive number or 0');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = {
  ScanBarcodeDTO,
  ListScannedDTO,
  ScanPhotoDTO
};
