const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
router.get("/employees", employeeController.getMainPage);
// router.get("/murojaat", mainController.getMurojaat);
router.post("/update-employee/:id", employeeController.updateEmployee);
router.get("/create-employee", employeeController.createEmployee);
router.get("/detailEmployee/:id", employeeController.renderEditEmployeePage);
router.post("/save-employee", employeeController.saveEmployee);
router.post("/deleteEmployee/:id", employeeController.deleteEmployee);

//edit password by ID
router.get("/edit-password/:id", employeeController.editPassword);
router.post("/update-password", employeeController.updatePassword);

module.exports = router;