import { Router } from "express";
import UserController from "../controllers/UserController";
import Auth from "../middlewares/Auth";

export const userRoutes = Router();

userRoutes.post('/', Auth.checkToken, Auth.isAdmin, UserController.create)
userRoutes.get('/', Auth.checkToken, UserController.getUser)
userRoutes.put('/password', Auth.checkToken, UserController.updatePassword)