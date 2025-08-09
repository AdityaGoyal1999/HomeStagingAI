const UserModel = require('../models/userModel');

class UserService {
  constructor() {
    this.userModel = new UserModel();
  }

  async getUserProfile(userId) {
    try {
      const user = await this.userModel.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  async getUserPhotos(userId) {
    try {
      const photos = await this.userModel.getUserPhotos(userId);
      return photos;
    } catch (error) {
      throw new Error(`Failed to get user photos: ${error.message}`);
    }
  }

  async createUserIfNotExists(userId, userData = {}) {
    try {
      let user = await this.userModel.getUserById(userId);
      
      if (!user) {
        user = await this.userModel.createUser(userId, {
          ...userData,
          createdAt: new Date(),
          photos: []
        });
      }
      
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}

module.exports = UserService; 