const { getFirestore, Timestamp } = require('firebase-admin/firestore');

class UserModel {
  constructor() {
    this.collection = 'users';
  }
  
  get db() {
    return getFirestore();
  }

  async getUserById(userId) {
    const userRef = this.db.collection(this.collection).doc(userId);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  async createUser(userId, userData) {
    const userRef = this.db.collection(this.collection).doc(userId);
    
    // Ensure credits field has a default value
    const userDataWithDefaults = {
      credits: 0, // Default credits value
      ...userData
    };

    console.log("🔍 User data with defaults:", userDataWithDefaults);
    
    await userRef.set(userDataWithDefaults);
    return { id: userId, ...userDataWithDefaults };
  }

  async updateUser(userId, updateData) {
    const userRef = this.db.collection(this.collection).doc(userId);
    await userRef.update(updateData);
    return { id: userId, ...updateData };
  }

  async getUserPhotos(userId) {
    const user = await this.getUserById(userId);
    return user?.photos || [];
  }

  async getUserCredits(userId) {
    const user = await this.getUserById(userId);
    return user?.credits || 0;
  }

  async updateUserCredits(userId, newCredits) {
    const userRef = this.db.collection(this.collection).doc(userId);
    await userRef.update({ credits: newCredits });
    return { id: userId, credits: newCredits };
  }


  // TODO: Check why we need this function
  async createUserIfNotExists(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      // Create a basic user record
      await this.createUser(userId, {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        credits: 0 // Default credits value
      });
    }
    return user;
  }

  async addPhotoToUser(userId, photoData) {
    const userRef = this.db.collection(this.collection).doc(userId);
    const userDoc = await userRef.get();
    
    let userData = userDoc.exists ? userDoc.data() : {};
    let photos = userData.photos || [];
    
    photos.push(photoData);
    
    await userRef.set({ ...userData, photos }, { merge: true });
    return photos;
  }

  /**
   * Append a generated image URL to the nested generatedUrls array
   * under the original photo identified by originalPhotoId
   */
  async appendGeneratedUrlToPhoto(userId, originalPhotoId, generatedUrl) {
    console.log("This is the userId", userId);
    console.log("This is the originalPhotoId", originalPhotoId);
    console.log("This is the generatedUrl", generatedUrl);

    const userRef = this.db.collection(this.collection).doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const photos = Array.isArray(userData.photos) ? [...userData.photos] : [];

    const idx = photos.findIndex(p => p.id === originalPhotoId);
    if (idx === -1) {
      throw new Error('Original photo not found');
    }

    const target = photos[idx];
    const updatedGenerated = Array.isArray(target.generatedUrls) ? [...target.generatedUrls, generatedUrl] : [generatedUrl];

    photos[idx] = { ...target, generatedUrls: updatedGenerated };

    await userRef.set({ ...userData, photos }, { merge: true });
    return photos[idx];
  }
}

module.exports = UserModel; 