import { DataTypes } from "sequelize";
import { sequelize } from "../util.js";
import { PaymentModel } from "./PaymentModel.js";
import { ProductModel } from "./ProductModel.js";
import { UserModel } from "./UserModel.js";

export const OrderModel = sequelize.define("Order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  quantity: DataTypes.INTEGER.UNSIGNED,
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  delivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dtdcid: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  cancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
  },
  pincode: {
    type: DataTypes.INTEGER,
  },
  state: {
    type: DataTypes.STRING,
  },
});

OrderModel.belongsTo(UserModel, { foreignKey: "userId" });
OrderModel.belongsTo(PaymentModel, {
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
  hooks: true,
  foreignKey: "paymentId",
  targetKey: "razorpay_payment_id",
});
OrderModel.belongsToMany(ProductModel, {
  through: "OrderProduct",
  foreignKey: "orderId",
  constraints: false,
  unique: false,
});

ProductModel.belongsToMany(OrderModel, {
  onDelete: "CASCADE",
  through: "OrderProduct",
  foreignKey: "productId",
  constraints: false,
  unique: false,
  hooks: true,
});
UserModel.hasMany(OrderModel, {
  onDelete: "CASCADE",
  foreignKey: "userId",
  hooks: true,
});
