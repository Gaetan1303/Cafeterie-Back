const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middlewares/auth');

// GET /purchases/me : historique de l'utilisateur connecté
router.get('/me', auth, purchaseController.getMyPurchases);

// POST /purchases : enregistrer un achat
router.post('/', auth, purchaseController.createPurchase);

module.exports = router;
