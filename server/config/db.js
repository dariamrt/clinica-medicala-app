const { Sequelize } = require("sequelize");

const db = new Sequelize("clinica_medicala_db", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false, 
    define: { 
        timestamps: true,
        freezeTableName: true,
    },
});

module.exports = db;
