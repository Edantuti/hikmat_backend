const { ProductModel } = require("../../db/models/ProductModel");
const { DealsModel } = require('../../db/models/DealsModel')
const { sequelize } = require("../../db/connect");
module.exports.createDeals = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await ProductModel.findByPk(data.productId, { transaction: t })
      const deals = await DealsModel.create({ name: data.name, image: product.photos[0], discount: data.discount, expiry_date: data.expiry_date }, { transaction: t });
      await deals.addProducts(product, { transaction: t })
      return deals;
    })
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error };
  }
}

module.exports.modifyDeals = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const deals = await DealsModel.update(data, {
        where: {
          id: data.id
        }, returning: true, transaction: t
      })
      return deals
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}
module.exports.retrieveDeals = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const deals = await DealsModel.findAll({ where: data, include: [{ model: ProductModel, include: [DealsModel] }], transaction: t })
      return deals
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}
module.exports.deleteDeals = async (data) => {
  try {
    await sequelize.transaction(async (t) => {
      await DealsModel.destroy({ where: data, transaction: t })
    })
    return { status: "SUCCESS" }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}
