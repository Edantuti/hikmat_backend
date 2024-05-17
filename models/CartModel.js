import { DataTypes } from "sequelize";
import { sequelize } from "../util.js";
import { UserModel } from "./UserModel.js";
import { ProductModel } from "./ProductModel.js";

export const CartModel = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

CartModel.belongsTo(UserModel, { foreignKey: "userId" });
CartModel.belongsTo(ProductModel, { foreignKey: "productId" });
UserModel.hasMany(CartModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
  hooks: true,
});
ProductModel.hasMany(CartModel, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
  hooks: true,
});
