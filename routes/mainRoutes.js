const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const mainController = require("../controllers/mainController");
router.get("/", mainController.getMainPage);
router.get("/appeals", mainController.getMurojaat);
// router.get("/search", mainController.getMurojaat);
router.get("/create-murojaat", mainController.createMurojaat);
// router.get("/detail-murojaat", mainController.getDetailSingleAppeal);
router.post("/save-murojaat", mainController.saveAppeal);

// router.get("/detail-single-appeal/:id", mainController.getDetailSingleAppeal);
router.get("/get-employees", mainController.getEmployeesByFilials);

// router.get("/register", (req, res) => {
//     res.render("register", {
//         title: "Registation",
//         isRegister: true,
//         // registerError: req.flash("registerError"),
//     });
// });

// router.post("/register", async(req, res) => {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//         // req.flash("registerError", "All fields are required");
//         res.redirect("/register");
//         return;
//     }
//     const condidate = await User.findOne({ email });
//     if (condidate) {
//         // req.flash("registerError", "User already exist");
//         res.redirect("/register");
//         return;
//     }
//     const hashedPassword = await bcrypt.hash(password, 8);
//     // console.log(req.body);
//     const userdata = {
//         name: name,
//         email: email,
//         password: hashedPassword,
//     };
//     const user = await User.create(userdata);
//     console.log(user);
//     const token = generateJWTToken(user._id);
//     res.cookie("token", token, { httpOnly: true, secure: true });
//     console.log(user);
//     res.redirect("/");
// });
// router.get("/download", (req, res) => {
//     const file = path.join(__dirname, "files", "sample.pdf");
//     console.log("Resolved file path:", file);

//     res.download(file, "sample.pdf", (err) => {
//         if (err) {
//             console.error("Error downloading file:", err.message);
//             res.status(500).send("Error downloading file.");
//         }
//     });
// });
// router.get("/detail-product/:id", mainController.detailSingleProduct);

module.exports = router;