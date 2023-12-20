import { sequelize } from "../util.js"
import { ProductModel } from "../models/ProductModel.js"
import { UserModel } from "../models/UserModel.js"
import { PaymentModel } from "../models/PaymentModel.js"
import { OrderModel } from "../models/OrderModel.js"
const createOrder = async (data) => {
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
          paymentId: data.payment_id,
          userId: data.userId,
        },
        {
          include: [PaymentModel, ProductModel, UserModel],
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

const modifyOrder = async (data, id) => {
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

const retrieveAllOrders = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const orders = await OrderModel.findAll({
        transaction: t, include: [PaymentModel, ProductModel, {
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

export {
    retrieveAllOrders,
    modifyOrder,
    createOrder,
}