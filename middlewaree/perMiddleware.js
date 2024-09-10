// middlewares/permissionMiddleware.js

const permissionMiddleware = (allowedPermissions) => {
    return (req, res, next) => {
        const userPermissionId = req.user.permission_id;

        if (allowedPermissions.includes(userPermissionId)) {
            return next();
        }
        res.redirect("/api/error");
    };
};

module.exports = permissionMiddleware;