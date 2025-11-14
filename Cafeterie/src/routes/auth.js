
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { body, validate } = require('../middlewares/validate');
const authLimiter = require('../middlewares/authLimiter');


// Validation pour l'inscription

// Rate limiting + validation pour l'inscription
router.post(
	'/register',
	authLimiter,
	validate([
			body('email').isEmail().withMessage('Email invalide'),
			body('password')
				.isLength({ min: 8 }).withMessage('Mot de passe trop court (min 8)')
				.matches(/[A-Z]/).withMessage('Le mot de passe doit contenir une majuscule')
				.matches(/[a-z]/).withMessage('Le mot de passe doit contenir une minuscule')
				.matches(/[0-9]/).withMessage('Le mot de passe doit contenir un chiffre')
				.matches(/[^A-Za-z0-9]/).withMessage('Le mot de passe doit contenir un caractère spécial'),
			body('firstName').notEmpty().withMessage('Prénom requis'),
			body('lastName').notEmpty().withMessage('Nom requis')
	]),
	authController.register
);

// Validation pour la connexion

// Rate limiting + validation pour la connexion
router.post(
	'/login',
	authLimiter,
	validate([
		body('email').isEmail().withMessage('Email invalide'),
		body('password').notEmpty().withMessage('Mot de passe requis')
	]),
	authController.login
);

module.exports = router;
