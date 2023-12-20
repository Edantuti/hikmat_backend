import { Router } from "express"
import {
  postUserRegister,
  postUserUpdate,
  getUserVerify,
  getUserPassword,
  postUserForgotPassword,
  postUserLogin,
  postUserPassword
} from "../controller/UserController.js"
import { AuthCheckAdminMiddleware } from "../middleware/authentication.js"


const UserRouter = Router()
UserRouter.get("/auth/verify", getUserVerify)
UserRouter.get("/auth/password", getUserPassword)

UserRouter.post("/auth/login", postUserLogin)
UserRouter.post("/auth/password", AuthCheckAdminMiddleware, postUserPassword)
UserRouter.post("/auth/register", postUserRegister)
UserRouter.post("/auth/update", postUserUpdate)
UserRouter.post("/auth/change", postUserForgotPassword)


export {
  UserRouter
}

