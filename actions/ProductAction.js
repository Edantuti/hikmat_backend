import { sequelize } from "../util.js";
import { ProductModel } from "../models/ProductModel.js";
import { createBrand } from "./BrandAction.js";
import { createCategory } from "./CategoryAction.js";
import { ReviewModel } from "../models/ReviewModel.js";
import { UserModel } from "../models/UserModel.js";
import { DealsModel } from "../models/DealsModel.js";
const createProduct = async (data) => {

  try {
    const result = await sequelize.transaction(async (t) => {
      await createBrand({ name: data.brand });
      await createCategory({ name: data.category });
      const product = await ProductModel.create(data, { transaction: t });
      return product;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};


const modifyProduct = async (data, id) => {
  //TODO:Creating a function which is going to delete changed data including photos

  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await ProductModel.update(
        {
          name: data.name,
          category: data.category,
          benefits: data.benefits,
          brand: data.brand,
          details: data.details,
          price: data.price,
          quantity: data.quantity,
          discount: data.discount,
          size: data.size,
          photos: data.photos,
        },
        {
          where: {
            id: id,
          },

          include: [ProductModel],
          returning: true,
          transaction: t,
        },
      );
      if (data.similarProduct) {
        const similarProduct = await ProductModel.findByPk(
          data.similarProduct,
          { transaction: t },
        );
        await product[1][0].addChildProduct(similarProduct, { transaction: t });
        await similarProduct.addChildProduct(product[1][0], { transaction: t });
      }

      return product;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

const retrieveProduct = async (data, offset = 0, limit = 12) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await ProductModel.findAndCountAll({
        where: data,
        offset: offset,
        limit: limit,
        transaction: t,
        include: [
          {
            model: ProductModel,
            as: "ChildProduct",
            include: [
              { model: ReviewModel, include: [UserModel] }
            ]
          },
          {
            model: ReviewModel,
            include: [UserModel]
          },
          DealsModel
        ],
      });

      return product;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

const removeProduct = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const product = await ProductModel.findByPk(
        data.id, {
        where: {
          id: data.id,
        },
        include: [CartModel, OrderModel, DealsModel],
        transaction: t,
      },
      );
      await sequelize.query(`DELETE FROM "ProductSimilarProduct" WHERE "ParentProductid"=?`, { replacements: [data.id], type: QueryTypes.DELETE })
      await sequelize.query(`DELETE FROM "ProductSimilarProduct" WHERE "ChildProductid"=?`, { replacements: [data.id], type: QueryTypes.DELETE })
      if (product.Orders.length)
        product.removeOrders()
      if (product.Carts.length)
        product.removeCarts()
      if (product.Deals.length)
        product.removeDeals()
      await product.destroy({ transaction: t })
      return product;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

export{

  retrieveProduct,
  removeProduct,
  createProduct,
  modifyProduct,
}