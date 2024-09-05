const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Permissions extends Model {}

    Permissions.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // createdAt: {
        //     type: DataTypes.DATE,
        //     allowNull: false,
        // },
        created_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // updatedAt: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        updated_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Permissions",
        tableName: "permissions", // Ensure this matches your database table name
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });

    return Permissions;
};