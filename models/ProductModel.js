import { DataTypes, QueryTypes } from "sequelize"
import { sequelize } from "../util.js"

export const ProductModel = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0.0,
    validate: {
      min: 0.0,
      max: 5.0,
    },
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  benefits: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  details: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
});

ProductModel.belongsToMany(ProductModel,
  {
    onDelete: "CASCADE",
    through: 'ProductSimilarProduct',
    foreignKey: {
      name: "ParentProductid",
      allowNull: true,
    },
    constraints: false,
    as: "ParentProduct",
    hooks: true
  })
ProductModel.belongsToMany(ProductModel,
  {
    through: 'ProductSimilarProduct',
    foreignKey:
    {
      name: "ChildProductid",
      allowNull: true
    },
    as: "ChildProduct",
    constraints: false
  })




