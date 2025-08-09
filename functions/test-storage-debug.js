// Debug script to test Firestore storage
require('dotenv').config();
const PhotoService = require('./services/photoService');
const UserModel = require('./models/userModel');

async function testStorageDebug() {
  try {
    console.log('=== Testing Firestore Storage Debug ===');
    
    const photoService = new PhotoService();
    const userModel = new UserModel();
    const userId = 'test-user-' + Date.now();
    const style = 'modern';
    
    // Create a mock file object
    const mockFile = {
      originalname: 'test-room.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
      size: 1024
    };
    
    console.log('1. Testing photo upload with staging...');
    const result = await photoService.uploadPhoto(mockFile, userId, style);
    
    console.log('2. Upload result:');
    console.log('   Original URL:', result.originalURL);
    console.log('   Staged URL:', result.stagedURL);
    console.log('   Original Data:', result.originalPhotoData);
    console.log('   Staged Data:', result.stagedPhotoData);
    
    console.log('3. Checking Firestore storage...');
    const userPhotos = await userModel.getUserPhotos(userId);
    
    console.log('4. Photos in Firestore:');
    console.log('   Total photos:', userPhotos.length);
    userPhotos.forEach((photo, index) => {
      console.log(`   Photo ${index + 1}:`);
      console.log(`     URL: ${photo.photoURL}`);
      console.log(`     Type: ${photo.type}`);
      console.log(`     Style: ${photo.style}`);
      console.log(`     ID: ${photo.id}`);
      console.log(`     Related ID: ${photo.relatedPhotoId || 'none'}`);
    });
    
    // Count by type
    const originalCount = userPhotos.filter(p => p.type === 'user').length;
    const stagedCount = userPhotos.filter(p => p.type === 'ai-generated').length;
    
    console.log('5. Summary:');
    console.log(`   Original photos: ${originalCount}`);
    console.log(`   Staged photos: ${stagedCount}`);
    
    if (stagedCount === 0) {
      console.log('❌ WARNING: No staged photos found in Firestore!');
    } else {
      console.log('✅ Staged photos are being stored correctly');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testStorageDebug(); 