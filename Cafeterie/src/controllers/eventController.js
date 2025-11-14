// Dashboard évènements : stats par type, date, taux de remplissage, participation par utilisateur
exports.getDashboardStats = async (req, res) => {
  try {
    // Stats globales
    const totalEvents = await Event.countDocuments();
    const byType = await Event.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    // Taux de remplissage par event
    const fillingRates = await Event.aggregate([
      {
        $project: {
          title: 1,
          type: 1,
          date: 1,
          maxParticipants: 1,
          nbParticipants: { $size: "$participants" },
          fillingRate: {
            $cond: [
              { $gt: ["$maxParticipants", 0] },
              { $divide: [{ $size: "$participants" }, "$maxParticipants"] },
              null
            ]
          }
        }
      },
      { $sort: { fillingRate: -1 } }
    ]);
    // Participation par utilisateur
    const byUser = await Event.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: "$participants", nbEvents: { $sum: 1 } } },
      { $sort: { nbEvents: -1 } }
    ]);
    // Prochains évènements (à venir)
    const now = new Date();
    const upcoming = await Event.find({ date: { $gte: now } }).sort({ date: 1 }).limit(5);
    res.json({
      totalEvents,
      byType,
      fillingRates,
      byUser,
      upcoming
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};
const Event = require('../models/Event');
const User = require('../models/User');

// CRUD
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, type, maxParticipants, alertThreshold } = req.body;
    const event = await Event.create({ title, description, date, type, maxParticipants, alertThreshold });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('participants', 'firstName lastName email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', 'firstName lastName email');
    if (!event) return res.status(404).json({ error: 'Évènement non trouvé' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Évènement non trouvé' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Évènement non trouvé' });
    res.json({ message: 'Évènement supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Grille de participation
exports.participate = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Évènement non trouvé' });
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ error: 'Évènement complet' });
    }
    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
      await event.save();
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Alerte sur les évènements à seuil critique
exports.getAlertEvents = async (req, res) => {
  try {
    const events = await Event.find({
      alertThreshold: { $ne: null },
      $expr: { $lte: [ { $subtract: ["$maxParticipants", { $size: "$participants" }] }, "$alertThreshold" ] }
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
