const express = require("express");
const router = express.Router();
const appealTypeController = require("../controllers/appealTypeController");
router.get("/appeal_types", appealTypeController.getMainPage);
router.get("_type", appealTypeController.createAppeal_type);
router.post("/save-appeal_type", appealTypeController.saveAppeal_type);
router.get(
    "/detail-appeal_type/:id",
    appealTypeController.getDetailAppeal_type
);
router.post("/update-appeal_type/:id", appealTypeController.updateAppeal_type);
router.post("/delete-appeal_type/:id", appealTypeController.deleteAppeal_type);

module.exports = router;