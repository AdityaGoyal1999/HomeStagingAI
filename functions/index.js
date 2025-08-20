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
const bodyParser = require("body-parser");
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

app.use((req, res, next) => {
  if (req.originalUrl === "/payment/webhook") {
    req.body = req.rawBody;
    console.log("THIS IS THE RAW BODY", req.rawBody)
  }
  next();
})

// IMPORTANT: Webhook route must be registered BEFORE all other middleware to preserve raw body
app.post('/payment/webhook',  express.raw({ type: '*/*' }), (req, res) => {
  // Manually capture raw body without any parsing
  console.log("🔍 === WEBHOOK REQUEST DEBUG ===");
  console.log("🔍 Request body type:", typeof req.body);
  console.log("🔍 Is Buffer?", req.body instanceof Buffer);
  console.log("🔍 Body length:", req.body ? req.body.length : 'undefined');
  console.log("🔍 Stripe signature header:", req.headers['stripe-signature']);

  try {
    const PaymentController = require('./controllers/paymentController');
    const paymentController = new PaymentController();

    // Now just pass req, res directly
    paymentController.handleWebhook(req, res);
  } catch (error) {
    console.error('Error in webhook route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes with body parsing middleware applied specifically
app.use('/user', bodyParser.json(), bodyParser.urlencoded({ extended: true }), userRoutes);
app.use('/photos', bodyParser.json(), bodyParser.urlencoded({ extended: true }), fileParser({
  rawBodyOptions: {
    limit: '15mb', 
  },
  busboyOptions: {
    limits: {
      fields: 2
    }
  },
}), photoRoutes);
app.use('/payment', bodyParser.json(), bodyParser.urlencoded({ extended: true }), paymentRoutes);

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

app.post("/uploadPhoto", bodyParser.json(), bodyParser.urlencoded({ extended: true }), fileParser({
  rawBodyOptions: {
    limit: '15mb', 
  },
  busboyOptions: {
    limits: {
      fields: 2
    }
  },
}), authenticate, validateFileUpload, validateStyle, async (req, res) => {
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

