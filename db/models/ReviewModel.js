const { DataTypes } = require("sequelize")
const { sequelize } = require("../connect")
const { UserModel } = require("./UserModel")
const { ProductModel } = require("./ProductModel")

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 5
    }
  }
})

Review.belongsTo(ProductModel, { foreignKey: 'productId' });
Review.belongsTo(UserModel, { foreignKey: 'userId' });

ProductModel.hasMany(Review, { onDelete: "CASCADE", onUpdate: "RESTRICT", foreignKey: 'productId', hooks: true })
UserModel.hasMany(Review, { onDelete: "CASCADE", onUpdate: "RESTRICT", foreignKey: 'userId' })

module.exports.ReviewModel = Review;
