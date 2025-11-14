const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET /stock : liste du stock
router.get('/', stockController.getStock);

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
// POST /stock/restock : réapprovisionnement (admin)
router.post('/restock', auth, admin, stockController.restock);


// CRUD Stock
router.post('/', auth, admin, stockController.createStockItem); // Créer
router.get('/:id', auth, stockController.getStockItem); // Lire 
router.put('/:id', auth, admin, stockController.updateStockItem); // Modifier
router.delete('/:id', auth, admin, stockController.deleteStockItem); // Supprimer

module.exports = router;
