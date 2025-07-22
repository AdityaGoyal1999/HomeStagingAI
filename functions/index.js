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
    // await new Promise((resolve) => authenticate(req, res, resolve))
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

app.get('/getPhotos', authenticate, async (req, res) => {
  const db = getFirestore();
  const userRef = db.collection('users').doc(req.user.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // Create user doc with empty photos array
    await userRef.set({ photos: [] });
    return res.status(200).json({ photos: [] });
  }

  let userData = userDoc.data();
  if (!userData.photos) {
    // Set empty photos array if not present
    await userRef.update({ photos: [] });
    return res.status(200).json({ photos: [] });
  }

  return res.status(200).json({ photos: userData.photos });
});

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