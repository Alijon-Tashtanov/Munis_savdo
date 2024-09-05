const express = require("express");
const router = express.Router();
const filialController = require("../controllers/filialController");
router.get("/filials", filialController.getMainPage);
// router.get("/murojaat", filialController.getMurojaat);
// // router.get("/search", mainController.getMurojaat);
router.get("/create-filial", filialController.createFilial);
router.get("/detailFilial/:id", filialController.getDetailFilial);
router.post("/updateFilial/:id", filialController.updateFilial);
router.post("/saveFilial", filialController.savesFilial);
router.post("/deleteFilial/:id", filialController.deleteFilial);

module.exports = router;