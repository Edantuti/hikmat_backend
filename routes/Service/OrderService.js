const { OrderModel } = require("../../db/models/OrderModel")
const { sequelize } = require("../../db/connect")
const { ProductModel } = require("../../db/models/ProductModel")
const { UserModel } = require("../../db/models/UserModel")


module.exports.createOrder = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {

      let productData = await ProductModel.findByPk(data.productId, { transaction: t })
      productData.quantity -= data.quantity
      productData.changed("quantity", true)
      productData.save()

      const order = await OrderModel.create(
        {
          quantity: data.quantity,
          amount: data.amount,
          address: data.address,
          city: data.city,
          pincode: data.pincode,
          state: data.state,
          userId: data.userId,
        },
        {
          include: [ProductModel, UserModel],
          transaction: t
        }
      )

      await order.addProducts(productData, { transaction: t })
      return order
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.modifyOrder = async (data, id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const order = await OrderModel.update(data, { where: { id: id } }, { transaction: t })
      return order
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.getAllOrders = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const orders = await OrderModel.findAll({
        transaction: t, include: [ProductModel, {
          model: UserModel,
          attributes: { exclude: ["password", "updatedAt"] }
        }]
      })
      return orders
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}
