import { execSync } from 'child_process';
import fs from 'fs';

console.log('=== Firebase Emulator Environment Detection Test ===\n');

// Function to run the debug script
function runDebugScript() {
  try {
    const result = execSync('node debug-emulator-env.js', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    console.log(result);
  } catch (error) {
    console.error('Error running debug script:', error.message);
  }
}

// Function to check if emulator is running
function checkEmulatorStatus() {
  console.log('=== Checking Emulator Status ===');
  
  try {
    // Check if functions emulator is running
    const functionsCheck = execSync('curl -s http://127.0.0.1:5001/homestaging-3aeee/us-central1/api/getProfile', { 
      encoding: 'utf8',
      timeout: 3000
    });
    console.log('✅ Functions emulator is running');
  } catch (error) {
    console.log('❌ Functions emulator is not running');
  }
  
  try {
    // Check if storage emulator is running
    const storageCheck = execSync('curl -s http://127.0.0.1:9199', { 
      encoding: 'utf8',
      timeout: 3000
    });
    console.log('✅ Storage emulator is running');
  } catch (error) {
    console.log('❌ Storage emulator is not running');
  }
}

// Function to show how to start emulator
function showEmulatorInstructions() {
  console.log('\n=== How to Start Emulator ===');
  console.log('1. Start all emulators:');
  console.log('   firebase emulators:start');
  console.log('');
  console.log('2. Start specific emulators:');
  console.log('   firebase emulators:start --only functions,storage');
  console.log('');
  console.log('3. Start with custom ports:');
  console.log('   firebase emulators:start --only functions,storage --inspect-functions');
  console.log('');
  console.log('4. Check emulator UI:');
  console.log('   http://127.0.0.1:4000');
}

// Function to show environment variable examples
function showEnvironmentExamples() {
  console.log('\n=== Environment Variable Examples ===');
  console.log('');
  console.log('When emulator is running, these variables are automatically set:');
  console.log('');
  console.log('FUNCTIONS_EMULATOR=true');
  console.log('FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199');
  console.log('FIRESTORE_EMULATOR_HOST=127.0.0.1:8081');
  console.log('FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099');
  console.log('');
  console.log('You can also manually set these for testing:');
  console.log('');
  console.log('export FUNCTIONS_EMULATOR=true');
  console.log('export FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199');
  console.log('export FIRESTORE_EMULATOR_HOST=127.0.0.1:8081');
  console.log('');
  console.log('Or in your .env file:');
  console.log('FUNCTIONS_EMULATOR=true');
  console.log('FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199');
}

// Main execution
console.log('Current Environment Variables:');
console.log('- FUNCTIONS_EMULATOR:', process.env.FUNCTIONS_EMULATOR || 'undefined');
console.log('- FIREBASE_STORAGE_EMULATOR_HOST:', process.env.FIREBASE_STORAGE_EMULATOR_HOST || 'undefined');
console.log('- FIRESTORE_EMULATOR_HOST:', process.env.FIRESTORE_EMULATOR_HOST || 'undefined');
console.log('- FIREBASE_AUTH_EMULATOR_HOST:', process.env.FIREBASE_AUTH_EMULATOR_HOST || 'undefined');

console.log('\n');

// Run the debug script
runDebugScript();

// Check emulator status
checkEmulatorStatus();

// Show instructions
showEmulatorInstructions();
showEnvironmentExamples();

console.log('\n=== Summary ===');
console.log('The emulator detection works by checking for these environment variables:');
console.log('1. FUNCTIONS_EMULATOR=true (set when functions emulator is running)');
console.log('2. FIREBASE_STORAGE_EMULATOR_HOST (set when storage emulator is running)');
console.log('3. FIRESTORE_EMULATOR_HOST (set when firestore emulator is running)');
console.log('');
console.log('Firebase automatically sets these variables when you start the emulator.');
console.log('No manual configuration is needed - just run: firebase emulators:start'); 