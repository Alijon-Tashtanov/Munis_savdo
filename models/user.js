// const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config.json"); // Adjust the path as necessary

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class User extends Model {}

    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        filial_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: "filials",
                key: "id",
            },
        },
        permission_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: "permissions",
                key: "id",
            },
        },
    }, {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
    });

    return User;
};