// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

const { authenticate } = require("./middleware/authentication");

const express = require("express");
const cors = require("cors")({origin: true});

initializeApp();

const app = express();

app.use(cors);

app.get("/getProfile", authenticate, async (req, res) => {
    await new Promise((resolve) => authenticate(req, res, resolve))
    if (!req.user) {
        res.status(401).json({
            error: "Unauthorized"
        })
        return;
    }

    const db = getFirestore();
    const userRef = db.collection("users").doc(req.user.uid);
    const doc = await userRef.get()

    if (!doc.exists) {
        res.status(404).json({
            error: "User not found"
        })
        return;
    }

    res.status(200).json({
        "user": doc.data()
    })
})

exports.api = onRequest(app);