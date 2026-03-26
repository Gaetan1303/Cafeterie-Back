const StockRepository = require('../repositories/StockRepository');
const StockService = require('../services/StockService');
const {
  GetStockQueryDTO,
  CreateStockItemDTO,
  RestockDTO
} = require('../dtos/StockDTOs');
const {
  GetStockStatsAction,
  GetStockAlertsAction,
  GetStockAction,
  CreateStockItemAction,
  GetStockItemAction,
  RestockAction
} = require('../actions/StockActions');
const StockHistory = require('../models/StockHistory');

function buildDeps() {
  const repository = new StockRepository();
  const service = new StockService(repository);
  const stockHistoryService = {
    async logMovement({ itemId, action, quantity, userId, reason }) {
      await StockHistory.create({
        item: itemId,
        action,
        quantity,
        user: userId,
        reason
      });
    }
  };
  return { service, repository, stockHistoryService };
}

exports.getStockStats = async (req, res) => {
  try {
    const { service } = buildDeps();
    const useCase = new GetStockStatsUseCase(service);
    const result = await useCase.execute();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getStockAlerts = async (req, res) => {
  try {
    const { service } = buildDeps();
    const useCase = new GetStockAlertsUseCase(service);
    const result = await useCase.execute();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createStockItem = async (req, res) => {
  try {
    const dto = new CreateStockItemDTO(req.body);
    const { service } = buildDeps();
    const useCase = new CreateStockItemUseCase(service);
    const result = await useCase.execute(dto);
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('Validation failed')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes('existe déjà')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getStockItem = async (req, res) => {
  try {
    const { service } = buildDeps();
    const useCase = new GetStockItemUseCase(service);
    const result = await useCase.execute(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message.includes('Item non trouvé')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateStockItem = async (req, res) => {
  try {
    const { service } = buildDeps();
    const result = await service.updateItem(req.params.id, {
      quantity: req.body.quantity,
      threshold: req.body.threshold
    });
    res.json(result);
  } catch (err) {
    if (err.message.includes('Item non trouvé')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteStockItem = async (req, res) => {
  try {
    const { service } = buildDeps();
    await service.deleteItem(req.params.id);
    res.json({ message: 'Item supprimé' });
  } catch (err) {
    if (err.message.includes('Item non trouvé')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getStock = async (req, res) => {
  try {
    const queryDTO = new GetStockQueryDTO(req.query.page, req.query.limit);
    const { service } = buildDeps();
    const useCase = new GetStockUseCase(service);
    const result = await useCase.execute(queryDTO);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.restock = async (req, res) => {
  try {
    const restockDTO = new RestockDTO(req.body);
    const { service, stockHistoryService } = buildDeps();
    const useCase = new RestockUseCase(service, stockHistoryService);
    const result = await useCase.execute(restockDTO, req.user.id);
    res.status(200).json({ message: 'Stock réapprovisionné', item: result });
  } catch (err) {
    if (err.message.includes('Validation failed')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
