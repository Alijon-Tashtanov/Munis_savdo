const { Op } = require("sequelize");
const { Status } = require("../models");
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

        const { count, rows } = await Status.findAndCountAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.render("statuses/index", {
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

exports.createStatus = async(req, res) => {
    try {
        res.render("statuses/create", {
            title: "Status Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.saveStatus = async(req, res) => {
    try {
        const { name, status } = req.body;

        await Status.create({
            name,
            status,
            // created_at: new Date(),
            // updated_at: new Date(),
        });
        res.redirect("/api/statuses");
    } catch (error) {
        console.error("Error saving status:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};

exports.getDetailStatus = async(req, res) => {
    try {
        const posId = req.params.id;

        // Fetch the position along with its associated permission
        const status = await Status.findOne({
            where: {
                id: posId,
                status: 1,
            },
        });

        if (!status) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.render("statuses/detail", {
            status,
        });
    } catch (error) {
        console.error("Error rendering edit status page:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const { Filial } = require("../models"); // Adjust the path to your models

exports.updateStatus = async(req, res) => {
    try {
        const statusId = req.params.id;
        const updateData = req.body;

        const status = await Status.findByPk(statusId);

        if (!status) {
            return res.status(404).json({ message: "Category not found" });
        }

        await status.update(updateData);

        res.redirect("/api/statuses");
    } catch (error) {
        console.error("Error updating status:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deleteStatus = async(req, res) => {
    try {
        const itemId = req.params.id;
        await Status.update({ status: 0 }, { where: { id: itemId } });
        res.redirect("/api/statuses");
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};