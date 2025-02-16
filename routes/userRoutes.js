const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/user',userController.login);


module.exports = router;
