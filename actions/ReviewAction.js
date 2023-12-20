import { retrieveUser } from "./UserAction.js";

import { sequelize } from "../util.js";
import { ReviewModel } from "../models/ReviewModel.js";
import { ProductModel } from "../models/ProductModel.js";
const createReview = async (data) => {
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

const retrieveReview = async (data) => {
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

export{
    retrieveReview,
    createReview
}