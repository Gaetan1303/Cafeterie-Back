const { getCache, setCache } = require('../utils/cache');
class EventService { constructor(eventRepository) { this.repository = eventRepository; }
async createEvent(eventData) { if (new Date(eventData.date) < new Date()) throw new Error('Cannot create past event'); return this.repository.create(eventData); }
async getAllEvents(page = 1, limit = 50) { const skip = (page - 1) * limit; const events = await this.repository.model.find().sort({ date: 1 }).skip(skip).limit(limit).populate('participants', 'firstName lastName email'); const total = await this.repository.countDocuments(); return { data: events, page, limit, total, totalPages: Math.ceil(total / limit) }; }
async getEventById(id) { return this.repository.model.findById(id).populate('participants', 'firstName lastName email'); }
async updateEvent(id, updates) { return this.repository.updateById(id, updates); }
async deleteEvent(id) { return this.repository.deleteById(id); }
async getDashboardStats() { const cacheKey = 'dashboard:events'; const cached = await getCache(cacheKey); if (cached) return cached; const totalEvents = await this.repository.countDocuments(); const byType = await this.repository.findByTypeAggregation(); const fillingRates = await this.repository.findFillingRatesAggregation(); const byUser = await this.repository.findParticipationByUser(); const upcoming = await this.repository.findUpcoming(5); const result = { totalEvents, byType, fillingRates, byUser, upcoming }; await setCache(cacheKey, result, 60); return result; }
async participateEvent(id, userId, session) { return this.repository.addParticipant(id, userId, session); }
async unparticipateEvent(id, userId, session) { return this.repository.removeParticipant(id, userId, session); }
} module.exports = { EventService };
