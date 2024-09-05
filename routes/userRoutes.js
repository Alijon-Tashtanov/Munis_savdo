const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.get("/users", userController.getMainPage);
// router.get("/create-user", userController.createUser);
// router.post("/save-user", userController.saveUser);
// router.get("/detail-user/:id", userController.getDetailUser);
// router.post("/update-user/:id", userController.updateUser);
// router.post("/delete-user/:id", userController.deleteUser);

module.exports = router;