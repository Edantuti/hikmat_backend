import { DataTypes } from "sequelize"
import { sequelize } from "../util.js"
import { UserModel } from "./UserModel.js"
import { ProductModel } from "./ProductModel.js"

export const ReviewModel = sequelize.define("Review", {
  
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

ReviewModel.belongsTo(ProductModel, { foreignKey: 'productId' });
ReviewModel.belongsTo(UserModel, { foreignKey: 'userId' });

ProductModel.hasMany(ReviewModel, { onDelete: "CASCADE", onUpdate: "RESTRICT", foreignKey: 'productId', hooks: true })
UserModel.hasMany(ReviewModel, { onDelete: "CASCADE", onUpdate: "RESTRICT", foreignKey: 'userId' })


