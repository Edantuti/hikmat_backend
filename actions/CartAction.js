import { sequelize } from "../util.js";
import { CartModel } from "../models/CartModel.js";
import { UserModel } from "../models/UserModel.js";

const addCartItem = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await UserModel.findByPk(data.userId, {
        transaction: t,
        include: [CartModel],
      });
      console.log(user);
      if (user.Carts.length) {
        const item = user.Carts.find((item, index) => {
          if (item.productId === data.productId) return true;
        });
        if (item) {
          await CartModel.update(
            { quantity: data.quantity },
            {
              where: {
                id: item.id,
              },
              transaction: t,
            },
          );
          return item;
        } else {
          const cart = await CartModel.create(
            {
              userId: data.userId,
              UserId: data.userId,
              productId: data.productId,
              quantity: data.quantity ? data.quantity : 1,
            },
            { transaction: t },
          );
          return cart;
        }
      }
      const cart = await CartModel.create(
        {
          userId: data.userId,
          UserId: data.userId,
          productId: data.productId,
          quantity: data.quantity ? data.quantity : 1,
        },
        { transaction: t },
      );
      return cart;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};
const clearUserCart = async (userid) => {
  console.log(userid);
  try {
    const result = await sequelize.transaction(async (t) => {
      await CartModel.destroy({ where: { userId: userid }, transaction: t });
      return true;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};
const removeCartItem = async (id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const cart = await CartModel.destroy(
        {
          where: {
            id: id,
          },
        },
        { transaction: t },
      );
      return cart;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

export { removeCartItem, clearUserCart, addCartItem };
