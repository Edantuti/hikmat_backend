const { DataTypes } = require("sequelize");
const { sequelize } = require("../connect");
const { UserModel } = require("./UserModel");
const { ProductModel } = require("./ProductModel");

const Cart = sequelize.define("Cart", {
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


Cart.belongsTo(UserModel, { foreignKey: "userId" });
Cart.belongsTo(ProductModel, { foreignKey: "productId" });
UserModel.hasMany(Cart, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "RESTRICT", hooks: true });
ProductModel.hasMany(Cart, { foreignKey: "productId", onDelete: "CASCADE", onUpdate: "RESTRICT", hooks: true });

module.exports.CartModel = Cart;
