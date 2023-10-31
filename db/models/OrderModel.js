const { DataTypes } = require("sequelize");
const { sequelize } = require("../connect");
const { PaymentModel } = require("./PaymentModel");
const { ProductModel } = require("./ProductModel");
const { UserModel } = require("./UserModel");

const Order = sequelize.define("Order", {
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

Order.belongsTo(UserModel, { foreignKey: "userId" });
Order.belongsTo(PaymentModel, { onDelete: "CASCADE", onUpdate: "RESTRICT", hooks: true, foreignKey: "paymentId", targetKey: "razorpay_payment_id" });
Order.belongsToMany(ProductModel, { through: "OrderProduct", foreignKey: "orderId", constraints: false, unique: false })

ProductModel.belongsToMany(Order, { onDelete: 'CASCADE', through: 'OrderProduct', foreignKey: "productId", constraints: false, unique: false, hooks: true });
UserModel.hasMany(Order, { onDelete: "CASCADE", foreignKey: "userId", hooks: true });


module.exports.OrderModel = Order;
