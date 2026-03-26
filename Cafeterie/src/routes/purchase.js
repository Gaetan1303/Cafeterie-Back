const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Gestion des achats
 */

/**
 * @swagger
 * /purchases/recent:
 *   get:
 *     summary: Derniers achats (les siens si user, tous si admin)
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page de pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de résultats par page
 *     responses:
 *       200:
 *         description: Liste des achats récents
 *       401:
 *         description: Non autorisé
 */
router.get('/recent', auth, purchaseController.getRecentPurchases);

/**
 * @swagger
 * /purchases/me:
 *   get:
 *     summary: Historique d'achats de l'utilisateur connecté
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des achats de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/me', auth, purchaseController.getMyPurchases);

/**
 * @swagger
 * /purchases/all:
 *   get:
 *     summary: Historique global des achats (admin uniquement)
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tous les achats
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.get('/all', auth, admin, purchaseController.getAllPurchases);

/**
 * @swagger
 * /purchases:
 *   post:
 *     summary: Enregistrer un nouvel achat
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stockItemId, quantity]
 *             properties:
 *               stockItemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Achat enregistré, stock décrémenté
 *       400:
 *         description: Stock insuffisant
 *       401:
 *         description: Non autorisé
 */
router.post('/', auth, purchaseController.createPurchase);

module.exports = router;
