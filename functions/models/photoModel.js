const { randomUUID } = require('crypto');
const { Timestamp } = require('firebase-admin/firestore');

class PhotoModel {
  constructor() {
    this.photoTypes = {
      USER: 'user',
      GENERATED: 'generated'
    };
  }

   createPhotoData(photoURL, type = 'user', style = null, relatedPhotoId = null) {
    // Validate photoURL
    if (!photoURL || typeof photoURL !== 'string') {
      throw new Error('photoURL must be a non-empty string');
    }

    // Basic URL validation
    try {
      new URL(photoURL);
    } catch (error) {
      throw new Error(`Invalid photoURL format: ${photoURL}`);
    }

    // Validate type
    if (!Object.values(this.photoTypes).includes(type)) {
      throw new Error(`Invalid photo type: ${type}. Must be one of: ${Object.values(this.photoTypes).join(', ')}`);
    }

    // Validate style (can be null or a valid style)
    if (style !== null && style !== undefined) {
      const { ALLOWED_STYLES } = require('../utils/constants');
      if (!ALLOWED_STYLES.includes(style)) {
        throw new Error(`Invalid style: ${style}. Must be one of: ${ALLOWED_STYLES.join(', ')} or null`);
      }
    }

    // Validate relatedPhotoId (can be null or a valid string)
    if (relatedPhotoId !== null && relatedPhotoId !== undefined) {
      if (typeof relatedPhotoId !== 'string' || relatedPhotoId.trim() === '') {
        throw new Error('relatedPhotoId must be a non-empty string or null');
      }
    }

    // Generate UUID and validate it
    const id = randomUUID();
    if (!id || typeof id !== 'string' || id.length !== 36) {
      throw new Error('Failed to generate valid UUID for photo');
    }

    const base = {
      photoURL,
      type,
      style,
      createdAt: Timestamp.now(),
      id,
      relatedPhotoId: relatedPhotoId // Link to original photo if this is a staged version
    };

    // For original user photos, include a nested array to store generated image URLs
    if (type === 'user') {
      return { ...base, generatedUrls: [] };
    }

    // For generated photos, ensure generatedUrls is initialized as an empty array
    return { ...base, generatedUrls: [] };
  }

  validatePhotoData(photoData) {
    const required = ['photoURL', 'type', 'createdAt'];
    const missing = required.filter(field => !photoData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }
}

module.exports = PhotoModel; 