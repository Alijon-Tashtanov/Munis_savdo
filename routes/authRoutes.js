// const Router = require("express");
// const router = new Router();
// const controller = require("../controllers/authController");
// // const mainController = require("../controllers/mainController");

// const { check } = require("express-validator");
// const authMiddleware = require("../middlewaree/authMiddleware");
// const roleMiddleware = require("../middlewaree/roleMiddleware");
// router.get("/registerUser", controller.registerUser);
// router.post(
//     "/registration", [
//         check("username", "Имя пользователя не может быть пустым").notEmpty(),
//         check(
//             "password",
//             "Пароль должен быть больше 4 и меньше 10 символов"
//         ).isLength({ min: 4, max: 10 }),
//     ],
//     controller.registration
// );
// router.post("/login", controller.login);
// router.post("/loginUser", controller.loginUser);
// router.get("/api/users", roleMiddleware(["ADMIN"]), controller.getUsers);

// module.exports = router;

const Router = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
// const generateJWTToken = require("../sevices/token");
// const router = new Router();
const router = Router();
// import flash from "connect-flash";
// import session from "express-session";
const jwt = require("jsonwebtoken");

function generateJWTToken(userId) {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_TOKEN, {
            expiresIn: "30d",
        });
        return accessToken;
    } catch (error) {
        return null;
    }
}
// const router = Router();
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login ",
        isLogin: true,
        loginError: req.flash("loginError"),
    });
});
router.get("/register", (req, res) => {
    res.render("register", {
        title: "Registation",
        isRegister: true,
        registerError: req.flash("registerError"),
    });
});
router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        req.flash("loginError", "All fields are required");
        res.redirect("/login");
        return;
    }
    const existUser = await User.findOne({ email });
    if (!existUser) {
        req.flash("loginError", "User not found");
        res.redirect("/login");
    }
    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
        req.flash("loginError", "password wrong");
        res.redirect("/login");
        return;
    }

    const token = generateJWTToken(existUser._id);
    res.cookie("token", token);

    console.log(existUser._id);

    res.redirect("/");
});
router.post("/register", async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        req.flash("registerError", "All fields are required");
        res.redirect("/register");
        return;
    }
    const condidate = await User.findAll("email");
    if (condidate) {
        // req.flash("registerError", "User already exist");
        res.redirect("/register");
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(req.body);
    const userdata = {
        name: name,
        email: email,
        password: hashedPassword,
    };
    const user = await User.create(userdata);
    console.log(user);
    const token = generateJWTToken(user._id);
    res.cookie("token", token, { httpOnly: true, secure: true });
    console.log(user);
    res.redirect("/");
});

module.exports = router;