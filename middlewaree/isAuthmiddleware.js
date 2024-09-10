const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "myjwttoken";

const isAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/api/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || secretKey);
        req.user = { id: decoded.id, permission_id: decoded.permission_id };
        console.log("111----", req.user);
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = isAuth;