import { Router } from "express";
import ComissaoController from "../controllers/ComissaoController";
import ComissaoAlvoController from "../controllers/ComissaoAlvoController";
import ComissaoServidorController from "../controllers/ComissaoServidorController";
import Auth from "../middlewares/Auth";
const comissaoRoutes = Router();

comissaoRoutes.post("/", Auth.checkToken, Auth.isAdmin, ComissaoController.create);
comissaoRoutes.put("/", Auth.checkToken, Auth.isAdmin, ComissaoController.update);
comissaoRoutes.delete("/", Auth.checkToken, Auth.isAdmin, ComissaoController.delete);
comissaoRoutes.get("/", Auth.checkToken, ComissaoController.get);
comissaoRoutes.get("/all", Auth.checkToken, ComissaoController.getAll);

comissaoRoutes.post("/alvo", Auth.checkToken, Auth.isAdmin, ComissaoAlvoController.create);
comissaoRoutes.delete("/alvo", Auth.checkToken, Auth.isAdmin, ComissaoAlvoController.delete);
comissaoRoutes.get("/alvo", Auth.checkToken, ComissaoAlvoController.get);

comissaoRoutes.post("/servidor", Auth.checkToken, Auth.isAdmin, ComissaoServidorController.create);
comissaoRoutes.delete("/servidor", Auth.checkToken, Auth.isAdmin, ComissaoServidorController.delete);
comissaoRoutes.get("/servidor", Auth.checkToken, ComissaoServidorController.get);

comissaoRoutes.get("/servidor-participantes", Auth.checkToken, ComissaoController.getComissaoParticipantesByServidor);

export default comissaoRoutes;