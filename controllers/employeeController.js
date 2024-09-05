const { Op } = require("sequelize");
const {
    Employee,
    Appeal,
    Category,
    AppealType,
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

        const { rows: data, count } = await User.findAndCountAll({
            where: whereConditions,
            include: [
                { model: Filials, as: "filial" },
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

        const totalPages = Math.ceil(count / limit);

        res.render("users/index", {
            data: data || [],
            permissions: permissions,
            filials: filials,
            filterFilial: filterFilial,
            filterPermission: filterPermission,
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

        res.render("employees/create", {
            title: "Create Page",
            positions: positions,
            filials: filials,
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
        const { name, phone, filial_id, position_id, title } = req.body;

        await Employee.create({
            name,
            phone,
            filial_id,
            position_id,
            title,
            created_at: new Date(),
            updated_at: new Date(),
        });
        res.redirect("/api/employees");
    } catch (error) {
        console.error("Error saving appeal:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error,
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
        const itemId = req.params.id;
        const result = await Employee.update({ status: 0 }, { where: { id: itemId } });

        if (result[0] === 0) {
            return res.status(404).json({ error: "No Filial found with this ID" });
        }
        res.redirect("/api/employees");
    } catch (error) {
        console.error("Error deleting Filial:", error); // Log the actual error for debugging
        res
            .status(500)
            .json({ error: "An error occurred while deleting the item" });
    }
};