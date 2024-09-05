const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
router.get("/permissions", permissionController.getMainPage);
router.get("/create-permission", permissionController.createPermission);
router.post("/save-permission", permissionController.savePermission);
router.get("/detail-permission/:id", permissionController.getDetailPermission);
router.post("/update-permission/:id", permissionController.updatePermission);
router.post("/delete-permission/:id", permissionController.deletePermission);

module.exports = router;