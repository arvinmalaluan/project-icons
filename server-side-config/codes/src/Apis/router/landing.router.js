const router = require("express").Router();
const controller = require("../controller/landing.controller");

router.post("/contact", controller.createQuery);
router.get("/contents/:condition", controller.getSpecificHomeContent);
router.get("/gallery", controller.getGallery);

module.exports = router;
