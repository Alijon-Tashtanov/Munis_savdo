const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Positions = sequelize.define(
        "Positions", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            permission_id: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "permissions",
                    key: "id",
                },
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
        }, {
            timestamps: false,
            tableName: "positions",
        }
    );
    return Positions;
};