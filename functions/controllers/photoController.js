const PhotoService = require('../services/photoService');

class PhotoController {
  constructor() {
    this.photoService = new PhotoService();
  }

  async getPhotos(req, res) {
    try {
      const userId = req.user.uid;
      const photos = await this.photoService.getUserPhotos(userId);
      
      res.status(200).json({ photos });
    } catch (error) {
      console.error('Error getting photos:', error);
      res.status(500).json({ error: 'Failed to get photos' });
    }
  }

  async uploadPhoto(req, res) {
    try {
      console.log("Files received:", req.files);
      console.log("Style received:", req.body.style);

      if (!req.files || req.files.length === 0 || !req.body.style) {
        return res.status(400).json({ error: "No file uploaded or style missing" });
      }

      const userId = req.user.uid;
      const file = req.files[0];
      const style = req.body.style;
      const roomType = req.body.roomType || 'living room';

      const result = await this.photoService.uploadPhoto(file, userId, style, roomType);

      res.status(200).json({ 
        original: {
          url: result.originalURL,
          data: result.originalPhotoData
        },
        staged: {
          url: result.stagedURL,
          data: result.stagedPhotoData
        },
        message: "Photo uploaded and staged successfully"
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      
      // Handle insufficient credits error specifically
      if (error.message.includes('Insufficient credits')) {
        return res.status(402).json({ 
          error: error.message,
          code: 'INSUFFICIENT_CREDITS',
          message: 'You need more credits to generate AI images. Please purchase more credits.'
        });
      }
      
      res.status(500).json({ error: error.message });
    }
  }

  async uploadAndStagePhoto(req, res) {
    try {
      console.log("Files received:", req.files);
      console.log("Style received:", req.body.style);

      if (!req.files || req.files.length === 0 || !req.body.style) {
        return res.status(400).json({ error: "No file uploaded or style missing" });
      }

      const userId = req.user.uid;
      const file = req.files[0];
      const style = req.body.style;

      // Upload original photo and generate staged version
      const result = await this.photoService.uploadAndStagePhoto(file, userId, style);

      res.status(200).json({
        original: result.original,
        staged: result.staged,
        message: "Photo uploaded and staged successfully"
      });
    } catch (error) {
      console.error("Error uploading and staging photo:", error);
      
      // Handle insufficient credits error specifically
      if (error.message.includes('Insufficient credits')) {
        return res.status(402).json({ 
          error: error.message,
          code: 'INSUFFICIENT_CREDITS',
          message: 'You need more credits to generate AI images. Please purchase more credits.'
        });
      }
      
      res.status(500).json({ error: error.message });
    }
  }

  async generateStagedVariations(req, res) {
    try {
      const { originalPhotoURL, style = 'modern', count = 3 } = req.body;
      const userId = req.user.uid;

      if (!originalPhotoURL) {
        return res.status(400).json({ error: "Original photo URL is required" });
      }

      // Generate multiple staged variations
      const variations = await this.photoService.generateMultipleStagedVariations(
        originalPhotoURL, 
        userId, 
        style, 
        parseInt(count)
      );

      res.status(200).json({
        variations,
        message: `Generated ${variations.length} staged variations`
      });
    } catch (error) {
      console.error("Error generating variations:", error);
      
      // Handle insufficient credits error specifically
      if (error.message.includes('Insufficient credits')) {
        return res.status(402).json({ 
          error: error.message,
          code: 'INSUFFICIENT_CREDITS',
          message: 'You need more credits to generate AI images. Please purchase more credits.'
        });
      }
      
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get credit costs for different photo operations
   */
  async getCreditCosts(req, res) {
    try {
      const creditCosts = this.photoService.getCreditCosts();
      
      res.status(200).json({
        success: true,
        creditCosts
      });
    } catch (error) {
      console.error("Error getting credit costs:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PhotoController; 