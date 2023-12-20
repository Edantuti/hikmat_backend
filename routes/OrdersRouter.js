import { Router } from "express";
import { getOrders, getAllOrders, postOrder, patchOrder } from "../controller/OrderController.js";
import { AuthCheckAdminMiddleware, AuthCheckMiddleware } from "../middleware/authentication.js";

const OrderRouter = Router()
OrderRouter.get("/orders", getOrders)
OrderRouter.get("/orders/all", AuthCheckAdminMiddleware, getAllOrders)
OrderRouter.patch("/orders/delivered", AuthCheckAdminMiddleware, patchOrder)
OrderRouter.patch("/orders/cancelled", AuthCheckMiddleware, patchOrder)
OrderRouter.patch("/orders", AuthCheckAdminMiddleware, patchOrder)
OrderRouter.post("/orders", AuthCheckMiddleware, postOrder)

export {
  OrderRouter
}
