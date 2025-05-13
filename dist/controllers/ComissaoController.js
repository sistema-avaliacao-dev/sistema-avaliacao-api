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
const ComissaoService_1 = __importDefault(require("../services/ComissaoService"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const ResponseHandler_1 = require("../middlewares/ResponseHandler");
class ComissaoController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, nivel } = req.body;
                yield ComissaoService_1.default.create(nome, nivel);
                res.status(201).json({ message: 'Comissão criada com sucesso!' });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default) {
                        res.status(e.statusCode).json({ message: e.message });
                    }
                    else {
                        res.status(500).json({ message: e.message });
                    }
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { comissao_id, nome, nivel } = req.body;
                yield ComissaoService_1.default.update(comissao_id, nome, nivel);
                res.status(200).json({ message: 'Comissão atualizada com sucesso!' });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default) {
                        res.status(e.statusCode).json({ message: e.message });
                    }
                    else {
                        res.status(500).json({ message: e.message });
                    }
                }
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const comissao_id = parseInt(((_a = req.query.comissao_id) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
                yield ComissaoService_1.default.delete(comissao_id);
                res.status(200).json({ message: 'Comissão deletada com sucesso!' });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default) {
                        res.status(e.statusCode).json({ message: e.message });
                    }
                    else {
                        res.status(500).json({ message: e.message });
                    }
                }
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const comissao_id = parseInt(((_a = req.query.comissao_id) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
                const servidor_id = parseInt(((_b = req.query.servidor_id) === null || _b === void 0 ? void 0 : _b.toString()) || '0');
                const comissao = yield ComissaoService_1.default.get(comissao_id, servidor_id);
                res.status(200).json({ data: comissao });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default) {
                        res.status(e.statusCode).json({ message: e.message });
                    }
                    else {
                        res.status(500).json({ message: e.message });
                    }
                }
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comissoes = yield ComissaoService_1.default.getAll();
                res.status(200).json({ data: comissoes });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default) {
                        res.status(e.statusCode).json({ message: e.message });
                    }
                    else {
                        res.status(500).json({ message: e.message });
                    }
                }
            }
        });
    }
    getComissaoParticipantesByServidor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servidor_id = parseInt(req.query.servidor_id);
                if (!servidor_id) {
                    return (0, ResponseHandler_1.ResponseHandler)(res, 400, 'servidor_id é obrigatório');
                }
                const result = yield ComissaoService_1.default.getComissaoAndParticipantesByServidor(servidor_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Participantes da comissão recuperados!', result);
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
exports.default = new ComissaoController;
//# sourceMappingURL=ComissaoController.js.map