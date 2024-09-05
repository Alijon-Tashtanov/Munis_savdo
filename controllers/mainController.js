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
    Status,
    User,
    Employee,
} = require("../models");

exports.getMainPage = async(req, res) => {
    try {
        res.render("index", {
            title: "Main Page",
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
        const created_by = req.user ? req.user.name : "Unknown";
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
            error: error.message,
        });
    }
};

exports.getEmployeesByFilials = async(req, res) => {
    const filialId = req.query.filial_id;
    console.log("aaaa", filialId);

    if (!filialId) {
        return res.status(400).json({ error: "Filial ID is required" });
    }

    try {
        const employees = await Employee.findAll({
            where: {
                filial_id: filialId,
                status: 1,
            },
        });
        res.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
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