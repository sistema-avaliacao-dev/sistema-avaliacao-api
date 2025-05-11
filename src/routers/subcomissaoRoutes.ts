import { Router } from "express";
import SubcomissaoController from "../controllers/SubcomissaoController";
import SubcomissaoAlvoController from "../controllers/SubcomissaoAlvoController";
import SubcomissaoServidorController from "../controllers/SubcomissaoServidorController";
import Auth from "../middlewares/Auth";
const subcomissaoRoutes = Router();

subcomissaoRoutes.post("/", Auth.checkToken, Auth.isAdmin, SubcomissaoController.create);
subcomissaoRoutes.put("/", Auth.checkToken, Auth.isAdmin, SubcomissaoController.update);
subcomissaoRoutes.delete("/", Auth.checkToken, Auth.isAdmin, SubcomissaoController.delete);
subcomissaoRoutes.get("/", Auth.checkToken, SubcomissaoController.get);
subcomissaoRoutes.get("/all", Auth.checkToken, SubcomissaoController.getAll);

subcomissaoRoutes.post("/alvo", Auth.checkToken, Auth.isAdmin, SubcomissaoAlvoController.create);
subcomissaoRoutes.delete("/alvo", Auth.checkToken, Auth.isAdmin, SubcomissaoAlvoController.delete);
subcomissaoRoutes.get("/alvo", Auth.checkToken, SubcomissaoAlvoController.get);

subcomissaoRoutes.post("/servidor", Auth.checkToken, Auth.isAdmin, SubcomissaoServidorController.create);
subcomissaoRoutes.delete("/servidor", Auth.checkToken, Auth.isAdmin, SubcomissaoServidorController.delete);
subcomissaoRoutes.get("/servidor", Auth.checkToken, SubcomissaoServidorController.get);

subcomissaoRoutes.get("/servidor-participantes", Auth.checkToken, SubcomissaoController.getSubcomissaoParticipantesByServidor);

export default subcomissaoRoutes;