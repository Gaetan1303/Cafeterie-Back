const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gestion des événements
 */

/**
 * @swagger
 * /events/dashboard:
 *   get:
 *     summary: Statistiques dashboard des événements (mise en cache)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats par type, taux de remplissage, participations
 *       401:
 *         description: Non autorisé
 */
router.get('/dashboard', auth, eventController.getDashboardStats);

/**
 * @swagger
 * /events/alert/critical:
 *   get:
 *     summary: Événements atteignant le seuil d'alerte critique
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des événements critiques
 *       401:
 *         description: Non autorisé
 */
router.get('/alert/critical', auth, eventController.getAlertEvents);

/**
 * @swagger
 * /events/{id}/participate:
 *   post:
 *     summary: Participer à un événement
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'événement
 *     responses:
 *       200:
 *         description: Participation enregistrée
 *       400:
 *         description: Déjà inscrit ou événement complet
 *       401:
 *         description: Non autorisé
 */
router.post('/:id/participate', auth, eventController.participate);

/**
 * @swagger
 * /events/{id}/unparticipate:
 *   post:
 *     summary: Se désinscrire d'un événement
 *     tags: [Events]
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
 *         description: Désinscription effectuée
 *       401:
 *         description: Non autorisé
 */
router.post('/:id/unparticipate', auth, eventController.unparticipate);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Créer un événement (admin uniquement)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date, type]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [sortie, aquapiscine, autre]
 *               maxParticipants:
 *                 type: number
 *               alertThreshold:
 *                 type: number
 *     responses:
 *       201:
 *         description: Événement créé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.post('/', auth, admin, eventController.createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lister tous les événements
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des événements
 *       401:
 *         description: Non autorisé
 */
router.get('/', auth, eventController.getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags: [Events]
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
 *         description: Détail de l'événement
 *       404:
 *         description: Événement non trouvé
 */
router.get('/:id', auth, eventController.getEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Modifier un événement (admin uniquement)
 *     tags: [Events]
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
 *         description: Événement modifié
 *       403:
 *         description: Réservé aux administrateurs
 */
router.put('/:id', auth, admin, eventController.updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Supprimer un événement (admin uniquement)
 *     tags: [Events]
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
 *         description: Événement supprimé
 *       403:
 *         description: Réservé aux administrateurs
 */
router.delete('/:id', auth, admin, eventController.deleteEvent);

module.exports = router;
