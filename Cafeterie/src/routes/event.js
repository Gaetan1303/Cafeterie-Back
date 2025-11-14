const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// CRUD
router.post('/', auth, admin, eventController.createEvent);
router.get('/', auth, eventController.getEvents);
router.get('/:id', auth, eventController.getEvent);
router.put('/:id', auth, admin, eventController.updateEvent);
router.delete('/:id', auth, admin, eventController.deleteEvent);

// Participation
router.post('/:id/participate', auth, eventController.participate);


// Alerte sur les évènements à seuil critique
router.get('/alert/critical', auth, eventController.getAlertEvents);

// Dashboard stats évènements/participations
router.get('/dashboard', auth, eventController.getDashboardStats);

module.exports = router;
