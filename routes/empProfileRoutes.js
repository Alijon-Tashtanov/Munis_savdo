const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const permissionMiddleware = require("../middlewaree/perMiddleware");

const mainController = require("../controllers/mainController");

router.get("/emp-profile", mainController.getEmpPage);

module.exports = router;