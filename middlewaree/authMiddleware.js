const jwt = require("jsonwebtoken");
const config = require("../config/config");
const secretKey = config.secretKey || "Kumushxon";

// const signToken = (id) => {
//     return jwt.sign({
//             id,
//         },
//         secretKey, {
//             expiresIn: "30d",
//         }
//     );
// };
module.exports = function(req, res, next) {
    console.log("All Request Headers:", req.headers); // Log all headers to see what's being sent
    console.log(secretKey);
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.header("Authorization"); // Corrected use of req.header()

        console.log("Authorization Header:", authHeader); // Log the Authorization header

        if (!authHeader) {
            console.error("Authorization header missing"); // Add detailed error log
            return res.status(401).json({
                message: "Authorization header missing, authorization denied",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            console.error("No token present in Authorization header"); // Add detailed error log
            return res
                .status(401)
                .json({ message: "No token, authorization denied" });
        }

        const decodedData = jwt.verify(token, secretKey);
        req.user = decodedData;
        next();
    } catch (e) {
        console.error("JWT verification failed:", e); // Add detailed error log
        return res.status(403).json({ message: "User not authorized" });
    }
};