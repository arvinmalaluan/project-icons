const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/Apis/router");
const http = require("http");
const path = require('path');
const cors = require("cors");
const app = express();
const server = http.createServer(app);

app.use(cors());
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
app.use("/api/v1/https/log", routes.createLogRouter); // -----> For Logging Related Routes
app.use("/api/v1/https/search", routes.searchRouter);
app.use("/api/v1/https/password", routes.PasswordRouter);
app.use("/api/v1/https/reset.html", routes.PasswordRouter);
app.use("/api/v1/https/login.html", routes.PasswordRouter);



module.exports = { server };
