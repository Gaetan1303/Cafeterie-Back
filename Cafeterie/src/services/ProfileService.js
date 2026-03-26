class ProfileService { constructor(userRepository) { this.repo = userRepository; }
async getProfile(userId) { return this.repo.model.findById(userId).select('-password'); }
async updateProfile(userId, updates) { return this.repo.model.findByIdAndUpdate(userId, { firstName: updates.firstName, lastName: updates.lastName, email: updates.email }, { new: true, runValidators: true, select: '-password' }); }
}
module.exports = { ProfileService };
