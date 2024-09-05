const express = require("express");
const router = express.Router();
const positionController = require("../controllers/positionController");
router.get("/positions", positionController.getPositions);
// router.get("/murojaat", filialController.getMurojaat);
// // router.get("/search", mainController.getMurojaat);
router.get("/create-position", positionController.createPosition);
router.get("/detail-position/:id", positionController.getDetailPosition);
router.post("/update-position/:id", positionController.updatePosition);
router.post("/save-position", positionController.savePosition);
router.post("/delete-position/:id", positionController.deletePosition);

module.exports = router;