class CreateEventDTO { constructor(title, description, date, type, maxParticipants, alertThreshold) { this.title = title; this.description = description; this.date = date; this.type = type; this.maxParticipants = maxParticipants; this.alertThreshold = alertThreshold; }
validate() { const errors = []; if (!this.title || typeof this.title !== 'string') errors.push('Title required'); if (!this.date) errors.push('Date required'); if (this.maxParticipants && typeof this.maxParticipants !== 'number') errors.push('Max participants must be number'); return { isValid: errors.length === 0, errors }; }
}
class GetEventsQueryDTO { constructor(page = 1, limit = 50) { this.page = page; this.limit = limit; }
validate() { const errors = []; if (isNaN(parseInt(this.page)) || parseInt(this.page) < 1) errors.push('Page must be positive'); if (isNaN(parseInt(this.limit)) || parseInt(this.limit) < 1) errors.push('Limit must be positive'); return { isValid: errors.length === 0, errors }; }
}
module.exports = { CreateEventDTO, GetEventsQueryDTO };
