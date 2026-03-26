const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Gestion du profil utilisateur
 */

/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur (sans mot de passe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Non autorisé
 */
router.get('/me', auth, profileController.getProfile);

/**
 * @swagger
 * /profile/me:
 *   put:
 *     summary: Modifier le profil de l'utilisateur connecté
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/me', auth, profileController.updateProfile);

module.exports = router;
