const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class AppealType extends Model {}

    AppealType.init({
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
        modelName: "AppealType",
        tableName: "appeal_types", // Ensure this matches your database table name
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });

    return AppealType;
};