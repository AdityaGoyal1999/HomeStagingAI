const UserModel = require('../models/userModel');
const { Timestamp } = require('firebase-admin/firestore');

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

  async getUserCredits(userId) {
    try {
      const credits = await this.userModel.getUserCredits(userId);
      return credits;
    } catch (error) {
      throw new Error(`Failed to get user credits: ${error.message}`);
    }
  }

  async updateUserCredits(userId, newCredits) {
    try {
      const result = await this.userModel.updateUserCredits(userId, newCredits);
      return result;
    } catch (error) {
      throw new Error(`Failed to update user credits: ${error.message}`);
    }
  }

  async createUserIfNotExists(userId, userData = {}) {
    try {
      let user = await this.userModel.getUserById(userId);
      
      if (!user) {
        user = await this.userModel.createUser(userId, {
          ...userData,
          createdAt: Timestamp.now(),
          photos: [],
          credits: 0 // Default credits value
        });
      }
      
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}

module.exports = UserService; 