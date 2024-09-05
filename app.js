const express = require("express");
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
const authMiddleware = require("./middlewaree/authMiddleware");
const roleMiddleware = require("./middlewaree/roleMiddleware");

dotenv.config();
const app = express();

// app.set("views", path.join(__dirname, "views")); // This sets the views directory
// app.set("view engine", "ejs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override middleware
app.use(methodOverride("_method"));

// Set EJS as the view engine
app.set("view engine", "ejs");

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

// Define routes
app.use("/api", mainRoutes);
app.use("/api", filialRoutes);
app.use("/api", positionRoutes);
app.use("/api", employeeRoutes);
app.use("/api", categoryRoutes);
app.use("/api", statusRoutes);
app.use("/api", appealTypeRoutes);
app.use("/api", permissionRoutes);
// app.use("/api", usersRoutes);

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