// Désinscription à un évènement
exports.unparticipate = async (req, res, next) => {
  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const event = await Event.findById(req.params.id).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Évènement non trouvé' });
    }
    const idx = event.participants.indexOf(req.user.id);
    if (idx === -1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Utilisateur non inscrit à cet évènement' });
    }
    event.participants.splice(idx, 1);
    await event.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.json({ message: 'Désinscription réussie', event });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};
// Dashboard évènements : stats par type, date, taux de remplissage, participation par utilisateur
const { getCache, setCache } = require('../utils/cache');
exports.getDashboardStats = async (req, res) => {
  try {
    const cacheKey = 'dashboard:events';
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);
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
    const result = {
      totalEvents,
      byType,
      fillingRates,
      byUser,
      upcoming
    };
    await setCache(cacheKey, result, 60); // 60s
    res.json(result);
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
    const now = new Date();
    if (new Date(date) < now) {
      return res.status(400).json({ error: "Impossible de créer un évènement dans le passé" });
    }
    const event = await Event.create({ title, description, date, type, maxParticipants, alertThreshold });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const events = await Event.find()
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .select('title description date type maxParticipants participants')
      .populate('participants', 'firstName lastName email');
    const total = await Event.countDocuments();
    res.json({
      data: events,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
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
const mongoose = require('mongoose');
exports.participate = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const event = await Event.findById(req.params.id).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Évènement non trouvé' });
    }
    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Évènement complet' });
    }
    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
      await event.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    res.json(event);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
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
