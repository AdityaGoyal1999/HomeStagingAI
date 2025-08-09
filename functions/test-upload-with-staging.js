// Test for automatic staging on photo upload
require('dotenv').config();
const PhotoService = require('./services/photoService');
const fs = require('fs');
const path = require('path');

async function testUploadWithStaging() {
  try {
    console.log('=== Testing Automatic Photo Upload with Staging ===');
    
    const photoService = new PhotoService();
    const userId = 'test-user-' + Date.now();
    const style = 'modern';
    
    // Create a mock file object (simulating what multer would provide)
    const mockFile = {
      originalname: 'test-room.jpg',
      mimetype: 'image/jpeg',
      buffer: fs.readFileSync(path.join(__dirname, 'test-image.jpg')), // You'll need a test image
      size: 1024
    };
    
    console.log('1. Uploading photo with automatic staging...');
    const result = await photoService.uploadPhoto(mockFile, userId, style);
    
    console.log('2. Results:');
    console.log('   Original URL:', result.originalURL);
    console.log('   Staged URL:', result.stagedURL);
    console.log('   Original Data:', result.originalPhotoData);
    console.log('   Staged Data:', result.stagedPhotoData);
    
    console.log('✅ Success! Photo uploaded and staged automatically');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // If no test image exists, create a simple test
    if (error.message.includes('ENOENT')) {
      console.log('⚠️  No test image found. Creating a simple API test...');
      await testAPIEndpoint();
    }
  }
}

async function testAPIEndpoint() {
  try {
    console.log('Testing API endpoint with mock data...');
    
    // This would test the actual API endpoint
    // For now, just show the expected response format
    console.log('Expected API Response Format:');
    console.log(JSON.stringify({
      original: {
        url: "https://storage.googleapis.com/.../original.jpg",
        data: {
          photoURL: "https://storage.googleapis.com/.../original.jpg",
          type: "user",
          style: "modern",
          createdAt: new Date(),
          id: "1234567890"
        }
      },
      staged: {
        url: "https://replicate.delivery/.../staged.png",
        data: {
          photoURL: "https://replicate.delivery/.../staged.png",
          type: "ai-generated",
          style: "modern",
          createdAt: new Date(),
          id: "1234567891",
          relatedPhotoId: "1234567890"
        }
      },
      message: "Photo uploaded and staged successfully"
    }, null, 2));
    
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
}

testUploadWithStaging(); 