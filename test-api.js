// Simple test script to check API accessibility
const axios = require('axios');

async function testAPI() {
  try {
    // Test the environment variable
    console.log('Testing API endpoints...');
    
    // Test if the functions are accessible
    const baseURL = 'https://us-central1-homestaging-3aeee.cloudfunctions.net/api';
    
    console.log('Testing GET /getProfile...');
    const response = await axios.get(`${baseURL}/getProfile`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Response:', response.status);
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

testAPI(); 