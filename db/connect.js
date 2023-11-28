const { Sequelize } = require("sequelize")
const Razorpay = require("razorpay")
const { database_name, database_user, database_password, database_url, database_ssl } = require("../config")


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
    // ssl: {
    //   require: database_ssl
    // },
    dateString: true,
    typeCast: true,
  }
}, {
  logging: console.log,

})

module.exports.RazorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
})
