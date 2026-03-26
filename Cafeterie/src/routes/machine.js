const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @swagger
 * tags:
 *   name: Machines
 *   description: Gestion des machines à café et à thé
 */

/**
 * @swagger
 * /machines:
 *   post:
 *     summary: Créer une machine (admin uniquement)
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [cafe, the]
 *               capacity:
 *                 type: number
 *               unit:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       201:
 *         description: Machine créée
 *       403:
 *         description: Réservé aux administrateurs
 */
router.post('/', auth, admin, machineController.createMachine);

/**
 * @swagger
 * /machines:
 *   get:
 *     summary: Lister toutes les machines
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des machines
 *       401:
 *         description: Non autorisé
 */
router.get('/', auth, machineController.getMachines);

/**
 * @swagger
 * /machines/{id}:
 *   get:
 *     summary: Récupérer une machine par ID
 *     tags: [Machines]
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
 *         description: Détail de la machine
 *       404:
 *         description: Machine non trouvée
 */
router.get('/:id', auth, machineController.getMachine);

/**
 * @swagger
 * /machines/{id}:
 *   put:
 *     summary: Modifier une machine (admin uniquement)
 *     tags: [Machines]
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
 *         description: Machine modifiée
 *       403:
 *         description: Réservé aux administrateurs
 */
router.put('/:id', auth, admin, machineController.updateMachine);

/**
 * @swagger
 * /machines/{id}:
 *   delete:
 *     summary: Supprimer une machine (admin uniquement)
 *     tags: [Machines]
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
 *         description: Machine supprimée
 *       403:
 *         description: Réservé aux administrateurs
 */
router.delete('/:id', auth, admin, machineController.deleteMachine);

/**
 * @swagger
 * /machines/{id}/use:
 *   post:
 *     summary: Utiliser une machine pour préparer des tasses
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cups]
 *             properties:
 *               cups:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Machine utilisée, lastUsed mis à jour
 *       401:
 *         description: Non autorisé
 */
router.post('/:id/use', auth, machineController.useMachine);

/**
 * @swagger
 * /machines/{id}/clean:
 *   post:
 *     summary: Marquer une machine comme nettoyée
 *     tags: [Machines]
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
 *         description: Machine en cours de nettoyage
 *       401:
 *         description: Non autorisé
 */
router.post('/:id/clean', auth, machineController.cleanMachine);

/**
 * @swagger
 * /machines/{id}/state:
 *   post:
 *     summary: Changer l'état d'une machine (admin uniquement)
 *     tags: [Machines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [state]
 *             properties:
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: État de la machine mis à jour
 *       403:
 *         description: Réservé aux administrateurs
 */
router.post('/:id/state', auth, admin, machineController.setMachineState);

module.exports = router;
