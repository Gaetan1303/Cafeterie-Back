/**
 * Auth Service - handles authentication logic
 * Manages user registration, login, and token generation
 */

const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Registers a new user with hashed password
   * @param {object} userData - { firstName, lastName, email, password }
   * @returns {Promise<object>} Created user object
   * @throws {Error} If email already exists or database error
   */
  async register(userData) {
    const { firstName, lastName, email, password } = userData;

    // Check if email already exists
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email déjà utilisé');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    return {
      message: 'Inscription réussie',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Authenticates a user and returns JWT token
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} { token, user }
   * @throws {Error} If credentials invalid or user not found
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Identifiants invalides');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Identifiants invalides');
    }

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    return {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = { AuthService };
