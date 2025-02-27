const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/",userController.login);
router.get("/user", userController.userExists);


module.exports = router;
