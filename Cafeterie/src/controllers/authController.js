const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// Inscription
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }
    const hashed = await hashPassword(password);
    const user = await User.create({ firstName, lastName, email, password: hashed });
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    const token = generateToken({ id: user._id, role: user.role });
    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
