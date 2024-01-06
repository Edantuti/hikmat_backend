import { Router } from "express"
import { postDeals, getDeals, patchDeals, deleteDeals } from "../controller/AdminController.js"
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js"

const DealsRouter = Router()

DealsRouter.get("/deals", getDeals)
DealsRouter.post("/admin/deals", AuthCheckAdminMiddleware, postDeals)
DealsRouter.patch("/admin/deals", AuthCheckAdminMiddleware, patchDeals)
DealsRouter.delete("/admin/deals", AuthCheckAdminMiddleware, deleteDeals)

export {
  DealsRouter
}
