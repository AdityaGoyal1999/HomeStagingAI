// Debug script to show emulator environment variables
console.log('=== Firebase Emulator Environment Detection ===\n');

// Check for emulator environment variables
const envVars = {
  'FUNCTIONS_EMULATOR': process.env.FUNCTIONS_EMULATOR,
  'FIRESTORE_EMULATOR_HOST': process.env.FIRESTORE_EMULATOR_HOST,
  'FIREBASE_STORAGE_EMULATOR_HOST': process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  'FIREBASE_AUTH_EMULATOR_HOST': process.env.FIREBASE_AUTH_EMULATOR_HOST,
  'FIREBASE_DATABASE_EMULATOR_HOST': process.env.FIREBASE_DATABASE_EMULATOR_HOST
};

console.log('Environment Variables:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}: ${value || 'undefined'}`);
});

console.log('\n=== Detection Logic ===');

// The detection logic we use in the code
const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true' || 
                   process.env.FIRESTORE_EMULATOR_HOST || 
                   process.env.FIREBASE_STORAGE_EMULATOR_HOST;

console.log('Is Emulator Detected:', isEmulator);

console.log('\n=== How Firebase Sets These Variables ===');
console.log('When you run: firebase emulators:start');
console.log('Firebase automatically sets these environment variables:');
console.log('- FUNCTIONS_EMULATOR=true (when functions emulator is running)');
console.log('- FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 (when storage emulator is running)');
console.log('- FIRESTORE_EMULATOR_HOST=127.0.0.1:8081 (when firestore emulator is running)');
console.log('- FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 (when auth emulator is running)');

console.log('\n=== Testing Different Scenarios ===');

// Test different scenarios
const scenarios = [
  { name: 'Production', env: {} },
  { name: 'Functions Emulator Only', env: { FUNCTIONS_EMULATOR: 'true' } },
  { name: 'Storage Emulator Only', env: { FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199' } },
  { name: 'Full Emulator Suite', env: { 
    FUNCTIONS_EMULATOR: 'true',
    FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8081'
  }}
];

scenarios.forEach(scenario => {
  const originalEnv = { ...process.env };
  
  // Temporarily set environment variables for testing
  Object.entries(scenario.env).forEach(([key, value]) => {
    process.env[key] = value;
  });
  
  const testIsEmulator = process.env.FUNCTIONS_EMULATOR === 'true' || 
                         process.env.FIRESTORE_EMULATOR_HOST || 
                         process.env.FIREBASE_STORAGE_EMULATOR_HOST;
  
  console.log(`${scenario.name}: ${testIsEmulator ? '✅ Emulator' : '❌ Production'}`);
  
  // Restore original environment
  Object.keys(scenario.env).forEach(key => {
    delete process.env[key];
  });
  Object.entries(originalEnv).forEach(([key, value]) => {
    process.env[key] = value;
  });
}); 