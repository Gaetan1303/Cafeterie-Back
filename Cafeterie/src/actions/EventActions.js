// EventActions.js (ex-UseCases)
class CreateEventAction { constructor(eventService) { this.eventService = eventService; }
async execute(dto) { return this.eventService.createEvent({ title: dto.title, description: dto.description, date: dto.date, type: dto.type, maxParticipants: dto.maxParticipants, alertThreshold: dto.alertThreshold }); }
}
class GetEventsAction { constructor(eventService) { this.eventService = eventService; }
async execute(dto) { const page = Math.max(1, parseInt(dto.page) || 1); const limit = Math.max(1, Math.min(500, parseInt(dto.limit) || 50)); return this.eventService.getAllEvents(page, limit); }
}
class GetEventAction { constructor(eventService) { this.eventService = eventService; }
async execute(id) { return this.eventService.getEventById(id); }
}
class UpdateEventAction { constructor(eventService) { this.eventService = eventService; }
async execute(id, updates) { return this.eventService.updateEvent(id, updates); }
}
class DeleteEventAction { constructor(eventService) { this.eventService = eventService; }
async execute(id) { return this.eventService.deleteEvent(id); }
}
class GetDashboardStatsAction { constructor(eventService) { this.eventService = eventService; }
async execute() { return this.eventService.getDashboardStats(); }
}
class ParticipateEventAction { constructor(eventService) { this.eventService = eventService; }
async execute(id, userId, session) { return this.eventService.participateEvent(id, userId, session); }
}
class UnparticipateEventAction { constructor(eventService) { this.eventService = eventService; }
async execute(id, userId, session) { return this.eventService.unparticipateEvent(id, userId, session); }
}
module.exports = { CreateEventAction, GetEventsAction, GetEventAction, UpdateEventAction, DeleteEventAction, GetDashboardStatsAction, ParticipateEventAction, UnparticipateEventAction };