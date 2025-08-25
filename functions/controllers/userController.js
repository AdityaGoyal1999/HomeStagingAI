const UserService = require('../services/userService');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.uid;
      const user = await this.userService.getUserProfile(userId);
      
      res.status(200).json({
        user
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(404).json({
        error: error.message
      });
    }
  }

  async getCredits(req, res) {
    try {
      const userId = req.user.uid;
      const credits = await this.userService.getUserCredits(userId);
      
      res.status(200).json({
        credits
      });
    } catch (error) {
      console.error('Error getting user credits:', error);
      res.status(500).json({
        error: error.message
      });
    }
  }

  async updateCredits(req, res) {
    try {
      const userId = req.user.uid;
      const { credits } = req.body;
      
      if (typeof credits !== 'number' || credits < 0) {
        return res.status(400).json({
          error: 'Credits must be a non-negative number'
        });
      }
      
      const result = await this.userService.updateUserCredits(userId, credits);
      
      res.status(200).json({
        message: 'Credits updated successfully',
        credits: result.credits
      });
    } catch (error) {
      console.error('Error updating user credits:', error);
      res.status(500).json({
        error: error.message
      });
    }
  }

  async createUser(req, res) {
    try {
      const userId = req.user.uid;
      const userData = req.body;
      
      // Create user with all defaults applied
      const user = await this.userService.createUserIfNotExists(userId, userData);
      
      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = UserController; 