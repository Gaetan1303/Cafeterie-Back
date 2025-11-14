const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// GET /purchases/recent : derniers achats (tous ou par utilisateur)
router.get('/recent', auth, purchaseController.getRecentPurchases);
// GET /purchases/me : historique de l'utilisateur connecté
router.get('/me', auth, purchaseController.getMyPurchases);
// GET /purchases/all : historique global (admin)
router.get('/all', auth, admin, purchaseController.getAllPurchases);
// POST /purchases : enregistrer un achat
router.post('/', auth, purchaseController.createPurchase);

module.exports = router;
