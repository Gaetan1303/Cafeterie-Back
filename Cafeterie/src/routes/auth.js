
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { body, validate } = require('../middlewares/validate');
const authLimiter = require('../middlewares/authLimiter');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et inscription des utilisateurs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.dupont@exemple.fr
 *               password:
 *                 type: string
 *                 example: MonMdp1!
 *                 description: Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données invalides
 *       429:
 *         description: Trop de tentatives, réessayer plus tard
 */

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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter et obtenir un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean.dupont@exemple.fr
 *               password:
 *                 type: string
 *                 example: MonMdp1!
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants incorrects
 *       429:
 *         description: Trop de tentatives, réessayer plus tard
 */

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
