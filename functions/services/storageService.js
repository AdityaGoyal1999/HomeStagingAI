const { getBucket } = require('../config/storage');
const PhotoModel = require('../models/photoModel');
const EmulatorDetector = require('../utils/emulatorDetector');

class StorageService {
  constructor() {
    this.emulatorDetector = new EmulatorDetector();
    // Resolve at runtime; allow config/storage.js to fall back to FIREBASE_CONFIG or default bucket
    this.bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    
    // Log emulator status for debugging
    if (this.emulatorDetector.isEmulator) {
      this.emulatorDetector.logStatus();
    }
  }
  
  get photoModel() {
    return new PhotoModel();
  }

  async uploadFile(file, userId) {
    try {
      const bucket = getBucket(this.bucketName);
      const filePath = `images/${userId}/${Date.now()}-${file.originalname}`;
      const blob = bucket.file(filePath);
      
      return new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on("error", (err) => {
          console.error("Blob stream error:", err);
          reject(new Error(err.message));
        });

        blobStream.on("finish", async () => {
          try {
            // Make the file public
            await blob.makePublic();

            // Construct the public URL based on environment
            const photoURL = this.emulatorDetector.getStorageURL(bucket.name, blob.name);
            
            console.log(`File uploaded successfully. URL: ${photoURL}`);
            resolve(photoURL);
          } catch (error) {
            reject(new Error(`Failed to make file public: ${error.message}`));
          }
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  createPhotoData(photoURL, type = 'user', style = null) {
    return this.photoModel.createPhotoData(photoURL, type, style);
  }

  validatePhotoData(photoData) {
    return this.photoModel.validatePhotoData(photoData);
  }
}

module.exports = StorageService; 