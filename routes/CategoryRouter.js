import { Router } from "express";

import {
  postCategory,
  deleteCategory,
  getCategory,
} from "../controller/AdminController.js";
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js";

const CategoryRouter = Router();
CategoryRouter.get("/categories", getCategory);
CategoryRouter.post("/admin/categories", AuthCheckAdminMiddleware, postCategory);
CategoryRouter.delete(
  "/admin/categories",
  AuthCheckAdminMiddleware,
  deleteCategory,
);

export { CategoryRouter };
