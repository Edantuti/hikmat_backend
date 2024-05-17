import { Router } from "express";

import {
  postCategory,
  deleteCategory,
  getCategory,
} from "../controller/AdminController.js";
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js";

const CategoryRouter = Router();
CategoryRouter.get("/categories", getCategory);
CategoryRouter.post("/admin/category", AuthCheckAdminMiddleware, postCategory);
CategoryRouter.delete(
  "/admin/category",
  AuthCheckAdminMiddleware,
  deleteCategory,
);

export { CategoryRouter };
