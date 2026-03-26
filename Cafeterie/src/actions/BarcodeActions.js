/* BarcodeActions.js (ex-UseCases) */
// ...existing code...
class ScanBarcodeAction {
  constructor(barcodeClassificationService, productInfoService, repository) {
    this.barcodeClassificationService = barcodeClassificationService;
    this.productInfoService = productInfoService;
    this.repository = repository;
  }
  async execute(dto) {
    const productData = await this.productInfoService.getProductInfo(dto.barcode);
    return this.barcodeClassificationService.scanAndClassify(productData, this.repository);
  }
}
class ListScannedAction {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(dto) {
    const sortOrder = dto.order === 'asc' ? 1 : -1;
    const sortOptions = { [dto.sortBy]: sortOrder };
    const items = await this.repository.findAll();
    return items.sort((a, b) => {
      let aVal = a[dto.sortBy];
      let bVal = b[dto.sortBy];
      if (dto.sortBy === 'scannedAt') {
        aVal = new Date(aVal) || new Date(0);
        bVal = new Date(bVal) || new Date(0);
      }
      if (typeof aVal === 'string') {
        return sortOrder === 1 ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 1 ? aVal - bVal : bVal - aVal;
    });
  }
}
module.exports = {
  ScanBarcodeAction,
  ListScannedAction
};