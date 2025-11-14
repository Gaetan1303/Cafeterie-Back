
const logger = require('./logger');

function logError(error, context = '') {
  logger.error(`${context} ${error.stack || error}`);
}

module.exports = logError;
