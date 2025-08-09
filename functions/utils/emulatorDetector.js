/**
 * Utility for detecting Firebase emulator environment
 */

class EmulatorDetector {
    constructor() {
        this.isEmulator = this.detectEmulator();
        this.emulatorHosts = this.getEmulatorHosts();
    }

    /**
     * Detect if running in Firebase emulator
     */
    detectEmulator() {
        return process.env.FUNCTIONS_EMULATOR === 'true' || 
                process.env.FIRESTORE_EMULATOR_HOST || 
                process.env.FIREBASE_STORAGE_EMULATOR_HOST ||
                process.env.FIREBASE_AUTH_EMULATOR_HOST ||
                process.env.FIREBASE_DATABASE_EMULATOR_HOST;
    }

    /**
     * Get all emulator hosts
     */
    getEmulatorHosts() {
        return {
        functions: process.env.FUNCTIONS_EMULATOR === 'true' ? '127.0.0.1:5001' : null,
        storage: process.env.FIREBASE_STORAGE_EMULATOR_HOST || null,
        firestore: process.env.FIRESTORE_EMULATOR_HOST || null,
        auth: process.env.FIREBASE_AUTH_EMULATOR_HOST || null,
        database: process.env.FIREBASE_DATABASE_EMULATOR_HOST || null
        };
    }

    /**
     * Get storage emulator URL
     */
    getStorageEmulatorURL(bucketName, filePath) {
        if (!this.isEmulator || !this.emulatorHosts.storage) {
        return null;
        }
        
        return `http://${this.emulatorHosts.storage}/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;
    }

    /**
     * Get production storage URL
     */
    getProductionStorageURL(bucketName, filePath) {
        return `https://storage.googleapis.com/${bucketName}/${filePath}`;
    }

    /**
     * Get appropriate storage URL based on environment
     */
    getStorageURL(bucketName, filePath) {
        if (this.isEmulator) {
        return this.getStorageEmulatorURL(bucketName, filePath);
        } else {
        return this.getProductionStorageURL(bucketName, filePath);
        }
    }

    /**
     * Log emulator status for debugging
     */
    logStatus() {
        console.log('=== Emulator Detection Status ===');
        console.log('Is Emulator:', this.isEmulator);
        console.log('Emulator Hosts:', this.emulatorHosts);
        console.log('Environment Variables:');
        console.log('- FUNCTIONS_EMULATOR:', process.env.FUNCTIONS_EMULATOR);
        console.log('- FIREBASE_STORAGE_EMULATOR_HOST:', process.env.FIREBASE_STORAGE_EMULATOR_HOST);
        console.log('- FIRESTORE_EMULATOR_HOST:', process.env.FIRESTORE_EMULATOR_HOST);
        console.log('- FIREBASE_AUTH_EMULATOR_HOST:', process.env.FIREBASE_AUTH_EMULATOR_HOST);
        console.log('================================');
    }
}

module.exports = EmulatorDetector;