const mainRoutes = require("../routes/mainRoutes");
const positionRoutes = require("../routes/positionRoutes");
const filialRoutes = require("../routes/filialRoutes");
const employeeRoutes = require("../routes/employeeRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const statusRoutes = require("../routes/statusRoutes");
const usersRoutes = require("../routes/userRoutes");
const appealTypeRoutes = require("../routes/appealTypeRoutes");
const permissionRoutes = require("../routes/permissionRoutes");
const authRoutes = require("../routes/authRoutes");
const hrRoutes = require("../routes/hrRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");
const empProfileRoutes = require("../routes/empProfileRoutes");
const finishedRoutes = require("../routes/finishedRoutes");
const errorRoutes = require("../routes/errorRoutes");
const permissionMiddleware = (routePermissions) => {
    return (req, res, next) => {
        console.log("---==--", req.baseUrl);
        const userPermissionId = req.user.permission_id;

        if (!userPermissionId) {
            return res.redirect("/api/error");
        }

        if (userPermissionId == "8") {
            return next();
        }
        const allowedPermissions = routePermissions[userPermissionId] || [];

        if (allowedPermissions.includes(req.baseUrl)) {
            return next();
        }

        return res.redirect("/api/error");
    };
};

module.exports = permissionMiddleware;