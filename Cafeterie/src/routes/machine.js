const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// CRUD
router.post('/', auth, admin, machineController.createMachine);
router.get('/', auth, machineController.getMachines);
router.get('/:id', auth, machineController.getMachine);
router.put('/:id', auth, admin, machineController.updateMachine);
router.delete('/:id', auth, admin, machineController.deleteMachine);

// Utiliser une machine (préparer X tasses)
router.post('/:id/use', auth, machineController.useMachine);

// Nettoyer une machine
router.post('/:id/clean', auth, machineController.cleanMachine);

// Changer l'état d'une machine
router.post('/:id/state', auth, admin, machineController.setMachineState);

module.exports = router;
