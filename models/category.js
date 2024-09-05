// models/category.js
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        "Category", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
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
            modelName: "Category",
            tableName: "categories", // Ensure this matches your database table name
            timestamps: true,
        }
    );

    return Category;
};