const fs = require('fs');
const path = require('path');

function logError(error, context = '') {
  const logPath = path.join(__dirname, '../logs/errors.log');
  const logMsg = `[${new Date().toISOString()}] ${context}\n${error.stack || error}\n\n`;
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, logMsg, 'utf8');
}

module.exports = logError;
