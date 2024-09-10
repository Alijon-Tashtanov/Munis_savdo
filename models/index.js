const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.json")["development"];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, {
        host: config.host,
        dialect: config.dialect,
    }
);

const Appeal = require("./appeal")(sequelize, DataTypes);
const Category = require("./category")(sequelize, DataTypes);
const Positions = require("./positions")(sequelize, DataTypes);
const AppealType = require("./appeal_type")(sequelize, DataTypes);
const Filials = require("./filials")(sequelize, DataTypes);
const Employee = require("./employee")(sequelize, DataTypes);
const TopCategories = require("./top_categories")(sequelize, DataTypes);
const Permissions = require("./permissions")(sequelize, DataTypes);
const Status = require("./status")(sequelize, DataTypes);
const User = require("./user")(sequelize, DataTypes);

Employee.hasMany(Appeal, { foreignKey: "emp_id", as: "appeals" });
Category.hasMany(Appeal, { foreignKey: "category_id", as: "appeals" });
Positions.hasMany(User, { foreignKey: "position_id", as: "positions" });
Status.hasMany(Appeal, { foreignKey: "status" });
Positions.hasMany(Employee, { foreignKey: "position_id", as: "employees" });
AppealType.hasMany(Appeal, { foreignKey: "appeal_type", as: "appeals" });
Filials.hasMany(Appeal, { foreignKey: "filials", as: "appeals" });
Filials.hasMany(User, { foreignKey: "filial_id" });
// Permissions.hasMany(User, { foreignKey: "permission_id", as: "user" });
Filials.hasMany(Employee, { foreignKey: "filial_id", as: "employees" });
TopCategories.hasMany(Appeal, { foreignKey: "top_category", as: "appeals" });

Appeal.belongsTo(Category, {
    foreignKey: "category_id",
    as: "categoryDetails",
});
Appeal.belongsTo(Employee, {
    foreignKey: "emp_id",
    as: "employee",
});
Appeal.belongsTo(Status, {
    foreignKey: "status",
    as: "statuses",
});
Positions.belongsTo(Permissions, {
    as: "permission",
    foreignKey: "permission_id",
});
Appeal.belongsTo(AppealType, {
    foreignKey: "appeal_type",
    as: "appealTypeDetails",
});
Appeal.belongsTo(Filials, { foreignKey: "filials", as: "filialDetails" }); // First alias
Appeal.belongsTo(Filials, { foreignKey: "filials", as: "relatedFilial" }); // Changed alias here
User.belongsTo(Positions, {
    foreignKey: "position_id",
    as: "positions",
});
User.belongsTo(Filials, { foreignKey: "filial_id", as: "filials" });
// User.belongsTo(Permissions, { foreignKey: "permission_id", as: "permissions" });
Appeal.belongsTo(TopCategories, {
    foreignKey: "top_category",
    as: "topCategoryDetails",
});
Employee.belongsTo(Filials, { foreignKey: "filial_id", as: "filial" });
Employee.belongsTo(Permissions, {
    foreignKey: "permission_id",
    as: "permission",
});
Employee.belongsTo(Positions, {
    foreignKey: "position_id",
    as: "position",
});
Permissions.hasMany(Employee, {
    as: "permission",
    foreignKey: "permission_id",
});
Permissions.hasMany(Positions, {
    as: "positions",
    foreignKey: "permission_id",
});

module.exports = {
    sequelize,
    Appeal,
    Category,
    AppealType,
    Filials,
    Positions,
    Employee,
    TopCategories,
    Permissions,
    Status,
    User,
};