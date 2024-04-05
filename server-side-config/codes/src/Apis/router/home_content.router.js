const router = require("express").Router();
const controller = require("../controller/home_content.controller");

router.get("/", controller.getHomeContent);
router.get("/:condition", controller.getSpecificHomeContent);
router.post("/", controller.createHomeContent);
router.patch("/:id", controller.updateHomeContent);

module.exports = router;
