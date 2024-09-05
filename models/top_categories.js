const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class TopCategories extends Model {}

    TopCategories.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "TopCategories",
        tableName: "top_categories", // Ensure this matches your database table name
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });

    return TopCategories;
};