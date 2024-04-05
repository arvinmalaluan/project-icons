const router = require("express").Router();
const controller = require("../controller/startup_info.controller");

router.get("/:id", controller.getStartupInfo);
router.get("/post/:id", controller.getSpecificStartupInfo);
router.post("/", controller.createStartupInfo);
router.patch("/:id", controller.updateStartupInfo);
router.delete("/:condition", controller.deleteStartupInfo);

module.exports = router;
