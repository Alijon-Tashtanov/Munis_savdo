const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const errorRoutes = require("./routes/errorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const finishedRoutes = require("./routes/finishedRoutes");
const hrRoutes = require("./routes/hrRoutes");
const mainRoutes = require("./routes/mainRoutes");
const positionRoutes = require("./routes/positionRoutes");
const filialRoutes = require("./routes/filialRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statusRoutes = require("./routes/statusRoutes");
const appealTypeRoutes = require("./routes/appealTypeRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const empProfileRoutes = require("./routes/empProfileRoutes");
const isAuthmiddleware = require("./middlewaree/isAuthmiddleware");
const permissionMiddleware = require("./middlewaree/perMiddleware");

dotenv.config();
const app = express();
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", errorRoutes);

const routePermissions = {
    9: ["/api", "/api/employees"],
    10: ["/api", "/api/empProfile"],
    11: ["/api", "api/appeals"],
    13: ["/api", "/api/appeals"],
    14: ["/api", "/api/finished"],
};

app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    authRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    errorRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    dashboardRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    finishedRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    mainRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    hrRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    positionRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    filialRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    employeeRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    categoryRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    statusRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    appealTypeRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    permissionRoutes
);
app.use(
    "/api",
    isAuthmiddleware,
    permissionMiddleware(routePermissions),
    empProfileRoutes
);

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "munis_savdo_test",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the MySQL database.");
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});