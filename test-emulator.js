import axios from 'axios';

async function testEmulator() {
  try {
    console.log('Testing emulator endpoints...');
    
    const baseURL = 'http://127.0.0.1:5001/homestaging-3aeee/us-central1/api';
    
    // Test if the emulator is running
    console.log('Testing if emulator is running...');
    try {
      const response = await axios.get(`${baseURL}/getProfile`, {
        headers: {
          'Authorization': 'Bearer test-token'
        },
        timeout: 5000
      });
      console.log('✅ Emulator is running');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Emulator is not running. Start it with: firebase emulators:start');
        return;
      }
      console.log('✅ Emulator is running (got expected auth error)');
    }
    
    // Test getProfile route specifically
    console.log('Testing getProfile route...');
    try {
      const response = await axios.get(`${baseURL}/getProfile`, {
        headers: {
          'Authorization': 'Bearer test-token'
        },
        timeout: 5000
      });
      console.log('✅ getProfile route is accessible, status:', response.status);
    } catch (error) {
      console.log('❌ getProfile route error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Test the uploadPhoto route specifically
    console.log('Testing uploadPhoto route...');
    // Note: FormData is not available in Node.js, so we'll test with a simple object
const testData = {
  photo: 'test',
  style: 'modern'
};
    
    try {
      const response = await axios.post(`${baseURL}/uploadPhoto`, testData, {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      console.log('✅ uploadPhoto route is accessible');
    } catch (error) {
      console.log('❌ uploadPhoto route error:', error.response?.status, error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Error testing emulator:', error.message);
  }
}

testEmulator(); 