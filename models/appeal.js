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
            top_category: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "top_categories",
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
            accepted_comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            accepted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: true, // Or false if it should never be null
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
            resulted_comment: {
                type: DataTypes.STRING,
            },
            resulted_at: {
                type: DataTypes.DATE,
            },
            result_by: {
                type: DataTypes.STRING,
            },
            finished_comment: {
                type: DataTypes.STRING,
            },
            finished_at: {
                type: DataTypes.DATE,
            },
            finished_by: {
                type: DataTypes.STRING,
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