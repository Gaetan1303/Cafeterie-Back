const express = require('express');
const router = express.Router();
const StockItem = require('../models/StockItem');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

// Créer un consommable (autorisé pour user et admin)
router.post('/', auth, async (req, res) => {
  try {
    // Seuls les users ou admins peuvent ajouter
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'user')) {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs ou utilisateurs' });
    }
    const { type, subtype, category, quantity, threshold } = req.body;
    const item = await StockItem.create({ type, subtype, category, quantity, threshold });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lire tous les consommables
router.get('/', auth, async (req, res) => {
  try {
    const items = await StockItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lire un consommable
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await StockItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Consommable non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour un consommable
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const item = await StockItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Consommable non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un consommable
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const item = await StockItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Consommable non trouvé' });
    res.json({ message: 'Consommable supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
