const Machine = require('../models/Machine');
const StockItem = require('../models/StockItem');

// CRUD Machine
exports.createMachine = async (req, res) => {
  try {
    const { name, type, capacity, unit, consumables } = req.body;
    const machine = await Machine.create({ name, type, capacity, unit, consumables });
    res.status(201).json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate('consumables.stockRef');
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate('consumables.stockRef');
    if (!machine) return res.status(404).json({ error: 'Machine non trouvée' });
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!machine) return res.status(404).json({ error: 'Machine non trouvée' });
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine non trouvée' });
    res.json({ message: 'Machine supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Utiliser une machine (préparer X tasses)
exports.useMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, AuteurId } = req.body; // nombre de tasses à préparer, opérateur
    const machine = await Machine.findById(id).populate('consumables.stockRef');
    if (!machine) return res.status(404).json({ error: 'Machine non trouvée' });
    if (machine.state !== 'disponible') return res.status(400).json({ error: 'Machine non disponible' });
    if (quantity > machine.capacity) return res.status(400).json({ error: 'Capacité dépassée' });
    // TODO: décrémenter les consommables liés (café, thé, sachets, etc.)
    // TODO: enregistrer l'opération dans l'historique (stockHistory)
    machine.lastUsed = new Date();
    await machine.save();
    res.json({ message: 'Préparation effectuée', machine });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Nettoyer une machine
exports.cleanMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const machine = await Machine.findById(id);
    if (!machine) return res.status(404).json({ error: 'Machine non trouvée' });
    machine.state = 'en nettoyage';
    machine.lastCleaned = new Date();
    await machine.save();
    res.json({ message: 'Machine en nettoyage', machine });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Changer l'état d'une machine (disponible, en panne, etc.)
exports.setMachineState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const machine = await Machine.findById(id);
    if (!machine) return res.status(404).json({ error: 'Machine non trouvée' });
    machine.state = state;
    await machine.save();
    res.json({ message: 'État mis à jour', machine });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
