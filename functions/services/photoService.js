const UserModel = require('../models/userModel');
const StorageService = require('./storageService');
const ReplicateService = require('./replicateService');
const https = require('https');
const { Readable } = require('stream');

class PhotoService {
  constructor() {
    this.userModel = new UserModel();
    this.storageService = new StorageService();
    this.replicateService = new ReplicateService();
  }

  // Helper method to download image from URL and convert to buffer
  async downloadImageAsBuffer(imageUrl) {
    return new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        response.on('error', reject);
      }).on('error', reject);
    });
  }

  // Helper method to create a file-like object from buffer
  createFileFromBuffer(buffer, filename, mimetype) {
    return {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length
    };
  }

  async uploadPhoto(file, userId, style, roomType) {
    try {
      // Validate input
      if (!file || !style) {
        throw new Error('File and style are required');
      }

      // Check if user has sufficient credits before starting generation
      await this.checkSufficientCredits(userId);
      console.log('✅ User has sufficient credits for AI generation');

      // Step 1: Upload original file to Firebase Storage
      console.log('Step 1: Uploading to Firebase Storage...');
      const originalPhotoURL = await this.storageService.uploadFile(file, userId);

      // Create original photo data
      const originalPhotoData = this.storageService.createPhotoData(originalPhotoURL, 'user', style);

      // Validate photo data
      this.storageService.validatePhotoData(originalPhotoData);

      // Add original photo to user's photos
      await this.userModel.addPhotoToUser(userId, originalPhotoData);

      // Step 2: Generate staged version with Replicate
      console.log('Step 2: Generating staged version with Replicate...');
      let stagedImageURL = null;
      let stagedPhotoData = null;
      
      try {
        // Generate staged image
        const replicateImageUrl = await this.replicateService.generateStagedImageFromBuffer(file.buffer, style, roomType);

        if (!replicateImageUrl) {
          throw new Error('Staged image URL is null');
        }

        // Step 3: Download the generated image from Replicate before it expires
        console.log('Step 3: Downloading generated image from Replicate...');
        const imageBuffer = await this.downloadImageAsBuffer(replicateImageUrl);
        console.log('✅ Image downloaded from Replicate, size:', imageBuffer.length);

        // Step 4: Upload the downloaded image to Firebase Storage for permanent storage
        console.log('Step 4: Uploading staged image to Firebase Storage...');
        const stagedFile = this.createFileFromBuffer(imageBuffer, `staged_${Date.now()}.jpg`, 'image/jpeg');
        const permanentStagedImageURL = await this.storageService.uploadFile(stagedFile, userId);
        console.log('✅ Staged image uploaded to Firebase Storage:', permanentStagedImageURL);

        // Create staged photo data with permanent URL
        stagedPhotoData = this.storageService.createPhotoData(permanentStagedImageURL, 'generated', style, originalPhotoData.id);
        console.log('✅ Staged photo data created:', stagedPhotoData);

        // Validate staged photo data
        this.storageService.validatePhotoData(stagedPhotoData);
        console.log('✅ Staged photo data validated');

        // Add staged photo to user's photos
        // await this.userModel.addPhotoToUser(userId, stagedPhotoData);
        // console.log('✅ Staged photo saved to Firestore');

        // Also append the permanent generated URL to the original photo's nested array for easy retrieval
        await this.userModel.appendGeneratedUrlToPhoto(userId, originalPhotoData.id, permanentStagedImageURL);
        console.log('✅ Appended permanent generated URL to original photo');

        // Deduct credits for successful AI generation
        await this.deductCreditsForGeneration(userId);
        console.log('✅ Credits deducted for AI generation');

        stagedImageURL = permanentStagedImageURL;
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

  /**
   * Check if user has sufficient credits for AI generation
   * @param {string} userId - User ID
   * @param {number} requiredCredits - Number of credits required (default: 1)
   */
  async checkSufficientCredits(userId, requiredCredits = 1) {
    try {
      // Import UserService to manage user credits
      const UserService = require('./userService');
      const userService = new UserService();
      
      // Get current user credits
      const currentCredits = await userService.getUserCredits(userId);
      
      if (currentCredits < requiredCredits) {
        throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${currentCredits}`);
      }
      
      console.log(`✅ User ${userId} has sufficient credits: ${currentCredits} >= ${requiredCredits}`);
      return currentCredits;
    } catch (error) {
      console.error('❌ Error checking credits:', error);
      throw new Error(`Failed to check credits: ${error.message}`);
    }
  }

  /**
   * Deduct credits from user for AI generation
   * @param {string} userId - User ID
   * @param {number} creditCost - Number of credits to deduct (default: 1)
   */
  async deductCreditsForGeneration(userId, creditCost = 5) {
    try {
      // Import UserService to manage user credits
      const UserService = require('./userService');
      const userService = new UserService();
      
      // Get current user credits
      const currentCredits = await userService.getUserCredits(userId);
      
      if (currentCredits < creditCost) {
        throw new Error(`Insufficient credits. Required: ${creditCost}, Available: ${currentCredits}`);
      }
      
      // Calculate new credits
      const newCredits = currentCredits - creditCost;
      
      // Update user credits
      await userService.updateUserCredits(userId, newCredits);
      
      console.log(`✅ Deducted ${creditCost} credit(s) from user ${userId}. New balance: ${newCredits}`);
      
      return newCredits;
    } catch (error) {
      console.error('❌ Error deducting credits:', error);
      throw new Error(`Failed to deduct credits: ${error.message}`);
    }
  }

  async generateStagedImage(originalPhotoURL, userId, style = 'modern', relatedPhotoId = null) {
    try {
      console.log('Starting AI staging process...');

      // Check if user has sufficient credits before starting generation
      await this.checkSufficientCredits(userId);
      console.log('✅ User has sufficient credits for AI generation');

      // Generate staged image using Replicate
      const replicateImageUrl = await this.replicateService.generateStagedImage(originalPhotoURL, style);
      console.log('✅ Staged image generated by Replicate:', replicateImageUrl);

      if (!replicateImageUrl) {
        throw new Error('Staged image URL is null');
      }

      // Download the generated image from Replicate before it expires
      console.log('Downloading generated image from Replicate...');
      const imageBuffer = await this.downloadImageAsBuffer(replicateImageUrl);
      console.log('✅ Image downloaded from Replicate, size:', imageBuffer.length);

      // Upload the downloaded image to Firebase Storage for permanent storage
      console.log('Uploading staged image to Firebase Storage...');
      const stagedFile = this.createFileFromBuffer(imageBuffer, `staged_${Date.now()}.jpg`, 'image/jpeg');
      const permanentStagedImageURL = await this.storageService.uploadFile(stagedFile, userId);
      console.log('✅ Staged image uploaded to Firebase Storage:', permanentStagedImageURL);

      // Create staged photo data with permanent URL
      const stagedPhotoData = this.storageService.createPhotoData(permanentStagedImageURL, 'ai-generated', style, relatedPhotoId);

      // Validate staged photo data
      this.storageService.validatePhotoData(stagedPhotoData);

      // Add staged photo to user's photos
      await this.userModel.addPhotoToUser(userId, stagedPhotoData);

      // Deduct credits for successful AI generation
      await this.deductCreditsForGeneration(userId);
      console.log('✅ Credits deducted for AI generation');

      return { stagedURL: permanentStagedImageURL, stagedPhotoData };
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

      // Note: Credits are deducted in both uploadPhoto and generateStagedImage methods
      // So this method doesn't need additional credit deduction

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

      // Check if user has sufficient credits for all variations
      await this.checkSufficientCredits(userId, count);
      console.log(`✅ User has sufficient credits for ${count} variations`);

      // Generate multiple variations
      const replicateImageURLs = await this.replicateService.generateMultipleVariations(originalPhotoURL, style, count);

      const variations = [];

      // Process each variation
      for (let i = 0; i < replicateImageURLs.length; i++) {
        const replicateImageUrl = replicateImageURLs[i];
        console.log(`Processing variation ${i + 1}/${replicateImageURLs.length}...`);

        try {
          // Download the generated image from Replicate before it expires
          const imageBuffer = await this.downloadImageAsBuffer(replicateImageUrl);
          console.log(`✅ Variation ${i + 1} downloaded from Replicate, size:`, imageBuffer.length);

          // Upload the downloaded image to Firebase Storage for permanent storage
          const stagedFile = this.createFileFromBuffer(imageBuffer, `variation_${i + 1}_${Date.now()}.jpg`, 'image/jpeg');
          const permanentStagedImageURL = await this.storageService.uploadFile(stagedFile, userId);
          console.log(`✅ Variation ${i + 1} uploaded to Firebase Storage:`, permanentStagedImageURL);

          // Create staged photo data with permanent URL
          const stagedPhotoData = this.storageService.createPhotoData(permanentStagedImageURL, 'ai-generated', style);
          this.storageService.validatePhotoData(stagedPhotoData);
          await this.userModel.addPhotoToUser(userId, stagedPhotoData);
          
          // Deduct credits for successful AI generation
          await this.deductCreditsForGeneration(userId);
          console.log(`✅ Credits deducted for variation ${i + 1}`);
          
          variations.push({ url: permanentStagedImageURL, data: stagedPhotoData });
        } catch (variationError) {
          console.error(`❌ Error processing variation ${i + 1}:`, variationError.message);
          // Continue with other variations if one fails
        }
      }

      console.log(`✅ Successfully processed ${variations.length}/${count} variations`);
      return variations;
    } catch (error) {
      throw new Error(`Failed to generate variations: ${error.message}`);
    }
  }

  /**
   * Get credit costs for different operations
   * @returns {Object} Credit costs for different operations
   */
  getCreditCosts() {
    return {
      singleGeneration: 5,
      multipleVariations: 5, // per variation
      uploadAndStage: 5, // 1 for upload + 1 for generation
      description: 'Credits are deducted per AI generation operation'
    };
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