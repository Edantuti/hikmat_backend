import { Router } from "express";
import { getAddress, postAddress } from "../controller/AddressController.js";
import { AuthCheckMiddleware } from "../middleware/authentication.js";

const AddressRouter = Router();
AddressRouter.get("/address", AuthCheckMiddleware, getAddress);
AddressRouter.post("/address", AuthCheckMiddleware, postAddress);

export { AddressRouter };
