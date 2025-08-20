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

/**
 * GET /user/credits
 * Get user credits
 */
router.get('/credits', authenticate, userController.getCredits.bind(userController));

/**
 * PUT /user/credits
 * Update user credits
 */
router.put('/credits', authenticate, userController.updateCredits.bind(userController));

/**
 * POST /user/create
 * Create new user profile
 */
router.post('/create', authenticate, userController.createUser.bind(userController));

module.exports = router; 