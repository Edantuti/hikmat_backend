import { UserModel } from "../models/UserModel.js";
import { CartModel } from "../models/CartModel.js"
import {OrderModel} from "../models/OrderModel.js"
import { ProductModel } from "../models/ProductModel.js";
import { sequelize } from "../util.js";
import { DealsModel } from "../models/DealsModel.js";

const createUser = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = UserModel.create(data, { transaction: t });
      return user;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
}
const retrieveUser = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await UserModel.findOne(
        {
          where: data,
        },
        { transaction: t },
      );

      return user;
    });
    return result;
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
}

const changeUserPassword = async (password, email, id) => {
  try {
    await sequelize.transaction(async (t) => {
      await UserModel.update(
        {
          password: password
        },
        {
          where: {
            id: id,
            email: email
          },
          transaction: t
        }
      )
    })
    return { status: "SUCCESS", message: "Password has been successfully changed." }
  } catch (errors) {
    console.error(errors)
    return { status: "FAILED", errors }
  }
}
const modifyUser = async (data, id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await UserModel.update(
        {
          profile_url: data.profile_url,
          email: data.email,
          last: data.last,
          first: data.first,
          phone: data.phone,
        },
        { where: { id: id }, returning: true, transaction: t },
      );
      return user[1][0];
    });
    return result;
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

const retrieveUserOrders = async (data) => {

  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await UserModel.findByPk(data, {
        include: [OrderModel],
        transaction: t,
      });
      const orders = [];
      for (let orderObj of user.Orders) {
        const order = await OrderModel.findByPk(orderObj.id, {
          include: [ProductModel],
          transaction: t,
        });
        orders.push({ ...order.dataValues });
        0;
      }
      return orders;
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
}
const retrieveUserCart = async (data) => {

  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await UserModel.findByPk(data, {
        include: [CartModel],
        transaction: t,
      });
      const carts = [];

      for (let f of user.Carts) {
        const cart = await CartModel.findByPk(f.id, {
          include: [{ model: ProductModel, include: [DealsModel] }],
          transaction: t,
        });
        carts.push({
          ...cart.Product.dataValues,
          cart_quantity: f.quantity,
          cartid: f.id,
          productid: cart.Product.dataValues.id,
        });
      }
      return carts;
    });
    return result;
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
}

const changeVerifiedStatus = async (id, status) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await UserModel.findByPk(id, { transaction: t });
      user.isVerified = status;
      user.save();
      return user.getDataValue("isVerified");
    });
    return { status: "SUCCESS", result };
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
}

export {
changeUserPassword,
  changeVerifiedStatus,
  modifyUser,
  retrieveUser,
  retrieveUserCart,
  retrieveUserOrders,
  createUser,
}