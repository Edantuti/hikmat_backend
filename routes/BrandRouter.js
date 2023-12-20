import { Router } from "express";
import { deleteBrand, getBrand, postBrand } from "../controller/AdminController.js";
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js";

const BrandRouter = Router()
BrandRouter.get("/brands", getBrand)
BrandRouter.post("/admin/brands", AuthCheckAdminMiddleware, postBrand)
BrandRouter.delete("/admin/brands", AuthCheckAdminMiddleware, deleteBrand)


export {
  BrandRouter
}
