const express = require('express');
const router = express.Router();
const consommableController = require('../controllers/consommableController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @swagger
 * tags:
 *   name: Consommables
 *   description: Gestion des consommables
 */

/**
 * @swagger
 * /consommables:
 *   post:
 *     summary: Créer un consommable (user ou admin)
 *     tags: [Consommables]
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
 *         description: Consommable créé
 *       403:
 *         description: Accès refusé
 */
router.post('/', auth, consommableController.createConsommable);

/**
 * @swagger
 * /consommables:
 *   get:
 *     summary: Lister tous les consommables
 *     tags: [Consommables]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les consommables
 *       401:
 *         description: Non autorisé
 */
router.get('/', auth, async (req, res) => {
  try {
    const items = await StockItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /consommables/{id}:
 *   get:
 *     summary: Récupérer un consommable par ID
 *     tags: [Consommables]
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
 *         description: Consommable trouvé
 *       404:
 *         description: Consommable non trouvé
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await StockItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Consommable non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /consommables/{id}:
 *   put:
 *     summary: Modifier un consommable (admin uniquement)
 *     tags: [Consommables]
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
 *         description: Consommable modifié
 *       403:
 *         description: Réservé aux administrateurs
 */
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const item = await StockItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Consommable non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * @swagger
 * /consommables/{id}:
 *   delete:
 *     summary: Supprimer un consommable (admin uniquement)
 *     tags: [Consommables]
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
 *         description: Consommable supprimé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const item = await StockItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Consommable non trouvé' });
    res.json({ message: 'Consommable supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
