const { Op } = require("sequelize");
const {
    Appeal,
    Category,
    AppealType,
    Filials,
    TopCategories,
    Positions,
    Permissions,
    Employee,
} = require("../models");

// exports.getMainPage = async(req, res) => {
//     try {
//         const data = await Positions.findAll();
//         res.render("positions/index", {
//             title: "Positions Page",
//             data: data,
//         });
//     } catch (error) {
//         console.error("Error fetching data:", error.message);
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };

exports.getPositions = async(req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit, 10) || 10; // Number of results per page, default to 10
        const searchTerm = req.query.searchBar || ""; // Search term
        const filterCategory = req.query.permission || ""; // Filter category

        const offset = (page - 1) * limit;

        let whereConditions = {
            [Op.or]: [{
                title: {
                    [Op.like]: `%${searchTerm}%`,
                },
            }, ],
            status: 1,
        };

        if (filterCategory) {
            whereConditions.permission_id = filterCategory;
        }

        const { count, rows } = await Positions.findAndCountAll({
            where: whereConditions,
            include: [{ model: Permissions, as: "permission" }],
            limit: limit,
            offset: offset,
        });

        const permissions = await Permissions.findAll();

        const totalPages = Math.ceil(count / limit);

        res.render("positions/index", {
            positions: rows || [],
            permissions: permissions,
            filterCategory: filterCategory,
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
            searchTerm: searchTerm, // Pass searchTerm to EJS template
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.createPosition = async(req, res) => {
    try {
        const permissions = await Permissions.findAll();
        console.log("PNAME", permissions);
        res.render("positions/create", {
            title: "Position Page",
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
exports.savePosition = async(req, res) => {
    try {
        const { title, permission_id } = req.body;

        const id = req.user.id; // Get the employee ID from the request object
        const employee = await Employee.findByPk(id);
        const userName = employee.name;
        const created_by = userName ? userName : "Unknown";

        // Save the data to the database
        await Positions.create({
            title,
            permission_id,
            created_by,
            created_at: new Date(),
            updated_at: new Date(),
        });
        res.redirect("/api/positions");
    } catch (error) {
        console.error("Error saving appeal:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};

exports.getDetailPosition = async(req, res) => {
    try {
        const posId = req.params.id;

        // Fetch the position along with its associated permission
        const position = await Positions.findOne({
            where: { id: posId },
            include: [{ model: Permissions, as: "permission" }],
        });

        // Fetch all permissions for the dropdown
        const permissions = await Permissions.findAll({ where: { status: 1 } });

        if (!position) {
            return res.status(404).json({ message: "Position not found" });
        }

        // Render the detail page with the fetched data
        res.render("positions/detail", {
            position,
            permissions, // Pass permissions as 'permissions' (plural)
        });
    } catch (error) {
        console.error("Error rendering edit position page:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const { Filial } = require("../models"); // Adjust the path to your models

exports.updatePosition = async(req, res) => {
    try {
        const posId = req.params.id;
        const updateData = req.body;

        // Find the filial by ID
        const position = await Positions.findByPk(posId);

        if (!position) {
            return res.status(404).json({ message: "Filial not found" });
        }

        // Update the filial with the new data
        await position.update(updateData);

        // Optionally, you can render a page or send a response after updating
        res.redirect("/api/positions");
    } catch (error) {
        console.error("Error updating filial:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deletePosition = async(req, res) => {
    try {
        const itemId = req.params.id;
        await Positions.update({ status: 0 }, { where: { id: itemId } });
        res.redirect("/api/positions");
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};