// Sécurisation des routes : validation des entrées avec express-validator
// À importer dans chaque route sensible (auth, users, stock, etc.)
const { body, validationResult } = require('express-validator');

// Middleware générique pour gérer les erreurs de validation
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

module.exports = { body, validate };
