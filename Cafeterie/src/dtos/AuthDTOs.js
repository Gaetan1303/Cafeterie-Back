/**
 * Data Transfer Objects for Authentication
 * Validates and encapsulates auth input data
 */

/**
 * DTO for user registration
 */
class RegisterDTO {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  /**
   * Validates registration DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.firstName || typeof this.firstName !== 'string' || this.firstName.trim().length === 0) {
      errors.push('First name is required and must be a non-empty string');
    }

    if (!this.lastName || typeof this.lastName !== 'string' || this.lastName.trim().length === 0) {
      errors.push('Last name is required and must be a non-empty string');
    }

    if (!this.email || typeof this.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!this._isValidEmail(this.email)) {
      errors.push('Email format is invalid');
    }

    if (!this.password || typeof this.password !== 'string') {
      errors.push('Password is required and must be a string');
    } else if (this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates email format
   * @param {string} email
   * @returns {boolean}
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * DTO for user login
 */
class LoginDTO {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  /**
   * Validates login DTO
   * @returns {object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    if (!this.email || typeof this.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!this._isValidEmail(this.email)) {
      errors.push('Email format is invalid');
    }

    if (!this.password || typeof this.password !== 'string') {
      errors.push('Password is required and must be a string');
    } else if (this.password.length === 0) {
      errors.push('Password cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates email format
   * @param {string} email
   * @returns {boolean}
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = {
  RegisterDTO,
  LoginDTO
};
