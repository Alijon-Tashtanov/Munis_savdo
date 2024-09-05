// const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config.json"); // Adjust the path as necessary

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Status extends Model {}

    Status.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "Status",
        tableName: "statuses", // Ensure this matches your database table name
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });

    return Status;
};