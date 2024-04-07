const router = require("express").Router();
const controller = require("../controller/admin.controller");

router.get("/users", controller.getUsers);
router.get("/articles", controller.getArticles);
router.get("/programs", controller.getPrograms);
router.get("/queries", controller.getQueries);
router.get("/community", controller.getCommunity);

router.patch("/users/:id", controller.editUserInfo);
router.get("/users/:id", controller.getOneUser);

// ! Delete function
router.delete("/delete_user/:id/:table_name", controller.delete);

module.exports = router;
