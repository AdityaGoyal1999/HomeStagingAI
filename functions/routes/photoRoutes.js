const express = require('express');
const PhotoController = require('../controllers/photoController');
const { authenticate, validateFileUpload, validateStyle } = require('../middleware');

const router = express.Router();
const photoController = new PhotoController();

/**
 * GET /photos
 * Get all photos for the authenticated user
 */
router.get('/', authenticate, photoController.getPhotos.bind(photoController));

/**
 * POST /photos/upload
 * Upload a new photo
 */
router.post('/upload', 
  authenticate, 
  validateFileUpload, 
  validateStyle, 
  photoController.uploadPhoto.bind(photoController)
);

/**
 * POST /photos/upload-and-stage
 * Upload a photo and generate AI-staged version
 */
router.post('/upload-and-stage', 
  authenticate, 
  validateFileUpload, 
  validateStyle, 
  photoController.uploadAndStagePhoto.bind(photoController)
);

/**
 * POST /photos/generate-variations
 * Generate multiple staged variations from an existing photo
 */
router.post('/generate-variations', 
  authenticate, 
  photoController.generateStagedVariations.bind(photoController)
);

/**
 * GET /photos/credit-costs
 * Get credit costs for different photo operations
 */
router.get('/credit-costs', 
  authenticate, 
  photoController.getCreditCosts.bind(photoController)
);

module.exports = router; 