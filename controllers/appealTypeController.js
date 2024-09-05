const { Op } = require("sequelize");
const { AppealType } = require("../models");
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

        const { count, rows } = await AppealType.findAndCountAll({
            where: whereConditions,
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);

        res.render("appeal_types/index", {
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

exports.createAppeal_type = async(req, res) => {
    try {
        res.render("appeal_types/create", {
            title: "AppealType Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.saveAppeal_type = async(req, res) => {
    try {
        const { name, status } = req.body;

        await AppealType.create({
            name,
            status,
        });
        res.redirect("/api/appeal_types");
    } catch (error) {
        console.error("Error saving status:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};

exports.getDetailAppeal_type = async(req, res) => {
    try {
        const posId = req.params.id;

        const data = await AppealType.findOne({
            where: {
                id: posId,
                status: 1,
            },
        });

        if (!data) {
            return res.status(404).json({ message: "AppealType not found" });
        }

        res.render("appeal_types/detail", {
            data,
        });
    } catch (error) {
        console.error("Error rendering edit status page:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.updateAppeal_type = async(req, res) => {
    try {
        const statusId = req.params.id;
        const updateData = req.body;

        const appeal_type = await AppealType.findByPk(statusId);

        if (!appeal_type) {
            return res.status(404).json({ message: "AppealType not found" });
        }

        await appeal_type.update(updateData);

        res.redirect("/api/appeal_types");
    } catch (error) {
        console.error("Error updating appeal_types:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deleteAppeal_type = async(req, res) => {
    try {
        const itemId = req.params.id;
        await AppealType.update({ status: 0 }, { where: { id: itemId } });
        res.redirect("/api/appeal_types");
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};