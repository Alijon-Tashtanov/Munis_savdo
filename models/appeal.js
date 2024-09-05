const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Appeal = sequelize.define(
        "Appeal", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            full_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "categories",
                    key: "id",
                },
            },

            appeal_type: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "appeal_type",
                    key: "id",
                },
            },
            filials: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "filials",
                    key: "id",
                },
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            additional_info: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            },
            emp_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "employees",
                    key: "id",
                },
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "statuses",
                    key: "id",
                },
            },
            deadline_at: {
                type: DataTypes.DATE, // or Sequelize.DATEONLY if only date is needed
                allowNull: true, // or false if it’s required
                // or any valid default value
            },
        }, {
            timestamps: false,
            tableName: "appeals",
        }
    );
    return Appeal;
};