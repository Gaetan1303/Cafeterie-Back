/* PurchaseActions.js (ex-UseCases) */
class CreatePurchaseAction {
  constructor(purchaseService) { this.purchaseService = purchaseService; }
  async execute(dto, userId) { return this.purchaseService.createPurchase(userId, dto.stockItem, dto.quantity); }
}
class GetRecentPurchasesAction {
  constructor(purchaseService) { this.purchaseService = purchaseService; }
  async execute(dto, userId, isAdmin) {
    const params = dto.getParams();
    const filter = dto.getFilter();
    if (!isAdmin) { filter.user = userId; }
    return this.purchaseService.getPurchasesWithPagination(filter, params.page, params.limit);
  }
}
class GetAllPurchasesAction {
  constructor(purchaseService) { this.purchaseService = purchaseService; }
  async execute(dto) {
    const params = dto.getParams();
    return this.purchaseService.getAllPurchases(params.page, params.limit);
  }
}
class GetMyPurchasesAction {
  constructor(purchaseService) { this.purchaseService = purchaseService; }
  async execute(dto, userId) {
    const params = dto.getParams();
    return this.purchaseService.getUserPurchases(userId, params.page, params.limit);
  }
}
module.exports = {
  CreatePurchaseAction,
  GetRecentPurchasesAction,
  GetAllPurchasesAction,
  GetMyPurchasesAction
};