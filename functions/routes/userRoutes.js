const express = require('express');
const UserController = require('../controllers/userController');
const { authenticate } = require('../middleware');

const router = express.Router();
const userController = new UserController();

/**
 * GET /user/profile
 * Get user profile
 */
router.get('/profile', authenticate, userController.getProfile.bind(userController));

module.exports = router; 