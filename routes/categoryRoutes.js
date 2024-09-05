const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
router.get("/categories", categoryController.getMainPage);
// // router.get("/murojaat", filialController.getMurojaat);
// // // router.get("/search", mainController.getMurojaat);
router.get("/create-category", categoryController.createCategory);
router.get("/detail-category/:id", categoryController.getDetailCategory);
router.post("/update-category/:id", categoryController.updateCategory);
router.post("/save-category", categoryController.saveCategory);
router.post("/delete-category/:id", categoryController.deleteCategory);

module.exports = router;