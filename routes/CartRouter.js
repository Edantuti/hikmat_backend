import { Router } from "express";
import {
  postCartItem,
  deleteCartItem,
  getCartItem,
} from "../controller/CartController.js";
import { AuthCheckMiddleware } from "../middleware/authentication.js";

const CartRouter = Router();

CartRouter.get("/cart", AuthCheckMiddleware, getCartItem);
CartRouter.post("/cart", AuthCheckMiddleware, postCartItem);
CartRouter.delete("/cart", AuthCheckMiddleware, deleteCartItem);

export { CartRouter };
