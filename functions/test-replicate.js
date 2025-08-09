// Test script for Replicate API integration
require('dotenv').config();
const ReplicateService = require('./services/replicateService');

async function testReplicateIntegration() {
  try {
    console.log('Testing Replicate API integration...');
    
    const replicateService = new ReplicateService();
    
    // Test with a sample image URL (you can replace this with any public image URL)
    const testImageUrl = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800';
    const style = 'modern';
    
    console.log('Generating staged image...');
    const result = await replicateService.generateStagedImage(testImageUrl, style);
    
    console.log('✅ Success! Generated staged image:');
    console.log('Result URL:', result);
    
    // Test multiple variations
    console.log('\nGenerating multiple variations...');
    const variations = await replicateService.generateMultipleVariations(testImageUrl, style, 2);
    
    console.log('✅ Success! Generated variations:');
    variations.forEach((url, index) => {
      console.log(`Variation ${index + 1}:`, url);
    });
    
  } catch (error) {
    console.error('❌ Error testing Replicate integration:', error.message);
    console.error('Make sure you have set the REPLICATE_API_TOKEN environment variable');
  }
}

// Run the test
testReplicateIntegration(); 