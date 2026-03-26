// ProfileActions.js (ex-UseCases)
class GetProfileAction { constructor(profileService) { this.svc = profileService; }
async execute(userId) { return this.svc.getProfile(userId); }
}
class UpdateProfileAction { constructor(profileService) { this.svc = profileService; }
async execute(userId, dto) { return this.svc.updateProfile(userId, { firstName: dto.firstName, lastName: dto.lastName, email: dto.email }); }
}
module.exports = { GetProfileAction, UpdateProfileAction };