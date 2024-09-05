const { Op } = require("sequelize");
const {
    Appeal,
    Category,
    AppealType,
    Filials,
    TopCategories,
    Positions,
    Permissions,
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

// const { Op } = require("sequelize");
// const Category = require("../models/category"); // Adjust the path to your Category model

exports.getMainPage = async(req, res) => {
    try {
        // Extract query parameters for pagination and search
        const page = parseInt(req.query.page, 10) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit, 10) || 10; // Number of results per page, default to 10
        const searchTerm = req.query.searchBar || ""; // Search term

        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        // Define where conditions
        const whereConditions = {
            status: 1, // Filter categories with status = 1
        };

        // Add search condition if searchTerm is not empty
        if (searchTerm) {
            whereConditions.name = {
                [Op.like]: `%${searchTerm}%`,
            };
        }

        // Fetch categories with pagination
        const { count, rows } = await Category.findAndCountAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);

        // Render the results
        res.render("categories/index", {
            data: rows || [],
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
            searchTerm: searchTerm,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.createCategory = async(req, res) => {
    try {
        res.render("categories/create", {
            title: "Category Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.saveCategory = async(req, res) => {
    try {
        const { name } = req.body;

        const created_by = req.user ? req.user.name : "Unknown";

        // Save the data to the database
        await Category.create({
            name,
            created_at: new Date(),
        });
        res.redirect("/api/categories");
    } catch (error) {
        console.error("Error saving appeal:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};

exports.getDetailCategory = async(req, res) => {
    try {
        const posId = req.params.id;

        // Fetch the position along with its associated permission
        const category = await Category.findOne({
            where: {
                id: posId,
                status: 1,
            },
        });

        // Fetch all permissions for the dropdown
        const permissions = await Permissions.findAll({ where: { status: 1 } });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.render("categories/detail", {
            category,
        });
    } catch (error) {
        console.error("Error rendering edit category page:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const { Filial } = require("../models"); // Adjust the path to your models

exports.updateCategory = async(req, res) => {
    try {
        const catId = req.params.id;
        const updateData = req.body;

        const category = await Category.findByPk(catId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Update the filial with the new data
        await category.update(updateData);

        // Optionally, you can render a page or send a response after updating
        res.redirect("/api/categories");
    } catch (error) {
        console.error("Error updating category:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deleteCategory = async(req, res) => {
    try {
        const itemId = req.params.id;
        await Category.update({ status: 0 }, { where: { id: itemId } });
        res.redirect("/api/categories");
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};