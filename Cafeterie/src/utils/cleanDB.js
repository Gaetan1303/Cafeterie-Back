require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const StockItem = require('../models/StockItem');
const Machine = require('../models/Machine');
const Purchase = require('../models/Purchase');
const StockHistory = require('../models/StockHistory');

async function cleanDB() {
  await connectDB();
  await StockItem.deleteMany({});
  await Machine.deleteMany({});
  await Purchase.deleteMany({});
  await StockHistory.deleteMany({});
  console.log('Toutes les collections principales ont été vidées.');
  mongoose.connection.close();
}

cleanDB();
