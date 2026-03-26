/**
 * Service métier pour la classification de produits scannés.
 * Sépare l'inférence du stockage.
 */
class BarcodeClassificationService {
  constructor(stockRepository, typeConfig = {}) {
    this.stockRepo = stockRepository;
    this.typeConfig = typeConfig;
  }

  /**
   * Déduit un type interne à partir des catégories Open Food Facts.
   */
  inferType(categories) {
    if (!categories || categories.length === 0) return 'nourriture';
    
    const haystack = categories.join(' ').toLowerCase();
    
    const rules = [
      { pattern: /(coffee|cafe|café)/, type: 'cafe' },
      { pattern: /(tea|the|thé)/, type: 'the' },
      { pattern: /(juice|jus|boisson|drink|soda|cola)/, type: 'jus' },
      { pattern: /(croissant|viennoiserie|brioche|pastry)/, type: 'viennoiserie' },
      { pattern: /(fruit|fruits|vegetable|l[eé]gume)/, type: 'fruit' },
      { pattern: /(breakfast|petit.?dej|petit d[eé]jeuner)/, type: 'petit-dejeuner' },
      { pattern: /(ap[eé]ro|snack sal[ée])/i, type: 'apero' }
    ];
    
    for (const { pattern, type } of rules) {
      if (pattern.test(haystack)) return type;
    }
    
    return 'nourriture';
  }

  /**
   * Construit une catégorie lisible.
   */
  inferCategory(categories) {
    if (!categories || categories.length === 0) return 'Autres';
    return categories[0].trim() || 'Autres';
  }

  /**
   * Scanne et classe un produit, puis le stocke (upsert).
   */
  async scanAndClassify(productData) {
    // Normaliser les catégories externes (string CSV -> tableau)
    const normalizedCategories = (productData.categories || '')
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    // Déduire les champs métier
    const category = this.inferCategory(normalizedCategories);
    const type = this.inferType(normalizedCategories);
    const subtype = productData.name || productData.brand || productData.code;

    // Upsert dans le stock
    const stockItem = await this.stockRepo.upsert(
      { code: productData.code },
      {
        code: productData.code,
        name: productData.name,
        brand: productData.brand,
        image: productData.image,
        category,
        type,
        subtype,
        source: 'barcode',
        scannedAt: new Date()
      },
      {
        quantity: 0,
        threshold: 0,
        lastRestocked: new Date()
      }
    );

    return {
      stockItem,
      classification: { type, category }
    };
  }
}

module.exports = BarcodeClassificationService;
