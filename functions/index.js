// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {onRequest} = require("firebase-functions/v2/https");

// Load environment variables
require('dotenv').config();

// Initialize Firebase
const { initializeFirebase } = require('./config/firebase');

// Import middleware and routes
const { errorHandler, authenticate, validateFileUpload, validateStyle } = require('./middleware');
const { userRoutes, photoRoutes, paymentRoutes } = require('./routes');

const express = require("express");
const cors = require("cors")({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://127.0.0.1:5173', // Alternative localhost
    'http://localhost:3000', // React dev server
    'http://127.0.0.1:3000', // Alternative localhost
    'https://homestaging-3aeee.web.app', // Production domain
    'https://homestaging-3aeee.firebaseapp.com' // Firebase hosting
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});
const { fileParser } = require('express-multipart-file-parser');

// Initialize Firebase
initializeFirebase();

const app = express();

// Middleware
app.use(cors);

// Handle preflight requests
app.options('*', cors);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileParser({
  rawBodyOptions: {
    limit: '15mb', 
  },
  busboyOptions: {
    limits: {
      fields: 2
    }
  },
}));

// Routes
app.use('/user', userRoutes);
app.use('/photos', photoRoutes);
app.use('/payment', paymentRoutes);



// Legacy routes for backward compatibility
app.get("/getProfile", authenticate, async (req, res) => {
  try {
    // Import the user controller to handle the request
    const UserController = require('./controllers/userController');
    const userController = new UserController();
    await userController.getProfile(req, res);
  } catch (error) {
    console.error('Error in legacy getProfile route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getPhotos', authenticate, async (req, res) => {
  try {
    // Import the photo controller to handle the request
    const PhotoController = require('./controllers/photoController');
    const photoController = new PhotoController();
    await photoController.getPhotos(req, res);
  } catch (error) {
    console.error('Error in legacy getPhotos route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/uploadPhoto", authenticate, validateFileUpload, validateStyle, async (req, res) => {
  try {
    // Import the photo controller to handle the request
    const PhotoController = require('./controllers/photoController');
    const photoController = new PhotoController();
    await photoController.uploadPhoto(req, res);
  } catch (error) {
    console.error('Error in legacy uploadPhoto route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Export the function with the correct name for the emulator
exports.api = onRequest(app);


// users (collection)
//   └── {userId} (document)
//         ├── displayName, email, ...
//         └── photos (subcollection)
//               └── {photoId} (document)
//                     ├── photoURL
//                     ├── type: "user" | "generated"
//                     ├── createdAt
//                     └── generatedPhotos (subcollection)
//                           └── {generatedPhotoId} (document)
//                                 ├── photoURL
//                                 ├── createdAt

