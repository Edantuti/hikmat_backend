const { AddressModel } = require("../../db/models/AddressModel")
const { sequelize } = require("../../db/connect")

module.exports.createAddress = async (data, userid) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const address = await AddressModel.findOrCreate(
        { where: { userId: userid }, defaults: { ...data, userId: userid }, transaction: t }
      )
      return address
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}

module.exports.modifyAddress = async (data, userid) => {
  try {
    if (await AddressModel.findOne({ where: { userId: userid } }))
      await sequelize.transaction(async (t) => {
        await AddressModel.update(
          { ...data },
          { where: { userId: userid }, transaction: t }
        )
      })
    else {
      this.createAddress(data, userid)
    }
    return { status: "SUCCESS" }
  } catch (error) {
    console.error(error)
    return { status: "FAILED" }
  }
}

module.exports.retrieveAddress = async (userid) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const address = await AddressModel.findOne({ where: { userId: userid }, transaction: t })
      return address
    })
    return { status: "SUCCESS", result }
  } catch (error) {
    console.error(error)
    return { status: "FAILED", error }
  }
}
