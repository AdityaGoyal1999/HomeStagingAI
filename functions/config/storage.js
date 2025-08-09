const { getStorage } = require('firebase-admin/storage');
const EmulatorDetector = require('../utils/emulatorDetector');

// Storage configuration and initialization
const initializeStorage = () => {
  return getStorage();
};

const getBucket = (bucketName) => {
  const storage = getStorage();
  const emulatorDetector = new EmulatorDetector();
  
  if (emulatorDetector.isEmulator) {
    // In emulator, use the default bucket
    console.log('Using emulator storage bucket');
    return storage.bucket();
  } else {
    // In production, use the specified bucket name
    console.log('Using production storage bucket:', bucketName);
    return storage.bucket(bucketName);
  }
};

module.exports = {
  initializeStorage,
  getBucket,
  getStorage
}; 