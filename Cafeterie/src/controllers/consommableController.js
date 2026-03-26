// ConsommableController.js
// Contrôleur SOLID pour la gestion des consommables
const { createConsommableAction } = require('../actions/ConsommableActions');
const { validateCreateConsommableDTO } = require('../dtos/ConsommableDTOs');

exports.createConsommable = async (req, res) => {
  try {
    const dto = validateCreateConsommableDTO(req.body);
    const user = req.user;
    const consommable = await createConsommableAction(dto, user);
    res.status(201).json(consommable);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Erreur serveur' });
  }
};
