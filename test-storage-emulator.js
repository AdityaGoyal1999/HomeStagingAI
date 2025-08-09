import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testStorageEmulator() {
  try {
    console.log('Testing storage emulator...');
    
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
    
    // Test upload with a simple file
    console.log('Testing file upload...');
    
    // Create a simple test file
    const testFilePath = path.join(process.cwd(), 'test-image.txt');
    fs.writeFileSync(testFilePath, 'This is a test image file');
    
    const formData = new FormData();
    formData.append('files', fs.createReadStream(testFilePath), {
      filename: 'test-image.txt',
      contentType: 'text/plain'
    });
    formData.append('style', 'modern');
    
    try {
      const response = await axios.post(`${baseURL}/uploadPhoto`, formData, {
        headers: {
          'Authorization': 'Bearer test-token',
          ...formData.getHeaders()
        },
        timeout: 10000
      });
      
      console.log('✅ Upload successful');
      console.log('📸 Photo URL:', response.data.url);
      
      // Test if the URL is accessible
      try {
        const imageResponse = await axios.get(response.data.url, {
          timeout: 5000,
          responseType: 'text'
        });
        console.log('✅ Image URL is accessible');
        console.log('📄 Image content length:', imageResponse.data.length);
      } catch (imageError) {
        console.log('❌ Image URL is not accessible:', imageError.message);
        console.log('🔗 URL was:', response.data.url);
      }
      
    } catch (error) {
      console.log('❌ Upload failed:', error.response?.status, error.response?.data || error.message);
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    
  } catch (error) {
    console.error('Error testing storage emulator:', error.message);
  }
}

testStorageEmulator(); 