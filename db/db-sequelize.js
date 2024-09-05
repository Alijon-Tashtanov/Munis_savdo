// db/db-sequelize.js
const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize("munis_savdo_test", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;