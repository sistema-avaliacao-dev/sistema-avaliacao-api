import { Router } from "express";
import CargoController from "../controllers/CargoController";
import Auth from "../middlewares/Auth";

export const cargoRoutes = Router();

cargoRoutes.get('/', Auth.checkToken, CargoController.get)