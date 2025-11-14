const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  date: { type: Date, required: true, index: true },
  type: { type: String, enum: ['sortie', 'aquapiscine', 'autre'], default: 'autre', index: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxParticipants: { type: Number },
  alertThreshold: { type: Number }, // nombre de places restantes pour alerte
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
