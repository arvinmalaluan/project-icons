const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/Apis/router");
const WebSocket = require("ws");
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Body parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/v1/https/auth", routes.authRouter); // ----------> For Authentication Related Routes
app.use("/api/v1/https/community", routes.communityRouter); // -----> For Community Related Routes
app.use("/api/v1/https/conversation", routes.conversationRouter); // -----> For Conversation Related Routes
app.use("/api/v1/https/gallery", routes.galleryRouter); // -----> For Gallery Related Routes
app.use("/api/v1/https/home-content", routes.homeContentRouter); // -----> For Home Content Related Routes
app.use("/api/v1/https/message", routes.messageRouter); // -----> For Message Related Routes
app.use("/api/v1/https/profile", routes.profileRouter); // -----> For Profile Related Routes
app.use("/api/v1/https/service", routes.serviceRouter); // -----> For Service Related Routes
app.use("/api/v1/https/startup-info", routes.startupInfoRouter); // -----> For Startup Info Related Routes
app.use("/api/v1/https/admin", routes.adminRouter); // -----> For Admin Related Routes

// WebSocket endpoints
const wss = new WebSocket.Server({ noServer: true });

// Define a function to handle connections
wss.on("connection", function connection(ws, req) {
  // Check if the request URL matches the specific endpoint
  if (req.url === "/api/v1/wss/community") {
    console.log("Connected to /api/v1/wss/community endpoint");

    // Event listener for messages from clients
    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });

    // Event listener for closing the connection
    ws.on("close", function close() {
      console.log("Connection to /api/v1/wss/community endpoint closed");
    });
  } else {
    // Close the connection if it's not for the specific endpoint
    ws.close();
  }
});

module.exports = { app, wss };
