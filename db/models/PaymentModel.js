const { sequelize } = require("../connect")
const { DataTypes } = require("sequelize")

const Payment = sequelize.define("Payment", {
  razorpay_payment_id: {
    type: DataTypes.TEXT,
    primaryKey: true,
    allowNull: false,
  },
  razorpay_order_id: {
    type: DataTypes.TEXT,
    primaryKey: true,
    allowNull: false,
  },
  razorpay_signature: {
    type: DataTypes.TEXT,
    primaryKey: true,
    allowNull: false,
  }
})

module.exports.PaymentModel = Payment
