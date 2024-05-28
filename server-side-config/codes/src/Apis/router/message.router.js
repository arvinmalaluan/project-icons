const router = require("express").Router();
const controller = require("../controller/message.controller");

router.get("/:id", controller.getMessage);
router.post("/", controller.createMessage);
router.patch("/:id", controller.updateMessage);

router.get('/messages', (req, res) => {
    
    res.sendFile(path.join(__dirname, '../../../../../client-side-config/users/src/messages.html'));
});

module.exports = router;
