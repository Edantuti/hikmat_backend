import { DataTypes } from "sequelize"
import { sequelize } from "../util.js"

export const CategoryModel = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
})



