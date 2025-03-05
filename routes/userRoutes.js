const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/user",userController.login);
router.post("/usercompany", userController.userExists);


module.exports = router;
