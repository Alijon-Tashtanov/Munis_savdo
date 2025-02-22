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

//boshqadan mikrofoning joqqin
//app.use("/api", isAuthmiddleware, authRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, dashboardRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, mainRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, finishedRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, empProfileRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, permissionRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, appealTypeRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, statusRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, categoryRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, employeeRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, filialRoutes);

app.use("/api", isAuthmiddleware, permissionMiddleware, positionRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, hrRoutes);
app.use("/api", isAuthmiddleware, permissionMiddleware, filialRoutes);

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