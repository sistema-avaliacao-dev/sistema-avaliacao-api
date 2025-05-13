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
const ResponseHandler_1 = require("../middlewares/ResponseHandler");
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const AvaliacaoRespostaService_1 = __importDefault(require("../services/AvaliacaoRespostaService"));
class AvaliacaoRespostaController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avaliacao_id = parseInt(req.body.avaliacao_id);
                const tipo = req.body.tipo;
                const respostas = req.body.respostas;
                yield AvaliacaoRespostaService_1.default.create(avaliacao_id, tipo, respostas);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Resposta de avaliação enviada');
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
            var _a;
            try {
                const avaliacao_id = parseInt((_a = req.query.avaliacao_id) === null || _a === void 0 ? void 0 : _a.toString());
                const respostas_avaliacao = yield AvaliacaoRespostaService_1.default.get(avaliacao_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Avaliação recuperada!", respostas_avaliacao);
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
exports.default = new AvaliacaoRespostaController();
//# sourceMappingURL=AvaliacaoRespostaController.js.map