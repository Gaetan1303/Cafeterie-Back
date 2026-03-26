const express = require('express');
const router = express.Router();
const barcodeController = require('../controllers/barcodeController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Barcode
 *   description: Scan de produits via code-barres (Open Food Facts API)
 */

/**
 * @swagger
 * /barcode/scan:
 *   post:
 *     summary: Scanner un produit par code-barres et le classer automatiquement
 *     tags: [Barcode]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barcode]
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: '3017620422003'
 *                 description: Code-barres EAN/UPC du produit
 *     responses:
 *       200:
 *         description: Produit scanné, classé et stocké
 *       400:
 *         description: Barcode requis
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Produit non trouvé ou erreur API
 */
router.post('/scan', auth, barcodeController.scanAndStore);

/**
 * @swagger
 * /barcode/photo:
 *   post:
 *     summary: Enregistrer un produit via photo (caméra mobile ou upload manuel)
 *     tags: [Barcode]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [imageBase64]
 *             properties:
 *               imageBase64:
 *                 type: string
 *                 example: data:image/jpeg;base64,/9j/4AAQSk...
 *                 description: Image encodée en Data URI
 *               productName:
 *                 type: string
 *                 example: Barre chocolatée
 *               brand:
 *                 type: string
 *                 example: Marque X
 *               category:
 *                 type: string
 *                 example: Snacks
 *               type:
 *                 type: string
 *                 enum: [cafe, the, nourriture, jus, viennoiserie, apero, petit-dejeuner, fruit]
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produit enregistré depuis une photo
 *       400:
 *         description: Payload invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/photo', auth, barcodeController.scanPhotoAndStore);

/**
 * @swagger
 * /barcode/scanned:
 *   get:
 *     summary: Lister les produits scannés avec tri possible
 *     tags: [Barcode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, brand, category, type, scannedAt]
 *         description: Champ de tri
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste triée des produits scannés
 *       401:
 *         description: Non autorisé
 */
router.get('/scanned', auth, barcodeController.listScanned);

module.exports = router;
