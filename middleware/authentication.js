import { UserModel } from "../models/UserModel.js";
import { tokenChecker, tokenDecoder } from "../util.js";
const AuthCheckMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").substring(7);
    if (!tokenChecker(token))
      return res.status(401).json("User is Unauthorized");
    next();
  } catch (error) {
    return res.status(401).json("Unauthorized");
  }
};

const AuthCheckAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization").substring(7);
    if (!tokenChecker(token))
      return res.status(401).json("User is Unauthorized");
    const user = await UserModel.findByPk(tokenDecoder(token).userid);
    if (!user.dataValues.isAdmin)
      return res.status(401).json("User is Unauthorized");
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json("Unauthorized");
  }
};

export { AuthCheckMiddleware, AuthCheckAdminMiddleware };
