const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

module.exports = (sequelize) => {
    class User extends Model {}

    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure the field is properly defined
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
            type: DataTypes.INTEGER, // Changed to INTEGER
            allowNull: true,
            references: {
                model: "filials",
                key: "id",
            },
        },
        position_id: {
            type: DataTypes.INTEGER, // Changed to INTEGER
            allowNull: true,
            references: {
                model: "positions",
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