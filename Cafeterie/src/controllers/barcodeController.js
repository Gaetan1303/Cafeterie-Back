const { ScanBarcodeDTO, ListScannedDTO, ScanPhotoDTO } = require('../dtos/BarcodeDTOs');
const BarcodeClassificationService = require('../services/BarcodeClassificationService');
const { productInfoService } = require('../utils/barcodeService');
const PhotoProductService = require('../utils/photoProductService');
const StockRepository = require('../repositories/StockRepository');

function getRepo() {
  return new StockRepository();
}

exports.scanAndStore = async (req, res) => {
  try {
    const dto = new ScanBarcodeDTO(req.body.barcode);
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const productData = await productInfoService.getProductInfo(dto.barcode);
    const repo = getRepo();
    const service = new BarcodeClassificationService(repo);
    const result = await service.scanAndClassify(productData);

    res.json({ product: result.stockItem, classification: result.classification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listScanned = async (req, res) => {
  try {
    const dto = new ListScannedDTO(req.query.sortBy || 'scannedAt', req.query.order || 'desc');
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const sortOrder = dto.order === 'asc' ? 1 : -1;
    const repo = getRepo();
    const items = await repo.findAll();

    items.sort((a, b) => {
      const left = a[dto.sortBy];
      const right = b[dto.sortBy];
      if (dto.sortBy === 'scannedAt') {
        return sortOrder * (new Date(left || 0) - new Date(right || 0));
      }
      if (typeof left === 'string' || typeof right === 'string') {
        return sortOrder * String(left || '').localeCompare(String(right || ''));
      }
      return sortOrder * ((left || 0) - (right || 0));
    });

    res.json({ products: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.scanPhotoAndStore = async (req, res) => {
  try {
    const dto = new ScanPhotoDTO(req.body);
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const repo = getRepo();
    const photoService = new PhotoProductService();
    const persisted = photoService.persistImage(dto.imageBase64);

    const productName = dto.productName || 'Produit photo';
    const productType = dto.type || 'nourriture';
    const productCategory = dto.category || 'Photo Upload';
    const quantity = dto.quantity !== undefined ? Number(dto.quantity) : 0;
    const code = `photo:${persisted.hash}`;

    const stockItem = await repo.upsert(
      { code },
      {
        code,
        name: productName,
        brand: dto.brand || 'Inconnue',
        image: persisted.relativePath,
        category: productCategory,
        type: productType,
        subtype: `${productName}-${persisted.hash.slice(0, 8)}`,
        source: 'photo',
        scannedAt: new Date(),
        quantity,
        threshold: 0,
        lastRestocked: new Date()
      },
      {
        quantity,
        threshold: 0,
        lastRestocked: new Date()
      }
    );

    res.status(201).json({
      product: stockItem,
      acquisition: {
        source: 'photo',
        imagePath: persisted.relativePath
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
