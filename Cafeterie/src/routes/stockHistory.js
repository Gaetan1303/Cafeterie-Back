const express = require('express');
const router = express.Router();
const stockHistoryController = require('../controllers/stockHistoryController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @swagger
 * tags:
 *   name: StockHistory
 *   description: Historique des mouvements de stock
 */

/**
 * @swagger
 * /stock-history:
 *   get:
 *     summary: Historique global de tous les mouvements (admin uniquement)
 *     tags: [StockHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tous les mouvements de stock
 *       403:
 *         description: Réservé aux administrateurs
 */
router.get('/', auth, admin, stockHistoryController.getAllHistory);

/**
 * @swagger
 * /stock-history/dashboard:
 *   get:
 *     summary: Dashboard croisé des statistiques de stock (admin uniquement)
 *     tags: [StockHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques croisées (par user, opérateur, catégorie)
 *       403:
 *         description: Réservé aux administrateurs
 */
router.get('/dashboard', auth, admin, stockHistoryController.getDashboardStats);

/**
 * @swagger
 * /stock-history/operation:
 *   post:
 *     summary: Enregistrer une opération de nettoyage ou préparation
 *     tags: [StockHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId, action, quantity, AuteurId]
 *             properties:
 *               itemId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [nettoyage, préparation]
 *               quantity:
 *                 type: number
 *               AuteurId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Opération enregistrée
 *       400:
 *         description: Champs requis manquants ou action non autorisée
 *       401:
 *         description: Non autorisé
 */
router.post('/operation', auth, async (req, res) => {
	try {
		const { itemId, action, quantity, AuteurId, reason } = req.body;
		if (!itemId || !action || !quantity || !AuteurId) {
			return res.status(400).json({ error: 'Champs requis manquants' });
		}
		if (!["nettoyage", "préparation"].includes(action)) {
			return res.status(400).json({ error: 'Action non autorisée' });
		}
		const { logStockMovement } = require('../controllers/stockHistoryController');
		await logStockMovement({ itemId, action, quantity, userId: req.user.id, AuteurId, reason });
		res.status(201).json({ message: 'Opération enregistrée' });
	} catch (err) {
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * @swagger
 * /stock-history/{id}:
 *   get:
 *     summary: Historique des mouvements d'un article
 *     tags: [StockHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Historique de l'article
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', auth, stockHistoryController.getItemHistory);

module.exports = router;
