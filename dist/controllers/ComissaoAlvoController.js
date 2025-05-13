"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const ResponseHandler_1 = require("../middlewares/ResponseHandler");
const ComissaoAlvoService_1 = __importDefault(require("../services/ComissaoAlvoService"));
class ComissaoAlvoController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comissoes_avaliadoras_id = req.body.comissoes_avaliadoras_id;
                const servidores_id = req.body.servidores_id;
                yield ComissaoAlvoService_1.default.create(comissoes_avaliadoras_id, servidores_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor avaliado definido com sucesso!');
            }
            catch (e) {
                if (e instanceof HttpError_1.default) {
                    console.log(e);
                    (0, ResponseHandler_1.ResponseHandler)(res, e.statusCode, e.message);
                    return;
                }
                console.log(e);
                (0, ResponseHandler_1.ResponseHandler)(res, 500, e.message);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const comissao_alvo_id = parseInt((_a = req.query.comissao_alvo_id) === null || _a === void 0 ? void 0 : _a.toString());
                yield ComissaoAlvoService_1.default.delete(comissao_alvo_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor avaliado deletado com sucesso!');
            }
            catch (e) {
                if (e instanceof HttpError_1.default) {
                    console.log(e);
                    (0, ResponseHandler_1.ResponseHandler)(res, e.statusCode, e.message);
                    return;
                }
                console.log(e);
                (0, ResponseHandler_1.ResponseHandler)(res, 500, e.message);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const comissao_alvo_id = parseInt((_a = req.query.comissao_alvo_id) === null || _a === void 0 ? void 0 : _a.toString());
                const comissao_id = parseInt((_b = req.query.comissao_id) === null || _b === void 0 ? void 0 : _b.toString());
                const comissao_alvo = yield ComissaoAlvoService_1.default.get(comissao_alvo_id, comissao_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor avaliado encontrado', comissao_alvo);
            }
            catch (e) {
                if (e instanceof HttpError_1.default) {
                    console.log(e);
                    (0, ResponseHandler_1.ResponseHandler)(res, e.statusCode, e.message);
                    return;
                }
                console.log(e);
                (0, ResponseHandler_1.ResponseHandler)(res, 500, e.message);
            }
        });
    }
}
exports.default = new ComissaoAlvoController;
//# sourceMappingURL=ComissaoAlvoController.js.map