const jwt = require("jsonwebtoken");

const generateJWTToken = (userId, permissionId) => {
    const payload = {
        id: userId,
        permission_id: permissionId,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "myjwttoken", {
        expiresIn: "7d",
    });
};

module.exports = generateJWTToken;