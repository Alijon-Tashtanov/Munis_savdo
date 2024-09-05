const { Op } = require("sequelize");
const { Permissions } = require("../models");
// const Status = require("../models/status");

exports.getMainPage = async(req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const searchTerm = req.query.searchBar || "";

        const offset = (page - 1) * limit;

        const whereConditions = {
            status: 1,
        };

        if (searchTerm) {
            whereConditions.name = {
                [Op.like]: `%${searchTerm}%`,
            };
        }

        const { count, rows } = await Permissions.findAndCountAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.render("permissions/index", {
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

exports.createPermission = async(req, res) => {
    try {
        res.render("permissions/create", {
            title: "Permission Create",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.savePermission = async(req, res) => {
    try {
        const { name } = req.body;
        const created_by = req.user ? req.user.name : "Unknown";
        const updated_by = req.user ? req.user.name : "Unknown";
        await Permissions.create({
            name,
            created_by,
            updated_by,
        });
        res.redirect("/api/permissions");
    } catch (error) {
        console.error("Error saving permissions:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};

exports.getDetailPermission = async(req, res) => {
    try {
        const perId = req.params.id;

        // Fetch the position along with its associated permission
        const data = await Permissions.findOne({
            where: {
                id: perId,
                status: 1,
            },
        });

        if (!data) {
            return res.status(404).json({ message: "Permission not found" });
        }

        res.render("permissions/detail", {
            data,
        });
    } catch (error) {
        console.error("Error rendering edit permission page:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const { Filial } = require("../models"); // Adjust the path to your models

exports.updatePermission = async(req, res) => {
    try {
        const statusId = req.params.id;
        const updateData = req.body;

        const permission = await Permissions.findByPk(statusId);

        if (!permission) {
            return res.status(404).json({ message: "Permission not found" });
        }

        await permission.update(updateData);

        res.redirect("/api/permissions");
    } catch (error) {
        console.error("Error updating permission:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deletePermission = async(req, res) => {
    try {
        const itemId = req.params.id;
        await Permissions.update({ status: 0 }, { where: { id: itemId } });
        res.redirect("/api/permissions");
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};