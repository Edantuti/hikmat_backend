import { Router } from "express"
import { postDeals, getDeals, patchDeals } from "../controller/AdminController.js"
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js"

const DealsRouter = Router()

DealsRouter.get("/deals", getDeals)
DealsRouter.post("/admin/deals", AuthCheckAdminMiddleware, postDeals)
DealsRouter.patch("/admin/deals", AuthCheckAdminMiddleware, patchDeals)

export {
  DealsRouter
}
