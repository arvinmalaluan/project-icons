const router = require("express").Router();
const controller = require("../controller/newsletter.controller");

router.get("/get-all", controller.getAll);
router.get("/get/:id", controller.getSpecific);
router.post("/create", controller.create);
router.patch("/update/:id", controller.update);
router.delete("/delete", controller.delete);

module.exports = router;
