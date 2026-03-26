const fs = require('fs');
const path = require('path');

/**
 * Charge la configuration des types depuis config/types.json
 * et les expose globalement dans global.CONSUMABLE_TYPES, etc.
 */
function loadTypeConfig() {
  const configPath = path.join(__dirname, 'types.json');
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  global.CONSUMABLE_TYPES = configData.consumableTypes;
  global.MACHINE_STATES = configData.machineStates;
  global.EVENT_TYPES = configData.eventTypes;
  global.STOCK_HISTORY_ACTIONS = configData.stockHistoryActions;

  console.log('✅ Type configuration loaded successfully');
}

module.exports = { loadTypeConfig };
