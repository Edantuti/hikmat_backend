const { PaymentModel } = require("../../db/models/PaymentModel")
const { sequelize } = require("../../db/connect")

module.exports.createPayment = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const payment = PaymentModel.create(data, { transaction: t })
      return payment
    })
    return result
  } catch (error) {
    console.error(error)
    return error
  }
}
