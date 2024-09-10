const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const fs = require("fs");
const mainRoutes = require("./routes/mainRoutes");
const positionRoutes = require("./routes/positionRoutes");
const filialRoutes = require("./routes/filialRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statusRoutes = require("./routes/statusRoutes");
const usersRoutes = require("./routes/userRoutes");
const appealTypeRoutes = require("./routes/appealTypeRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const authRoutes = require("./routes/authRoutes");
const isAuthmiddleware = require("./middlewaree/isAuthmiddleware"); // Correct path
const permissionMiddleware = require("./middlewaree/perMiddleware");

dotenv.config();
const app = express();
app.use(cookieParser());
// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override middleware
app.use(methodOverride("_method"));

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Routeswwwwwwwwwww
app.use("/api", authRoutes);
app.use("/api", isAuthmiddleware, mainRoutes); // Protected routes
app.use("/api", isAuthmiddleware, filialRoutes); // Protected routes
app.use("/api", isAuthmiddleware, positionRoutes); // Protected routes
app.use("/api", isAuthmiddleware, employeeRoutes);
app.use("/api", isAuthmiddleware, categoryRoutes); // Protected routes
app.use("/api", isAuthmiddleware, statusRoutes); // Protected routes
app.use("/api", isAuthmiddleware, appealTypeRoutes); // Protected routes
app.use("/api", isAuthmiddleware, permissionRoutes); // Protected routes

// MySQL Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "munis_savdo_test",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the MySQL database.");
});

const PORT = 4500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});