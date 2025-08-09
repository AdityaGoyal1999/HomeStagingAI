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
}

module.exports = UserController; 