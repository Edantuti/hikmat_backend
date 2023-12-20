import { sequelize } from "../util.js";
import { DealsModel } from "../models/DealsModel.js";
const cronJob = async () => {
  console.log("Executing cron job for deleting any outdated deals.")
  try {
    const deals = await sequelize.transaction(async (t) => {
      const data = await DealsModel.findAll({ transaction: t })
      return data
    })
    deals.forEach((deal) => {
      if (new Date(deal.getDataValue("expiry_date")) < new Date()) {
        deal.destroy()
      }

    })
  } catch (error) {
    console.error(error)
  }
}

export {
  cronJob
}
