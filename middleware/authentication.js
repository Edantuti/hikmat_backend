const { UserModel } = require("../db/models/UserModel");
const {
  tokenVerifier,
  tokenDeserialzer,
} = require("../routes/Service/UserService");
module.exports.AuthCheckMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").substring(7);
    if (!(await tokenVerifier(token)))
      return res.status(401).json("User is Unauthorized");
    next();
  } catch (error) {
    return res.status(401).json("Unauthorized");
  }
};

module.exports.AuthCheckAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").substring(7);
    if (!(await tokenVerifier(token)))
      return res.status(401).json("User is Unauthorized");
    const user = await UserModel.findByPk(
      (await tokenDeserialzer(token)).userid,
    );
    if (!user.dataValues.isAdmin)
      return res.status(401).json("User is Unauthorized");
    next();
  } catch (error) {
    return res.status(401).json("Unauthorized");
  }
};
