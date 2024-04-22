const router = require("express").Router();
const controller = require("../controller/service.controller");

router.get("/:id", controller.getService);

router.get("/post/:id", controller.getSpecificService);
router.post("/", controller.createService);
router.patch("/:id", controller.updateService);
router.delete("/:condition", controller.deleteService);

module.exports = router;
