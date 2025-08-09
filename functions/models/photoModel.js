class PhotoModel {
  constructor() {
    this.photoTypes = {
      USER: 'user',
      GENERATED: 'generated'
    };
  }

   createPhotoData(photoURL, type = 'user', style = null, relatedPhotoId = null) {
    return {
      photoURL,
      type,
      style,
      createdAt: new Date(),
      id: Date.now().toString(),
      relatedPhotoId: relatedPhotoId // Link to original photo if this is a staged version
    };
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