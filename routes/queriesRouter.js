const express = require("express");
const router = express.Router();

const queriesController = require("../controllers/queriesController");

router.post('/query/:companyId',queriesController.handleQuery);

module.exports = router;