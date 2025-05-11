import { Router } from "express";
import ServidorController from "../controllers/ServidorController";
import multer from "multer";
import Auth from "../middlewares/Auth";

export const servidorRoutes = Router();

const upload = multer({ dest: 'uploads/' });

servidorRoutes.post('/', Auth.checkToken, Auth.isAdmin, upload.single("file"), ServidorController.create)
servidorRoutes.get('/', Auth.checkToken, ServidorController.get)
servidorRoutes.get('/inferiores', Auth.checkToken, ServidorController.getInferiores)

servidorRoutes.post('/email', Auth.checkToken, ServidorController.editEmail)

servidorRoutes.post('/chefia', Auth.checkToken, ServidorController.setChefia)