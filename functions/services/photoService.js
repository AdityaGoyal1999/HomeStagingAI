const UserModel = require('../models/userModel');
const StorageService = require('./storageService');
const ReplicateService = require('./replicateService');

class PhotoService {
  constructor() {
    this.userModel = new UserModel();
    this.storageService = new StorageService();
    this.replicateService = new ReplicateService();
  }

  async uploadPhoto(file, userId, style) {
    try {
      // Validate input
      if (!file || !style) {
        throw new Error('File and style are required');
      }

      // Step 1: Upload original file to Firebase Storage
      console.log('Step 1: Uploading to Firebase Storage...');
      const originalPhotoURL = await this.storageService.uploadFile(file, userId);

      // Create original photo data
      const originalPhotoData = this.storageService.createPhotoData(originalPhotoURL, 'user', style);

      // Validate photo data
      this.storageService.validatePhotoData(originalPhotoData);

      // Add original photo to user's photos
      await this.userModel.addPhotoToUser(userId, originalPhotoData);

      // Step 2: Send image buffer directly to Replicate (not the URL)
      console.log('Step 2: Generating staged version with Replicate...');
      let stagedImageURL = null;
      let stagedPhotoData = null;
      
      try {
        stagedImageURL = await this.replicateService.generateStagedImageFromBuffer(file.buffer, style);
        stagedImageURL = stagedImageURL.href;
        console.log('✅ Staged image generated successfully:', stagedImageURL);

        if (!stagedImageURL) {
          throw new Error('Staged image URL is null');
        }

        // Create staged photo data with link to original
        // stagedPhotoData = this.storageService.createPhotoData(stagedImageURL, 'generated', style, originalPhotoData.id);
        // console.log('✅ Staged photo data created:', stagedPhotoData);

        // Validate staged photo data
        // this.storageService.validatePhotoData(stagedPhotoData);
        // console.log('✅ Staged photo data validated');

        // Add staged photo to user's photos
        // await this.userModel.addPhotoToUser(userId, stagedPhotoData);
        // console.log('✅ Staged photo saved to Firestore');

        // Also append the generated URL to the original photo's nested array for easy retrieval
        await this.userModel.appendGeneratedUrlToPhoto(userId, originalPhotoData.id, stagedImageURL);
        console.log('✅ Appended generated URL to original photo');
      } catch (stagingError) {
        console.error('❌ Error during staging:', stagingError.message);
        // Continue with original photo only if staging fails
      }

      return { 
        originalURL: originalPhotoURL, 
        originalPhotoData,
        stagedURL: stagedImageURL,
        stagedPhotoData: stagedPhotoData
      };
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error.message}`);
    }
  }

  async generateStagedImage(originalPhotoURL, userId, style = 'modern', relatedPhotoId = null) {
    try {
      console.log('Starting AI staging process...');

      // Generate staged image using Replicate
      const stagedImageURL = await this.replicateService.generateStagedImage(originalPhotoURL, style);

      // Create staged photo data with link to original
      const stagedPhotoData = this.storageService.createPhotoData(stagedImageURL, 'ai-generated', style, relatedPhotoId);

      // Validate staged photo data
      this.storageService.validatePhotoData(stagedPhotoData);

      // Add staged photo to user's photos
      await this.userModel.addPhotoToUser(userId, stagedPhotoData);

      return { stagedURL: stagedImageURL, stagedPhotoData };
    } catch (error) {
      throw new Error(`Failed to generate staged image: ${error.message}`);
    }
  }

  async uploadAndStagePhoto(file, userId, style) {
    try {
      // First upload the original photo
      const { originalURL, originalPhotoData } = await this.uploadPhoto(file, userId, style);

      // Then generate the staged version
      const { stagedURL, stagedPhotoData } = await this.generateStagedImage(originalURL, userId, style);

      return {
        original: { url: originalURL, data: originalPhotoData },
        staged: { url: stagedURL, data: stagedPhotoData }
      };
    } catch (error) {
      throw new Error(`Failed to upload and stage photo: ${error.message}`);
    }
  }

  async generateMultipleStagedVariations(originalPhotoURL, userId, style = 'modern', count = 3) {
    try {
      console.log(`Generating ${count} staged variations...`);

      // Generate multiple variations
      const stagedImageURLs = await this.replicateService.generateMultipleVariations(originalPhotoURL, style, count);

      const variations = [];

      // Save each variation
      for (const stagedURL of stagedImageURLs) {
        const stagedPhotoData = this.storageService.createPhotoData(stagedURL, 'ai-generated', style);
        this.storageService.validatePhotoData(stagedPhotoData);
        await this.userModel.addPhotoToUser(userId, stagedPhotoData);
        
        variations.push({ url: stagedURL, data: stagedPhotoData });
      }

      return variations;
    } catch (error) {
      throw new Error(`Failed to generate variations: ${error.message}`);
    }
  }

  async getUserPhotos(userId) {
    try {
      // Ensure user exists
      await this.userModel.createUserIfNotExists(userId);
      
      // Get user's photos
      const photos = await this.userModel.getUserPhotos(userId);
      
      return photos;
    } catch (error) {
      throw new Error(`Failed to get user photos: ${error.message}`);
    }
  }
}

module.exports = PhotoService; 