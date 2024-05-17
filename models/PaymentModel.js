import { sequelize } from "../util.js";
import { DataTypes } from "sequelize";

export const PaymentModel = sequelize.define("Payment", {
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
  },
});
