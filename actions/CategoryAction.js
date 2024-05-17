import { sequelize } from "../util.js";
import { CategoryModel } from "../models/CategoryModel.js";

const createCategory = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await CategoryModel.findOrCreate({
        where: data,
        transaction: t,
      });
      return category;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

const destoryCategory = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await CategoryModel.destroy({
        where: { id: data.id },
        transaction: t,
      });
      return category;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

const retrieveCategory = async () => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const category = await CategoryModel.findAll({}, { transaction: t });
      return category;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

export { retrieveCategory, destoryCategory, createCategory };
