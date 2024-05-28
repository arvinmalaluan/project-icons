// firebase-push-notif.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbelwUJpHpX-Bwe5fSyZIwYSs8bVWxmc0",
  authDomain: "icons-13b1b.firebaseapp.com",
  projectId: "icons-13b1b",
  storageBucket: "icons-13b1b.appspot.com",
  messagingSenderId: "749389518318",
  appId: "1:749389518318:web:dc9b14ed85881a55916aff",
  measurementId: "G-L0LF4JBLJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request permission to show notifications
export function requestNotificationPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" }).then((currentToken) => {
        if (currentToken) {
          console.log("Token received: ", currentToken);
          // Send the token to your server or save it for later use
        } else {
          console.log("No registration token available. Request permission to generate one.");
        }
      }).catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}

// Listen for messages
export function onMessageListener() {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // Customize notification here
  });
}
