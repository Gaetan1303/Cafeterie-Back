const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


// Routes spécifiques AVANT les routes génériques
// Dashboard stats évènements/participations
router.get('/dashboard', auth, eventController.getDashboardStats);

// Alerte sur les évènements à seuil critique
router.get('/alert/critical', auth, eventController.getAlertEvents);

// Participation
router.post('/:id/participate', auth, eventController.participate);
router.post('/:id/unparticipate', auth, eventController.unparticipate);

// CRUD
router.post('/', auth, admin, eventController.createEvent);
router.get('/', auth, eventController.getEvents);
router.get('/:id', auth, eventController.getEvent);
router.put('/:id', auth, admin, eventController.updateEvent);
router.delete('/:id', auth, admin, eventController.deleteEvent);

module.exports = router;
