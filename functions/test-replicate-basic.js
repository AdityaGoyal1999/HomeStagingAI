// Basic test for Replicate API connection
require('dotenv').config();
const Replicate = require('replicate');

async function testBasicConnection() {
  try {
    console.log('=== Testing Replicate API Basic Connection ===');
    
    // Check if token is loaded
    console.log('1. Checking API token...');
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN not found in environment variables');
    }
    console.log('✅ API token loaded successfully');
    
    // Initialize Replicate
    console.log('2. Initializing Replicate client...');
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    console.log('✅ Replicate client initialized');
    
    // Test with a very simple model
    console.log('3. Testing with a simple model...');
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: "A simple test image",
          width: 256,
          height: 256,
        }
      }
    );
    
    console.log('4. API Response:');
    console.log('   Type:', typeof output);
    console.log('   Value:', output);
    
    if (output) {
      console.log('✅ Replicate API is working correctly!');
    } else {
      console.log('⚠️  API returned empty/null response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error details:', error);
  }
}

testBasicConnection(); 