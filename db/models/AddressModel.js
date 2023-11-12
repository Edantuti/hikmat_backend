const { DataTypes } = require("sequelize");
const { sequelize } = require("../connect");
const { UserModel } = require("./UserModel");

const address = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  state: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pincode: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

address.belongsTo(UserModel, { foreignKey: "userId", onDelete: "CASCADE", onUpdate: "RESTRICT" });

module.exports.AddressModel = address


