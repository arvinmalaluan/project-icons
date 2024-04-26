// firebase.js

// Import Firebase SDKs
const firebase = require("firebase/app");
require("firebase/database");

// Your Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbelwUJpHpX-Bwe5fSyZIwYSs8bVWxmc0",
    authDomain: "icons-13b1b.firebaseapp.com",
    projectId: "icons-13b1b",
    storageBucket: "icons-13b1b.appspot.com",
    messagingSenderId: "749389518318",
    appId: "1:749389518318:web:d6e38386234d7569916aff",
    measurementId: "G-S4BMT9Z9RM"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to add a notification to the database
function addNotification(userId, notification) {
  const notificationsRef = database.ref(`notifications/${userId}`);
  notificationsRef.push(notification);
}

// Export the function
module.exports = {
  addNotification
};
