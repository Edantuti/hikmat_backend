import { Router } from "express";
import {
  postProduct,
  getProducts,
  patchProducts,
  deleteProducts,
  getProductReview,
  postProductReview,
} from "../controller/ProductController.js";
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js";

const ProductRouter = Router();

ProductRouter.get("/products", getProducts);
ProductRouter.post("/products", AuthCheckAdminMiddleware, postProduct);
ProductRouter.patch("/products", AuthCheckAdminMiddleware, patchProducts);
ProductRouter.delete("/products", AuthCheckAdminMiddleware, deleteProducts);
ProductRouter.get("/products/reviews", getProductReview);
ProductRouter.post(
  "/products/reviews",
  AuthCheckAdminMiddleware,
  postProductReview,
);

export { ProductRouter };
