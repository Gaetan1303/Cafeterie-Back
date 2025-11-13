const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET /stock : liste du stock
router.get('/', stockController.getStock);

// POST /stock/restock : réapprovisionnement (admin)
router.post('/restock', stockController.restock);

module.exports = router;
