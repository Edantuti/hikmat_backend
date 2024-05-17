import { DataTypes } from "sequelize";
import { sequelize } from "../util.js";
import { UserModel } from "./UserModel.js";

export const AddressModel = sequelize.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  state: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

AddressModel.belongsTo(UserModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
});
