const url = require("url");

const permissionMiddleware = (req, res, next) => {
    const routePermissions = {
        8: "all", // Admin can access all routes
        9: ["/appeals", "/logout"], // Limited access for permission_id 9
        10: ["/empProfile", "/logout"], // Limited access for permission_id 10
        11: ["/appeals", "/logout"], // Limited access for permission_id 11
        13: ["/appeals", "/logout"], // Limited access for permission_id 13
        14: ["/finished", "/logout"], // Limited access for permission_id 14
    };

    // Parse the requested URL to get the pathname
    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    if (pathname === "/") {
        return next(); // Allow the root URL access without restrictions
    }

    console.log("---==-- baseUrl ", pathname);

    const userPermissionId = req.user.permission_id;

    // Check if the user has permission_id 8 (admin/super user)
    if (routePermissions[userPermissionId] === "all") {
        return next(); // Admin has access to all routes
    }

    // Get the allowed URLs for the user
    const urls = routePermissions[userPermissionId] || [];

    console.log("--urls", urls);

    // Check if the requested URL is allowed for this user
    if (!urls.includes(pathname)) {
        return res.redirect("/api/error"); // Redirect to error page if access is not allowed
    }

    return next(); // User has access, proceed to the route
};

module.exports = permissionMiddleware;