const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        "Employee", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false, // Ensure it's defined and not null
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false, // Ensure it's defined and not null
            },

            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            filial_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "filials",
                    key: "id",
                },
            },
            position_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "positions",
                    key: "id",
                },
            },
            permission_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "permissions",
                    key: "id",
                },
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Untitled",
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Unknown",
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        }, {
            timestamps: false,
            tableName: "employees",
        }
    );
    return Employee;
};