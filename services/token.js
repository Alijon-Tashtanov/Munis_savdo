import jwt from "jsonwebtoken";
const secretKey = config.secretKey || "myjwttoken";
export default function generateJWTToken(userId) {
    try {
        const accessToken = jwt.sign({ userId }, secretKey, {
            expiresIn: "30d",
        });
        return accessToken;
    } catch (error) {
        return null;
    }
}
export function checkJWTToken(token) {
    try {
        const { iat, exp } = jwt.verify(token, secretKey);
        const currentUnixTime = Math.floor(new Date().getTime() / 1000);
        return currentUnixTime < exp;
    } catch (err) {
        return false;
    }
}