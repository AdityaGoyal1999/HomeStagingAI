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
    console.log('Using emulator storage bucket');
    return storage.bucket();
  }

  // Resolve bucket: prefer explicit arg, then FIREBASE_CONFIG.storageBucket, otherwise default bucket
  let resolvedBucket = bucketName;
  if (!resolvedBucket && process.env.FIREBASE_CONFIG) {
    try {
      const cfg = JSON.parse(process.env.FIREBASE_CONFIG);
      resolvedBucket = cfg.storageBucket || undefined;
    } catch (_) {}
  }

  if (resolvedBucket) {
    console.log('Using production storage bucket:', resolvedBucket);
    return storage.bucket(resolvedBucket);
  }

  console.log('Using production default storage bucket');
  return storage.bucket();
};

module.exports = {
  initializeStorage,
  getBucket,
  getStorage
}; 