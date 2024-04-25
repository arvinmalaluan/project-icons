const router = require("express").Router();
const controller = require("../controller/auth.controller");

router.post("/signin", controller.authSignin);
router.post("/signup", controller.authSignup);
router.get("/checkval/:condition", controller.checkval);

module.exports = router;
