const express = require('express');
const router = express.Router();
const stockHistoryController = require('../controllers/stockHistoryController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// GET /stock-history/:id : historique d'un item
router.get('/:id', auth, stockHistoryController.getItemHistory);


// GET /stock-history : historique global (admin)
router.get('/', auth, admin, stockHistoryController.getAllHistory);

// GET /stock-history/dashboard : dashboard croisé (admin)
router.get('/dashboard', auth, admin, stockHistoryController.getDashboardStats);


// POST /stock-history/operation : enregistrer une opération (nettoyage/préparation)
router.post('/operation', auth, async (req, res) => {
	// Champs attendus : itemId, action, quantity, AuteurId, reason
	try {
		const { itemId, action, quantity, AuteurId, reason } = req.body;
		if (!itemId || !action || !quantity || !AuteurId) {
			return res.status(400).json({ error: 'Champs requis manquants' });
		}
		// Seules actions nettoyage/préparation autorisées ici
		if (!["nettoyage", "préparation"].includes(action)) {
			return res.status(400).json({ error: 'Action non autorisée' });
		}
		const { logStockMovement } = require('../controllers/stockHistoryController');
		await logStockMovement({ itemId, action, quantity, userId: req.user.id, AuteurId, reason });
		res.status(201).json({ message: 'Opération enregistrée' });
	} catch (err) {
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

module.exports = router;
