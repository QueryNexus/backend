const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const companyController = require("../controllers/companyController");
const chatController = require("../controllers/chatController");

// User routes
router.post("/saveUser", userController.saveUser);

// Company routes
router.post("/createCompany", companyController.createCompany);
router.put("/updateCompany/:id", companyController.updateCompany);

// Chat routes
router.post("/getResponse/:chatId", chatController.getResponse);
router.get("/getHistory/:chatId", chatController.getChatHistory);
router.get("/getCompanyChats/:companyId", chatController.getCompanyChats);

module.exports = router;
