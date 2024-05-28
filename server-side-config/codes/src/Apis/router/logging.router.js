const router = require("express").Router();
const controller = require("../controller/logging.controller");

router.post("/", controller.createLog);

module.exports = router;
