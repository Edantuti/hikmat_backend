const { UserModel } = require("../../db/models/UserModel");
const { sequelize } = require("../../db/connect");
const { OrderModel } = require("../../db/models/OrderModel");
const { CartModel } = require("../../db/models/CartModel");
const { sign, verify, decode } = require("jsonwebtoken");
const { tokenHashValue } = require("../../config");
const { ProductModel } = require("../../db/models/ProductModel");
const { DealsModel } = require("../../db/models/DealsModel");
const { getUrl } = require("../../storage/functions");

module.exports.createUser = async (data) => {
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
};

module.exports.getUser = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = UserModel.findOne({
        where: {
          email: data.email,
        },
        transaction: t,
      });
      return user;
    });
    return result;
  } catch (error) {
    console.error(error);
    return { status: "FAILED", error };
  }
};

module.exports.tokenGenerator = async (data) => {
  return sign(
    {
      email: data.email,
      userid: data.userid,
    },
    tokenHashValue,
    {
      expiresIn: "3d",
      algorithm: "HS256",
    },
  );
};
module.exports.tokenDeserialzer = async (token) => {
  return decode(token, tokenHashValue);
};

module.exports.tokenVerifier = async (token) => {
  try {
    verify(token, tokenHashValue);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports.retrieveUser = async (data) => {
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
};
module.exports.changeUserPassword = async (password, email, id) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await UserModel.update(
        {
          password: password
        },
        {
          where: {
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
module.exports.modifyUser = async (data, id) => {
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

module.exports.getUserOrders = async (data) => {
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
};

module.exports.getUserCart = async (data) => {
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
};

module.exports.changeVerifiedStatus = async (id, status) => {
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
};
