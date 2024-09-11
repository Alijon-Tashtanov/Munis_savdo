const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Make sure bcrypt is also imported if it's not already
const generateJWTToken = require("../services/token");
console.log("generateJWTToken:", generateJWTToken);
const {
    Employee,
    Appeal,
    Category,
    AppealType,
    Permissions,
    Filials,
    TopCategories,
    Positions,
    User,
} = require("../models");

exports.getMainPage = async(req, res) => {
    try {
        const searchTerm = req.query.searchBar || "";
        const filterFilial = req.query.filial || "";
        const page = parseInt(req.query.page, 10) || 1; // Get the current page, default to 1
        const limit = 10; // Number of records per page
        const offset = (page - 1) * limit;

        let whereConditions = {
            [Op.or]: [{
                name: {
                    [Op.like]: `%${searchTerm}%`,
                },
            }, ],
        };

        if (filterFilial) {
            whereConditions.filial_id = filterFilial;
        }

        // const { Op } = require("sequelize");

        const { rows: data, count } = await Employee.findAndCountAll({
            where: {
                [Op.and]: [
                    whereConditions, // Dynamic conditions like search term and filial_id
                    { status: 1 }, // Only fetch users with status equal to 1
                ],
            },
            include: [
                { model: Filials, as: "filial" },
                { model: Positions, as: "position" },
                { model: Permissions, as: "permission" },
            ],
            limit: limit,
            offset: offset,
            order: [
                ["id", "ASC"]
            ],
        });

        const filials = await Filials.findAll({
            where: {
                status: 1,
            },
        });
        const positions = await Positions.findAll({
            where: {
                status: 1,
            },
        });

        const totalPages = Math.ceil(count / limit);

        res.render("employees/index", {
            data: data || [],
            positions: positions,
            filials: filials,
            filterFilial: filterFilial,

            currentPage: page,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.createEmployee = async(req, res) => {
    try {
        const filials = await Filials.findAll({
            where: {
                status: 1,
            },
        });

        const positions = await Positions.findAll({
            where: {
                status: 1,
            },
        });
        const permissions = await Permissions.findAll({
            where: {
                status: 1,
            },
        });

        res.render("employees/create", {
            title: "Create Page",
            positions: positions,
            filials: filials,
            permissions: permissions,
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.saveEmployee = async(req, res) => {
    try {
        const {
            name,
            phone,
            email,
            password,
            filial_id,
            position_id,
            permission_id,
            title,
        } = req.body;
        console.log("Request body:", req.body);

        if (!name || !email || !password) {
            res.redirect("/api/create-employee");
            return;
        }

        const existingUser = await Employee.findOne({ where: { email } });
        console.log("Existing user:", existingUser);

        if (existingUser) {
            res.redirect("/api/create-employee");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await Employee.create({
            name,
            phone,
            email,
            password: hashedPassword,
            filial_id,
            position_id,
            permission_id,
            title,
            created_at: new Date(),
            updated_at: new Date(),
        });

        // Generate JWT token for the newly created user
        // const token = generateJWTToken(newUser.id, permission_id);

        // // Set the token as a cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     sameSite: "Strict",
        //     secure: false,
        // });

        // console.log("Generated token:", token);

        res.redirect("/api/employees");
    } catch (error) {
        console.error("Error saving employee:", error);

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.updateEmployee = async(req, res) => {
    try {
        const itemId = req.params.id;
        const updateData = req.body;
        const result = await Employee.update(updateData, { where: { id: itemId } });

        // const empId = req.params.id;
        // // console.log("ppppp", empId);
        // const emp = await Filials.findByPk(empId);

        if (!result) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // await emp.update(updateData);

        res.redirect("/api/employees");
    } catch (error) {
        console.error("Error updating employee:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.renderEditEmployeePage = async(req, res) => {
    try {
        const employeeId = req.params.id;

        const employee = await Employee.findOne({
            where: { id: employeeId },
            include: [
                { model: Filials, as: "filial" },
                { model: Positions, as: "position" },
            ],
        });

        // Fetch all filials and positions for the dropdowns
        const filials = await Filials.findAll({ where: { status: 1 } });
        const positions = await Positions.findAll({ where: { status: 1 } });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Render the edit page with the fetched data
        res.render("employees/edit", {
            employee,
            filials,
            positions,
        });
    } catch (error) {
        console.error("Error rendering edit employee page:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deleteEmployee = async(req, res) => {
    try {
        // console.log("deleteId", req.params.id);
        const itemId = req.params.id;
        const employee = await Employee.findByPk(itemId);

        if (!employee) {
            return res.status(404).json({ error: "No employee found with this ID" });
        }

        employee.status = 0; // Update the status field
        await employee.save();
        res.redirect("/api/employees");
    } catch (error) {
        console.error("Error deleting Filial:", error); // Log the actual error for debugging
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};

exports.editPassword = async(req, res) => {
    try {
        res.render("employees/editPassword", {
            title: "Edit Password",
            id: req.params.id,
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.updatePassword = async(req, res) => {
    try {
        const { id, password1, password2 } = req.body;

        if (password1 !== password2) {
            return res.redirect("back");
        }

        const employee = await Employee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        const hashedPassword = await bcrypt.hash(password1, 8);

        employee.password = hashedPassword;
        await employee.save();

        return res.redirect("/api/employees");
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};