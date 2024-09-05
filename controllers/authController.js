const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config/config.json");
const secretKey = "Kumushxon";
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

class authController {
    async registerUser(req, res) {
        try {
            res.render("register", {
                title: "Register Page",
            });
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
    async loginUser(req, res) {
        try {
            res.render("login", {
                title: "Login Page",
            });
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при регистрации", errors });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res
                    .status(400)
                    .json({ message: "Пользователь с таким именем уже существует" });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            });
            await user.save();
            return res.json({ message: "Пользователь успешно зарегистрирован" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Registration error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `Пользователь ${username} не найден` });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: `Введен неверный пароль` });
            }
            const token = generateAccessToken(user._id);
            return res.json({ token });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Login error" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();