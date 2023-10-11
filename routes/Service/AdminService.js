
const { BrandModel } = require("../../db/models/BrandModel")
const { CategoryModel } = require("../../db/models/CategoryModel")

const { sequelize } = require("../../db/connect")


module.exports.createCategory = async (data) => {
  console.log(data)
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await CategoryModel.findOrCreate(
        { where: data, transaction: t }
      )
      return category
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.createBrand = async (data) => {
  console.log(data)
  try {
    const result = await sequelize.transaction(async (t) => {
      const brand = await BrandModel.findOrCreate(
        { where: data, transaction: t }
      )
      return brand
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.deleteBrand = async (data) => {
  console.log(data)
  try {
    const result = await sequelize.transaction(async (t) => {
      const brand = await BrandModel.destroy(
        { where: { id: data.id }, transaction: t }
      )
      return brand
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.deleteCategory = async (data) => {
  console.log(data)
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await CategoryModel.delete(
        { where: { id: data.id }, transaction: t }
      )
      return category
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}


module.exports.retrieveCategory = async () => {

  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await CategoryModel.findAll({},
        { transaction: t }
      )
      return category
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.retrieveBrand = async () => {

  try {
    const result = await sequelize.transaction(async (t) => {
      const brand = await BrandModel.findAll({},
        { transaction: t }
      )
      return brand
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}
