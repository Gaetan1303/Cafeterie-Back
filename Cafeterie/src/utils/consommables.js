require('dotenv').config();
const mongoose = require('mongoose');
const StockItem = require('../models/StockItem');
const Machine = require('../models/Machine');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    });
    console.log('Connexion Mongoose OK');

    // Nettoyage préalable
    await StockItem.deleteMany({});
    await Machine.deleteMany({});

    // Un consommable exemple pour chaque catégorie
    await StockItem.create({ type: 'jus', subtype: 'orange', category: 'Boisson froide', quantity: 0, threshold: 2 });
    await StockItem.create({ type: 'viennoiserie', subtype: 'croissant', category: 'Viennoiserie', quantity: 0, threshold: 5 });
    await StockItem.create({ type: 'apero', subtype: 'chips', category: 'Apéro', quantity: 0, threshold: 3 });
    await StockItem.create({ type: 'petit-dejeuner', subtype: 'confiture', category: 'Petit déjeuner', quantity: 0, threshold: 2 });
    await StockItem.create({ type: 'fruit', subtype: 'banane', category: 'Fruits et Légumes', quantity: 0, threshold: 3 });

    // Création des stocks de consommables avec les nouvelles catégories
    const cafePoudre = await StockItem.create({ type: 'cafe', subtype: 'poudre', category: 'Boisson chaude', quantity: 0, threshold: 50 });
    const theSachetElephant = await StockItem.create({ type: 'the', subtype: 'sachet-elephant', category: 'Boisson chaude', quantity: 0, threshold: 5 });
    const theSachetLipton = await StockItem.create({ type: 'the', subtype: 'sachet-lipton', category: 'Boisson chaude', quantity: 0, threshold: 5 });
    const theBoite100g = await StockItem.create({ type: 'the', subtype: 'boite-100g', category: 'Boisson chaude', quantity: 0, threshold: 20 });

    // Machines
    await Machine.create([
      {
        name: 'Cafetière 1',
        type: 'cafe',
        capacity: 15,
        unit: 'tasse',
        state: 'disponible',
        consumables: [
          { name: 'Café en poudre', stockRef: cafePoudre._id, quantity: 0, unit: 'g' }
        ]
      },
      {
        name: 'Cafetière 2',
        type: 'cafe',
        capacity: 15,
        unit: 'tasse',
        state: 'disponible',
        consumables: [
          { name: 'Café en poudre', stockRef: cafePoudre._id, quantity: 0, unit: 'g' }
        ]
      },
      {
        name: 'Théière',
        type: 'the',
        capacity: 10,
        unit: 'tasse',
        state: 'disponible',
        consumables: [
          { name: 'Sachet éléphant', stockRef: theSachetElephant._id, quantity: 0, unit: 'sachet' },
          { name: 'Sachet Lipton', stockRef: theSachetLipton._id, quantity: 0, unit: 'sachet' },
          { name: 'Boîte 100g', stockRef: theBoite100g._id, quantity: 0, unit: 'g' }
        ]
      }
    ]);

    console.log('Machines et consommables initialisés !');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur lors de l\'initialisation :', err);
    process.exit(1);
  }
}

seed();
