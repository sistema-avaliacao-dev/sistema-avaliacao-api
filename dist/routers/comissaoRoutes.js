"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ComissaoController_1 = __importDefault(require("../controllers/ComissaoController"));
const ComissaoAlvoController_1 = __importDefault(require("../controllers/ComissaoAlvoController"));
const ComissaoServidorController_1 = __importDefault(require("../controllers/ComissaoServidorController"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
const comissaoRoutes = (0, express_1.Router)();
comissaoRoutes.post("/", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoController_1.default.create);
comissaoRoutes.put("/", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoController_1.default.update);
comissaoRoutes.delete("/", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoController_1.default.delete);
comissaoRoutes.get("/", Auth_1.default.checkToken, ComissaoController_1.default.get);
comissaoRoutes.get("/all", Auth_1.default.checkToken, ComissaoController_1.default.getAll);
comissaoRoutes.post("/alvo", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoAlvoController_1.default.create);
comissaoRoutes.delete("/alvo", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoAlvoController_1.default.delete);
comissaoRoutes.get("/alvo", Auth_1.default.checkToken, ComissaoAlvoController_1.default.get);
comissaoRoutes.post("/servidor", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoServidorController_1.default.create);
comissaoRoutes.delete("/servidor", Auth_1.default.checkToken, Auth_1.default.isAdmin, ComissaoServidorController_1.default.delete);
comissaoRoutes.get("/servidor", Auth_1.default.checkToken, ComissaoServidorController_1.default.get);
comissaoRoutes.get("/servidor-participantes", Auth_1.default.checkToken, ComissaoController_1.default.getComissaoParticipantesByServidor);
exports.default = comissaoRoutes;
//# sourceMappingURL=comissaoRoutes.js.map