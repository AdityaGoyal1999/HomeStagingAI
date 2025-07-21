// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();


exports.sayHello = onRequest((req, res) => {
    const name = req.query.name;

    if (!name) {
        res.status(400).json({
            error: "Missing 'name' query parameter"
        })
        return;
    }

    res.status(200).json({
        "message": `Hello ${name}`
    })
})