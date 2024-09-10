// const Category = require("../models/category");
// const Filials = require("../models/filials");
// const TopCategory = require("../models/top_categories");
// const Appeal = require("../models/appeal");
const { Sequelize } = require("sequelize");

const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
// const { generateJWTToken } = require("../services/token");
const {
    Appeal,
    Category,
    AppealType,
    Filials,
    TopCategories,
    Status,
    User,
    Employee,
} = require("../models");
exports.getErrorPage = async(req, res) => {
    res.render("error");
};
exports.getMainPage = async(req, res) => {
    try {
        const id = req.user.id; // Get the employee ID from the request object
        const employee = await Employee.findByPk(id);
        const userName = employee.name;

        const allAppeals = await Appeal.count();
        const filials = await Appeal.count();
        const employees = await Employee.count({
            where: {
                status: 1,
            },
        });
        const finishedAppeals = await Appeal.count({
            where: {
                finished_at: {
                    [Sequelize.Op.ne]: "", // Not an empty string
                    [Sequelize.Op.not]: null, // Not null
                },
            },
        });
        const resultedAppeals = await Appeal.count({
            where: {
                resulted_at: {
                    [Sequelize.Op.ne]: "", // Not an empty string
                    [Sequelize.Op.not]: null, // Not null
                },
            },
        });

        res.render("index", {
            title: "Main Page",
            userName,
            allAppeals,
            filials,
            finishedAppeals,
            resultedAppeals,
            employees,
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.getMurojaat = async(req, res) => {
    try {
        const searchTerm = req.query.searchBar || "";
        const filterFilial = req.query.filial || "";
        const filterCategory = req.query.category || "";

        let whereConditions = {
            [Op.or]: [{
                    full_name: {
                        [Op.like]: `%${searchTerm}%`,
                    },
                },
                {
                    subject: {
                        [Op.like]: `%${searchTerm}%`,
                    },
                },
                {
                    content: {
                        [Op.like]: `%${searchTerm}%`,
                    },
                },
            ],
        };

        if (filterFilial) {
            whereConditions.filials = filterFilial; // Adjust field name based on your model
        }

        if (filterCategory) {
            whereConditions.category_id = filterCategory; // Adjust field name based on your model
        }

        const appeals = await Appeal.findAll({
            where: {
                emp_id: {
                    [Op.and]: [{
                            [Op.ne]: null,
                        },
                        {
                            [Op.ne]: 0,
                        },
                    ],
                },
            },
            include: [
                { model: Category, as: "categoryDetails" },
                { model: Status, as: "statuses" },
                { model: Employee, as: "employee" },
                { model: Filials, as: "filialDetails" },
            ],
        });

        const categories = await Category.findAll();
        const filials = await Filials.findAll();

        res.render("appeals/murojaatlar", {
            title: "Murojaatlar",
            appeals: appeals || [],
            categories: categories,
            filials: filials,
            filterFilial: filterFilial,
            filterCategory: filterCategory,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.createMurojaat = async(req, res) => {
    try {
        const categories = await Category.findAll({
            where: {
                status: 1,
            },
        });
        const appeal_type = await AppealType.findAll({
            where: {
                status: 1,
            },
        });
        const filials = await Filials.findAll({
            where: {
                status: 1,
            },
        });
        const top_categories = await TopCategories.findAll({
            where: {
                status: 1,
            },
        });
        const employees = await Employee.findAll({
            where: {
                status: 1,
            },
        });

        res.render("appeals/create", {
            // title: "Create Page",
            categories: categories,
            appeal_type: appeal_type,
            filials: filials,
            top_categories: top_categories,
            employees,
            // employees,
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.saveAppeal = async(req, res) => {
    console.log(";-;-;", req.body);
    try {
        const {
            full_name,
            phone_number,
            top_category,
            category_id,
            emp_id,
            appeal_type,
            filials,
            deadline_at,
            subject,
            status,
            content,
            additional_info,
        } = req.body;

        // Assuming `created_at` is auto-managed by Sequelize
        const id = req.user.id; // Get the employee ID from the request object
        const employee = await Employee.findByPk(id);
        const userName = employee.name;
        const created_by = userName ? userName : "Unknown";
        // const resulted_by = req.user ? req.user.name : "Unknown";
        await Appeal.create({
            full_name,
            phone_number,
            top_category,
            category_id,
            appeal_type,
            emp_id,
            deadline_at,
            filials,
            status,
            subject,
            created_by,
            content,
            additional_info,
            // Remove created_at if Sequelize manages this automatically
            // created_at: new Date(),
        });

        res.redirect("/api/appeals");
    } catch (error) {
        console.error("Error saving appeal:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};

exports.getEmpOneApp = async(req, res) => {
    const appId = req.params.id;
    console.log("appId", appId);

    try {
        const appeal = await Appeal.findOne({
            where: {
                id: appId,
            },
            include: [
                { model: TopCategories, as: "topCategoryDetails" },
                { model: AppealType, as: "appealTypeDetails" },
                { model: Filials, as: "filialDetails" },
                { model: Category, as: "categoryDetails" },
                // include other models as needed
            ],
        });

        if (appeal) {
            // Update the appeal's status to 8
            appeal.status = 8;
            await appeal.save();
        } else {
            console.log("Appeal not found");
        }

        if (!appeal) {
            return res.status(404).render("404", { message: "Appeal not found" });
        }

        console.log("Appeal Details:", appeal);

        res.render("profiles/detailEmpApp", {
            title: "Murojaat Details",
            appeal: appeal,
        });
    } catch (error) {
        console.error("Error fetching appeal:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//get employees own profile bu ID
// mainController.js
// const { Op } = require('sequelize'); // Ensure Op is imported for Sequelize operators

exports.getEmpPage = async(req, res) => {
    try {
        const searchTerm = req.query.searchBar || "";
        const filterFilial = req.query.filial || "";
        const filterCategory = req.query.category || "";

        const userId = req.user.id; // Ensure req.user is properly populated with user info

        // Define the search conditions
        let whereConditions = {
            emp_id: userId, // Filter by the logged-in user's ID
            [Op.or]: [{
                    full_name: {
                        [Op.like]: `%${searchTerm}%`,
                    },
                },
                {
                    subject: {
                        [Op.like]: `%${searchTerm}%`,
                    },
                },
                {
                    content: {
                        [Op.like]: `%${searchTerm}%`,
                    },
                },
            ],
        };

        // Apply filters for filial and category if provided
        if (filterFilial) {
            whereConditions.filials = filterFilial; // Adjust field name based on your model
        }

        if (filterCategory) {
            whereConditions.category_id = filterCategory; // Adjust field name based on your model
        }

        // Fetch appeals with filters applied
        const appeals = await Appeal.findAll({
            where: whereConditions,
            include: [
                { model: Category, as: "categoryDetails" },
                { model: Status, as: "statuses" },
                { model: Employee, as: "employee" },
                { model: Filials, as: "filialDetails" },
            ],
        });
        console.log("miyagi", appeals);
        // Fetch categories and filials for dropdown or filter options
        const categories = await Category.findAll();
        const filials = await Filials.findAll();

        // Render the page with the data
        res.render("profiles/empProfile", {
            title: "Mening murojaatlarim",
            appeals: appeals || [],
            categories: categories,
            filials: filials,
            filterFilial: filterFilial,
            filterCategory: filterCategory,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.getLoginPage = async(req, res) => {
    try {
        res.render("login", {
            title: "Login Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
const generateJWTToken = require("../services/token"); // Adjust the path based on your folder structure

exports.compareLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.redirect("/api/login");
        }

        const existUser = await Employee.findOne({ where: { email } });
        if (!existUser) {
            return res.redirect("/api/login");
        }

        const isPassEqual = await bcrypt.compare(password, existUser.password);
        if (!isPassEqual) {
            return res.redirect("/api/login");
        }

        const token = generateJWTToken(existUser.id, existUser.permission_id); // Ensure generateJWTToken is correctly invoked
        res.cookie("token", token);

        res.redirect("/api/dashboard");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getRegisterPage = async(req, res) => {
    try {
        res.render("register", {
            title: "Register Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.saveRegister = async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.redirect("/api/register");
        return;
    }
    const condidate = await Employee.findOne({ email });
    if (condidate) {
        res.redirect("/api");
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const userdata = {
        name: name,
        email: email,
        password: hashedPassword,
    };
    const user = await Employee.create(userdata);
    console.log(user);
    const token = generateJWTToken(user.id, user.permission_id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
    });
    console.log("token", token);
    res.redirect("/api/dashboard");
};

//edit current password
exports.getRegisterPage = async(req, res) => {
    try {
        res.render("register", {
            title: "Register Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.logout = async(req, res) => {
    try {
        res.clearCookie("token");

        res.redirect("auth/login");
    } catch (error) {
        console.error("Error during logout:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
exports.updateEmpOneApp = async(req, res) => {
    const { accepted_comment, id } = req.body;

    try {
        // Find the Appeal by ID
        const appeal = await Appeal.findOne({
            where: {
                id: id,
            },
        });

        if (!appeal) {
            return res.status(404).json({ message: "Appeal not found" });
        }
        console.log("popa", accepted_comment);

        // Update accepted_comment and accepted_at
        appeal.accepted_comment = accepted_comment || "Qabul qildim"; // Default comment if none provided
        appeal.accepted_at = new Date(); // Set current date and time
        appeal.status = 8; // Assuming 2 is the status code for "accepted"
        console.log("oxirgisi", appeal);
        // Save changes
        await appeal.save();

        // Redirect to the route with the userId
        res.redirect(`/api/emp-profile`);
    } catch (error) {
        console.error("Error updating appeal:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
exports.empFinishApp = async(req, res) => {
    const userId = req.user.id; // Get the employee ID from the request object
    const employee = await Employee.findByPk(userId);
    const userName = employee.name;
    const resulted_by = userName ? userName : "Unknown";
    const id = req.params.id;
    console.log("keldi", id);
    try {
        // Find the Appeal by ID
        const appeal = await Appeal.findOne({
            where: {
                id: id,
            },
        });

        if (!appeal) {
            return res.status(404).json({ message: "Appeal not found" });
        }
        // console.log("popa", accepted_comment);

        // Update accepted_comment and accepted_at
        appeal.resulted_comment = "Murojaat yopildi"; // Default comment if none provided
        appeal.resulted_at = new Date(); // Set current date and time
        appeal.result_by = resulted_by; // Set current date and time
        appeal.status = 9; // Assuming 2 is the status code for "accepted"
        console.log("oxirgisi", appeal);
        // Save changes
        await appeal.save();

        // Redirect to the route with the userId
        res.redirect(`/api/emp-profile`);
    } catch (error) {
        console.error("Error updating appeal:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
exports.empClosedApp = async(req, res) => {
    const userId = req.user.id; // Get the employee ID from the request object
    const employee = await Employee.findByPk(userId);
    const userName = employee.name;
    const finished_by = userName ? userName : "Unknown";
    const id = req.params.id;
    console.log("keldi", id);
    try {
        // Find the Appeal by ID
        const appeal = await Appeal.findOne({
            where: {
                id: id,
            },
        });

        if (!appeal) {
            return res.status(404).json({ message: "Appeal not found" });
        }
        // console.log("popa", accepted_comment);

        // Update accepted_comment and accepted_at
        appeal.finished_comment = "Murojaat tugatildi"; // Default comment if none provided
        appeal.finished_at = new Date(); // Set current date and time
        appeal.finished_by = finished_by; // Set current date and time
        appeal.status = 10; // Assuming 2 is the status code for "accepted"
        console.log("oxirgisi", appeal);
        // Save changes
        await appeal.save();

        // Redirect to the route with the userId
        res.redirect(`back`);
    } catch (error) {
        console.error("Error updating appeal:", error);
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
};
exports.getEmployeesByFilials = async(req, res) => {
    const { filial_id } = req.query;

    if (!filial_id) {
        return res.status(400).json({ error: "Filial ID is required" });
    }

    try {
        // Find employees based on filial_id
        const employees = await Employee.findAll({
            where: {
                filial_id: filial_id, // Make sure this field matches your Employee model's foreign key
            },
            attributes: ["id", "name"], // Adjust attributes as needed
        });

        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.resultedApps = async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: appeals } = await Appeal.findAndCountAll({
            where: {
                resulted_at: {
                    [Sequelize.Op.and]: {
                        [Sequelize.Op.not]: null, // Not null
                        [Sequelize.Op.ne]: "", // Not empty string
                    },
                },
                // status: 9,
            },
            include: [
                { model: Category, as: "categoryDetails" },
                { model: Status, as: "statuses" },
                { model: Employee, as: "employee" },
                { model: Filials, as: "filialDetails" },
                { model: TopCategories, as: "topCategoryDetails" },
                { model: AppealType, as: "appealTypeDetails" },
            ],
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);
        res.render("profiles/resulted", {
            title: "Results Page",
            appeals: appeals,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.finishedApps = async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const { count, rows: appeals } = await Appeal.findAndCountAll({
            where: {
                finished_at: {
                    [Sequelize.Op.and]: {
                        [Sequelize.Op.not]: null, // Not null
                        [Sequelize.Op.ne]: "", // Not empty string
                    },
                },
            },
            include: [
                { model: Category, as: "categoryDetails" },
                { model: Status, as: "statuses" },
                { model: Employee, as: "employee" },
                { model: Filials, as: "filialDetails" },
                { model: TopCategories, as: "topCategoryDetails" },
                { model: AppealType, as: "appealTypeDetails" },
            ],
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);
        res.render("profiles/finished", {
            title: "Finished Page",
            appeals: appeals,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
// exports.getDetailSingleAppeal = async(req, res) => {
//     try {
//         const appId = req.params.id;

//         const appeal = await Appeal.findOne({
//             where: {
//                 id: appId,
//                 status: 1,
//             },
//         });

//         if (!appeal) {
//             return res.status(404).json({ message: "Appeal not found" });
//         }
//         const filials = await Filials.findAll();
//         const employees = await Employee.findAll();
//         res.render("detailAppel/index", {
//             appeal,
//             filials,
//             employees,
//         });
//     } catch (error) {
//         console.error("Error rendering edit status page:", error);
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };