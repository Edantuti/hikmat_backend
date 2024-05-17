import { sequelize } from "../util.js";
import { PaymentModel } from "../models/PaymentModel.js";
const createPayment = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const payment = PaymentModel.create(data, { transaction: t });
      return payment;
    });
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export { createPayment };
