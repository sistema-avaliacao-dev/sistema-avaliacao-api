import { Router } from "express";
import UserController from "../controllers/UserController";
import Auth from "../middlewares/Auth";

export const authRoutes = Router();

authRoutes.post('/login', Auth.login)