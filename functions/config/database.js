const { getFirestore } = require('firebase-admin/firestore');

// Database configuration and initialization
const initializeDatabase = () => {
  return getFirestore();
};

module.exports = {
  initializeDatabase,
  getFirestore
}; 