const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");
router.get("/statuses", statusController.getMainPage);
router.get("/create-status", statusController.createStatus);
router.post("/save-status", statusController.saveStatus);
router.get("/detail-status/:id", statusController.getDetailStatus);
router.post("/update-status/:id", statusController.updateStatus);
router.post("/delete-status/:id", statusController.deleteStatus);

module.exports = router;