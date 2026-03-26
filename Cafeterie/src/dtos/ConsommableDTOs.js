// ConsommableDTOs.js
// DTOs pour la gestion des consommables
function validateCreateConsommableDTO(data) {
  const { type, subtype, category, quantity, threshold } = data;
  if (!type || typeof type !== 'string') throw new Error('Type requis');
  if (!category || typeof category !== 'string') throw new Error('Catégorie requise');
  if (quantity == null || typeof quantity !== 'number') throw new Error('Quantité requise');
  return { type, subtype, category, quantity, threshold };
}

module.exports = { validateCreateConsommableDTO };