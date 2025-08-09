const { getFirestore } = require('firebase-admin/firestore');

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
    await userRef.set(userData);
    return { id: userId, ...userData };
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


  // TODO: Check why we need this function
  async createUserIfNotExists(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      // Create a basic user record
      await this.createUser(userId, {
        createdAt: new Date(),
        updatedAt: new Date()
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
}

module.exports = UserModel; 