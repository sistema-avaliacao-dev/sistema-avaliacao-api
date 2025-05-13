"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avaliacaoRoutes = void 0;
const express_1 = require("express");
const AvaliacaoController_1 = __importDefault(require("../controllers/AvaliacaoController"));
const AvaliacaoRespostaController_1 = __importDefault(require("../controllers/AvaliacaoRespostaController"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
exports.avaliacaoRoutes = (0, express_1.Router)();
exports.avaliacaoRoutes.post('/', Auth_1.default.checkToken, Auth_1.default.isAdmin, AvaliacaoController_1.default.create);
exports.avaliacaoRoutes.get('/', Auth_1.default.checkToken, AvaliacaoController_1.default.get);
exports.avaliacaoRoutes.get('/subcomissao', Auth_1.default.checkToken, AvaliacaoController_1.default.getBySubcomissao);
exports.avaliacaoRoutes.get('/comissao', Auth_1.default.checkToken, AvaliacaoController_1.default.getByComissao);
exports.avaliacaoRoutes.post('/resposta', Auth_1.default.checkToken, Auth_1.default.isServidor, AvaliacaoRespostaController_1.default.create);
exports.avaliacaoRoutes.get('/resposta', Auth_1.default.checkToken, AvaliacaoRespostaController_1.default.get);
//# sourceMappingURL=avaliacaoRoutes.js.map