import { Router } from "express"
import { postPayment, postVerifyPayment } from "../controller/PaymentController.js"
import { AuthCheckMiddleware } from "../middleware/authentication.js"

const PaymentRouter = Router()

PaymentRouter.post("/checkout", AuthCheckMiddleware, postPayment)
PaymentRouter.post("/checkout/verify", postVerifyPayment)


export {
  PaymentRouter
}
