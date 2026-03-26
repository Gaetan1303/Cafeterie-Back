const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Gestion du stock de la caféterie
 */

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Récupérer la liste du stock
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: Liste des éléments en stock
 */
router.get('/', stockController.getStock);

/**
 * @swagger
 * /stock/stats:
 *   get:
 *     summary: Statistiques globales du stock
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques (total, quantité, estimations tasses, alertes)
 *       401:
 *         description: Non autorisé
 */
router.get('/stats', auth, stockController.getStockStats);

/**
 * @swagger
 * /stock/alerts:
 *   get:
 *     summary: Articles en alerte de stock bas
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des articles sous le seuil d'alerte
 *       401:
 *         description: Non autorisé
 */
router.get('/alerts', auth, stockController.getStockAlerts);

/**
 * @swagger
 * /stock/restock:
 *   post:
 *     summary: Réapprovisionner un article (admin uniquement)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId, quantity]
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Stock mis à jour
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.post('/restock', auth, admin, stockController.restock);

/**
 * @swagger
 * /stock:
 *   post:
 *     summary: Créer un article en stock (admin uniquement)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, quantity]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [cafe, the, nourriture, jus, viennoiserie, apero, petit-dejeuner, fruit]
 *               subtype:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               threshold:
 *                 type: number
 *     responses:
 *       201:
 *         description: Article créé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.post('/', auth, admin, stockController.createStockItem);

/**
 * @swagger
 * /stock/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 *     tags: [Stock]
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
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
router.get('/:id', auth, stockController.getStockItem);

/**
 * @swagger
 * /stock/{id}:
 *   put:
 *     summary: Modifier un article (admin uniquement)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Article modifié
 *       403:
 *         description: Réservé aux administrateurs
 */
router.put('/:id', auth, admin, stockController.updateStockItem);

/**
 * @swagger
 * /stock/{id}:
 *   delete:
 *     summary: Supprimer un article (admin uniquement)
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article supprimé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.delete('/:id', auth, admin, stockController.deleteStockItem);

module.exports = router;
