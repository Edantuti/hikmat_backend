const { DataTypes } = require("sequelize")
const { sequelize } = require("../connect")
const { ProductModel } = require("./ProductModel")
//TODO:Create a Delete function for deals
const Deals = sequelize.define("Deal", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: "",
    allowNull: false
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
})

Deals.belongsToMany(ProductModel, { through: "DealProduct", foreignKey: "dealId", constraints: false, unique: false })
ProductModel.belongsToMany(Deals, { onDelete: 'CASCADE', through: 'DealProduct', foreignKey: "productId", constraints: false, unique: false, hooks: true })

module.exports.DealsModel = Deals

