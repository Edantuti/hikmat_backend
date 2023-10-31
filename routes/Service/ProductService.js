const { ProductModel } = require("../../db/models/ProductModel");
const { ReviewModel } = require("../../db/models/ReviewModel");
const { CartModel } = require("../../db/models/CartModel");
const { OrderModel } = require("../../db/models/OrderModel");
const { UserModel } = require("../../db/models/UserModel");
const { sequelize } = require("../../db/connect");
const { retrieveUser } = require("./UserService");
const { createBrand, createCategory } = require("./AdminService");
const { DealsModel } = require("../../db/models/DealsModel");
const { QueryTypes } = require("sequelize");
const { getUrl } = require("../../storage/functions");

module.exports.createProduct = async (data) => {
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

module.exports.modifyProduct = async (data, id) => {
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

module.exports.retrieveProduct = async (data, offset = 0, limit = 12) => {
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

module.exports.removeProduct = async (data) => {
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

module.exports.createReview = async (data) => {
  try {
    const userData = await retrieveUser({ id: data.userId });
    const result = await sequelize.transaction(async (t) => {
      const product = await ProductModel.findByPk(data.productId, {
        transaction: t,
      });
      const reviewCount = await ReviewModel.count({
        where: { productId: data.productId },
        transaction: t,
      });
      const ratingValue = Math.floor(
        (product.getDataValue("rating") * reviewCount + parseInt(data.rating)) /
        (reviewCount + 1),
      );

      await ProductModel.update(
        { rating: ratingValue },
        { where: { id: data.productId }, transaction: t },
      );
      const review = await ReviewModel.create(
        { ...data, userId: data.userId },
        { transaction: t },
      );
      review.setProduct(product, { transaction: t })
      return review;
    });
    return { status: "SUCCESS", result: { ...result, User: userData } };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

module.exports.RetrieveReview = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const review = await ReviewModel.findAndCountAll({
        where: {
          ProductId: data.productId,
        },
        order: [["createdAt", "DESC"]],
        include: [UserModel],
        offset: data.offset,
        limit: 3,
        transaction: t,
      });
      review.rows.forEach(async (view) => {
        const user = view.dataValues.User
        return view.set("Users", user.set("profile_url", await getUrl(user.getDataValue("profile_url"))))
      })
      return review;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};
