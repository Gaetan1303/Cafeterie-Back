/* StockActions.js (ex-UseCases) */
class GetStockStatsAction {
  constructor(stockService) { this.stockService = stockService; }
  async execute() { return this.stockService.getStats(); }
}
class GetStockAlertsAction {
  constructor(stockService) { this.stockService = stockService; }
  async execute() { return this.stockService.getAlerts(); }
}
class GetStockAction {
  constructor(stockService) { this.stockService = stockService; }
  async execute(query) { return this.stockService.getStockPaginated(query.page, query.limit); }
}
class CreateStockItemAction {
  constructor(stockService) { this.stockService = stockService; }
  async execute(dto) {
    const validation = dto.validate();
    if (!validation.isValid) { throw new Error(`Validation failed: ${validation.errors.join(', ')}`); }
    return this.stockService.createItem(dto);
  }
}
class GetStockItemAction {
  constructor(stockService) { this.stockService = stockService; }
  async execute(id) { return this.stockService.getItemById(id); }
}
class RestockAction {
  constructor(stockService, stockHistoryService) { this.stockService = stockService; this.stockHistoryService = stockHistoryService; }
  async execute(dto, userId) {
    const validation = dto.validate();
    if (!validation.isValid) { throw new Error(`Validation failed: ${validation.errors.join(', ')}`); }
    const item = await this.stockService.restock(dto.type, dto.subtype, dto.quantity);
    if (this.stockHistoryService) {
      await this.stockHistoryService.logMovement({ itemId: item._id, action: 'entree', quantity: dto.quantity, userId, reason: 'Réapprovisionnement' });
    }
    return item;
  }
}
module.exports = {
  GetStockStatsAction,
  GetStockAlertsAction,
  GetStockAction,
  CreateStockItemAction,
  GetStockItemAction,
  RestockAction
};