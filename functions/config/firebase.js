const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

// Firebase initialization
const initializeFirebase = () => {
  // Try to pass storageBucket if available to ensure default bucket is set
  let options = undefined;
  if (process.env.FIREBASE_CONFIG) {
    try {
      const cfg = JSON.parse(process.env.FIREBASE_CONFIG);
      if (cfg.storageBucket) {
        options = { storageBucket: cfg.storageBucket };
      }
    } catch (_) {}
  }

  const app = initializeApp(options);
  
  // Initialize storage
  const storage = getStorage(app);

  getStorage(app);
  
  // Set emulator host if running in emulator
  if (process.env.FUNCTIONS_EMULATOR === 'true' || 
      process.env.FIRESTORE_EMULATOR_HOST || 
      process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
    // The emulator will automatically handle the storage configuration
    console.log('Running in Firebase emulator mode');
  }
  
  return app;
};

module.exports = {
  initializeFirebase
}; 