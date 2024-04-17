const router = require("express").Router();
const controller = require("../controller/profile.controller");

router.get("/:id", controller.getProfile);
router.get("/", controller.getAllProfile);
router.post("/", controller.createProfile);
router.patch("/:id", controller.updateProfile);

module.exports = router;
