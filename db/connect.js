const { Sequelize } = require("sequelize")
const { database_name, database_user, database_password, database_url } = require("../config.json")


module.exports.connection = async (sequelize) => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database', error)
    }

}

module.exports.sequelize = new Sequelize(database_name, database_user, database_password, {
    host: database_url,
    dialect: 'postgres',
    dialectOptions: {
        dateString: true,
        typeCast: true,
    }
}, {
    logging: console.log,

})
