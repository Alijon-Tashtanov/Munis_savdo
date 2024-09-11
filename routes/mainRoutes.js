const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const permissionMiddleware = require("../middlewaree/perMiddleware");

const mainController = require("../controllers/mainController");

router.get("/appeals", mainController.getMurojaat);
// router.get("/search", mainController.getMurojaat);
// router.get("/detail-murojaat", mainController.getDetailSingleAppeal);
router.post("/save-murojaat", mainController.saveAppeal);

//employeeProfile

router.get("/edit-emp-single-app/:id", mainController.getEmpOneApp);
router.post("/update-emp-app", mainController.updateEmpOneApp);
router.get("/emp-finish-app/:id", mainController.empFinishApp);
router.post("/emp-closed-app/:id", mainController.empClosedApp);

//resulted
router.get("/resulted", mainController.resultedApps);
router.get("/emp-show-single-app/:id", mainController.showResultedApps);

//login

//register
router.get("/register", mainController.getRegisterPage);
router.post("/send-register", mainController.saveRegister);

//updatePassword
// router.get("/detail-single-appeal/:id", mainController.getDetailSingleAppeal);
router.get("/get-employees", mainController.getEmployeesByFilials);
router.get("/logout", mainController.logout);

module.exports = router;