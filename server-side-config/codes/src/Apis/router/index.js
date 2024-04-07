// index.js
const authRouter = require("./auth.router");
const communityRouter = require("./community.router");
const conversationRouter = require("./conversation.router");
const galleryRouter = require("./gallery.router");
const homeContentRouter = require("./home_content.router");
const messageRouter = require("./message.router");
const profileRouter = require("./profile.router");
const serviceRouter = require("./service.router");
const startupInfoRouter = require("./startup_info.router");
const adminRouter = require("./admin.router");
const createLogRouter = require("./logging.router");
const searchRouter = require("./search.router");
const PasswordRouter = require("./reset.password.router");
const landingRouter = require("./landing.router");

module.exports = {
  authRouter,
  communityRouter,
  conversationRouter,
  galleryRouter,
  homeContentRouter,
  messageRouter,
  profileRouter,
  serviceRouter,
  startupInfoRouter,
  adminRouter,
  createLogRouter,
  searchRouter,
  PasswordRouter,
  landingRouter,
};
