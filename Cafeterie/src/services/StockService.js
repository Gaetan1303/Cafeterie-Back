/**
 * Service métier pour la gestion du stock.
 * Responsabilités uniques :
 * - Calculs de stats
 * - Gestion des alertes
 * - Estimations
 * - Logique CRUD stock
 */
class StockService {
  constructor(stockRepository) {
    this.repo = stockRepository;
  }

  /**
   * Retourne les statistiques globales du stock.
   */
  async getStats() {
    const items = await this.repo.findAll();
    return {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      totalCups: items.reduce((sum, item) => sum + (this.estimateCups(item) || 0), 0),
      alerts: items.filter(item => item.threshold != null && item.quantity <= item.threshold).length
    };
  }

  /**
   * Retourne les items en alerte avec estimation de tasses.
   */
  async getAlerts() {
    const items = await this.repo.findAll();
    return items
      .filter(item => item.threshold != null && item.quantity <= item.threshold)
      .map(item => ({
        ...item.toObject(),
        cupsEstimate: this.estimateCups(item),
        alertLowStock: true
      }));
  }

  /**
   * Estimation du nombre de tasses basé sur le ratio du type.
   */
  estimateCups(item) {
    const ratios = global.CONSUMABLE_TYPES || { 'cafe': 20, 'the': 40 };
    const ratio = ratios[item.type]?.cupsRatio || ratios[item.type];
    return ratio ? (item.quantity * ratio) : null;
  }

  /**
   * Retourne la liste paginée du stock avec estimation.
   */
  async getStockPaginated(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const { items, total } = await this.repo.findPaginated({}, skip, limit, { type: 1 });
    return {
      data: items.map(item => ({
        ...item.toObject(),
        cupsEstimate: this.estimateCups(item),
        alertLowStock: item.threshold != null && item.quantity <= item.threshold
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Crée un nouvel item de stock.
   */
  async createItem(data) {
    const exists = await this.repo.findByTypeAndSubtype(data.type, data.subtype);
    if (exists) {
      throw new Error('Item avec ce type/subtype existe déjà');
    }
    return this.repo.create(data);
  }

  /**
   * Récupère un item par ID.
   */
  async getItemById(id) {
    const item = await this.repo.findById(id);
    if (!item) throw new Error('Item non trouvé');
    return item;
  }

  /**
   * Met à jour un item.
   */
  async updateItem(id, data) {
    const item = await this.repo.updateById(id, data);
    if (!item) throw new Error('Item non trouvé');
    return item;
  }

  /**
   * Supprime un item.
   */
  async deleteItem(id) {
    const item = await this.repo.deleteById(id);
    if (!item) throw new Error('Item non trouvé');
    return item;
  }

  /**
   * Réapprovisionne un item (crée s'il n'existe pas).
   */
  async restock(type, subtype, quantity) {
    const item = await this.repo.upsert(
      { type, subtype },
      {
        quantity: quantity,
        lastRestocked: new Date(),
        source: 'manual'
      },
      {
        type,
        subtype,
        quantity,
        lastRestocked: new Date(),
        source: 'manual'
      }
    );
    return item;
  }
}

module.exports = StockService;
