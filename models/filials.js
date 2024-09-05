const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Filial extends Model {}

    Filial.init({
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
        modelName: "Filial",
        tableName: "filials", // Ensure this matches your database table name
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });

    return Filial;
};