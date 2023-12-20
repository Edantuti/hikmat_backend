import { BrandModel } from "../models/BrandModel.js"
import { sequelize } from "../util.js"
const createBrand = async (data) => {
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

const destoryBrand = async (data) => {
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
const retrieveBrand = async () => {

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

export{

  retrieveBrand,
  destoryBrand,
  createBrand
}