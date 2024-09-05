// const Category = require("../models/category");
// const Filials = require("../models/filials");
// const TopCategory = require("../models/top_categories");
// const Appeal = require("../models/appeal");
const { Op } = require("sequelize");
const {
    Appeal,
    Category,
    AppealType,
    Filials,
    TopCategories,
} = require("../models");

exports.getMainPage = async(req, res) => {
    try {
        const data = await Filials.findAll();
        // console.log(data);
        res.render("filials/index", {
            title: "Filials Page",
            data: data,
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
            where: whereConditions,
            include: [
                { model: Category, as: "categoryDetails" },
                { model: Filials, as: "filialDetails" },
            ],
        });

        const categories = await Category.findAll();
        const filials = await Filials.findAll();

        res.render("murojaatlar", {
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

exports.createFilial = async(req, res) => {
    try {
        res.render("filials/create", {
            title: "Create Page",
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.savesFilial = async(req, res) => {
    try {
        // Extract data from the request body
        const { name } = req.body;

        // Save the data to the database
        await Filials.create({
            name,
            created_at: new Date(),
        });
        res.redirect("/api/filials");
    } catch (error) {
        console.error("Error saving appeal:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
        });
    }
};
exports.getDetailFilial = async(req, res) => {
    try {
        const filialId = req.params.id;

        // Find the filial by ID
        const filial = await Filials.findByPk(filialId);

        if (!filial) {
            return res.status(404).json({ message: "Filial not found" });
        }

        // Render the detail page with the filial data
        res.render("filials/detail", {
            title: "Detail Page",
            filial: filial,
        });
    } catch (error) {
        console.error("Error fetching filial data:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
// const { Filial } = require("../models");

exports.updateFilial = async(req, res) => {
    try {
        const filialId = req.params.id;
        const updateData = req.body;

        const filial = await Filials.findByPk(filialId);

        if (!filial) {
            return res.status(404).json({ message: "Filial not found" });
        }

        await filial.update(updateData);

        res.redirect("/api/filials");
    } catch (error) {
        console.error("Error updating filial:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.deleteFilial = async(req, res) => {
    try {
        const itemId = req.params.id;
        console.log("ID received:", itemId);
        const result = await Filials.update({ status: 0 }, { where: { id: itemId } });
        if (result[0] === 0) {
            return res.status(404).json({ error: "No Filial found with this ID" });
        }

        res.redirect("/api/filials");
    } catch (error) {
        console.error("Error deleting Filial:", error); // Log the actual error for debugging
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};