async function testEmulator() {
  try {
    console.log('Testing emulator endpoints...');
    
    const baseURL = 'http://127.0.0.1:5001/homestaging-3aeee/us-central1/api';
    
    // Test if the emulator is running
    console.log('Testing if emulator is running...');
    try {
      const response = await fetch(`${baseURL}/getProfile`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ Emulator is running, status:', response.status);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Emulator is not running. Start it with: firebase emulators:start');
        return;
      }
      console.log('✅ Emulator is running (got expected auth error)');
    }
    
    // Test the uploadPhoto route specifically
    console.log('Testing uploadPhoto route...');
    const testData = {
      photo: 'test',
      style: 'modern'
    };
    
    try {
      const response = await fetch(`${baseURL}/uploadPhoto`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      console.log('✅ uploadPhoto route is accessible, status:', response.status);
    } catch (error) {
      console.log('❌ uploadPhoto route error:', error.message);
    }
    
  } catch (error) {
    console.error('Error testing emulator:', error.message);
  }
}

testEmulator(); 