/* AuthActions.js (ex-UseCases) */
// ...existing code...
/**
 * Actions for Authentication
 * Encapsulates autonomous auth logic: registration, login
 */

/**
 * Registers a new user with password hashing
 */
class RegisterAction {
  constructor(authService) {
    this.authService = authService;
  }
  async execute(dto) {
    return this.authService.register({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password
    });
  }
}

/**
 * Authenticates a user and returns JWT token
 */
class LoginAction {
  constructor(authService) {
    this.authService = authService;
  }
  async execute(dto) {
    return this.authService.login({
      email: dto.email,
      password: dto.password
    });
  }
}

module.exports = {
  RegisterAction,
  LoginAction
};