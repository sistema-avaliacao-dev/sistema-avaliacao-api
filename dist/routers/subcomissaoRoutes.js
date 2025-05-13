"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubcomissaoController_1 = __importDefault(require("../controllers/SubcomissaoController"));
const SubcomissaoAlvoController_1 = __importDefault(require("../controllers/SubcomissaoAlvoController"));
const SubcomissaoServidorController_1 = __importDefault(require("../controllers/SubcomissaoServidorController"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
const subcomissaoRoutes = (0, express_1.Router)();
subcomissaoRoutes.post("/", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoController_1.default.create);
subcomissaoRoutes.put("/", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoController_1.default.update);
subcomissaoRoutes.delete("/", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoController_1.default.delete);
subcomissaoRoutes.get("/", Auth_1.default.checkToken, SubcomissaoController_1.default.get);
subcomissaoRoutes.get("/all", Auth_1.default.checkToken, SubcomissaoController_1.default.getAll);
subcomissaoRoutes.post("/alvo", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoAlvoController_1.default.create);
subcomissaoRoutes.delete("/alvo", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoAlvoController_1.default.delete);
subcomissaoRoutes.get("/alvo", Auth_1.default.checkToken, SubcomissaoAlvoController_1.default.get);
subcomissaoRoutes.post("/servidor", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoServidorController_1.default.create);
subcomissaoRoutes.delete("/servidor", Auth_1.default.checkToken, Auth_1.default.isAdmin, SubcomissaoServidorController_1.default.delete);
subcomissaoRoutes.get("/servidor", Auth_1.default.checkToken, SubcomissaoServidorController_1.default.get);
subcomissaoRoutes.get("/servidor-participantes", Auth_1.default.checkToken, SubcomissaoController_1.default.getSubcomissaoParticipantesByServidor);
exports.default = subcomissaoRoutes;
//# sourceMappingURL=subcomissaoRoutes.js.map