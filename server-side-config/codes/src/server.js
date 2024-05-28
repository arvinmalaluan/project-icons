const { server } = require("./../app");
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
const admin = require("firebase-admin");



// // Path to your service account key JSON file
// const serviceAccountKeyPath = './servicePrivatekey.json';

// // Initialize Firebase Admin SDK with the service account key
// const serviceAccount = require(serviceAccountKeyPath);
// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount), // Your service account key JSON
//   databaseURL: "https://console.firebase.google.com/u/0/project/icons-13b1b/database" // Your Firebase project database URL
// });

app.use(cors());

// // Endpoint to send push notification
// app.post('/send-notification', async (req, res) => {
//   try {
//     const { deviceToken, title, body } = req.body;
//     const message = {
//       token: deviceToken,
//       notification: {
//         title: title,
//         body: body
//       }
//     };
//     await admin.messaging().send(message);
//     console.log("Notification sent successfully!");
//     res.status(200).json({ message: "Notification sent successfully!" });
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

server.listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
