class UpdateProfileDTO { constructor(firstName, lastName, email) { this.firstName = firstName; this.lastName = lastName; this.email = email; }
validate() { const errors = []; if (!this.firstName || typeof this.firstName !== 'string') errors.push('First name required'); if (!this.lastName || typeof this.lastName !== 'string') errors.push('Last name required'); if (!this.email || typeof this.email !== 'string') errors.push('Email required'); return { isValid: errors.length === 0, errors }; }
}
module.exports = { UpdateProfileDTO };
