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
const SubcomissaoService_1 = __importDefault(require("../services/SubcomissaoService"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const ResponseHandler_1 = require("../middlewares/ResponseHandler");
class SubcomissaoController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, nivel } = req.body;
                yield SubcomissaoService_1.default.create(nome, nivel);
                res.status(201).json({ message: 'Subcomissão criada com sucesso!' });
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
                const { subcomissao_id, nome, nivel } = req.body;
                yield SubcomissaoService_1.default.update(subcomissao_id, nome, nivel);
                res.status(200).json({ message: 'Subcomissão atualizada com sucesso!' });
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
                const subcomissao_id = parseInt(((_a = req.query.subcomissao_id) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
                yield SubcomissaoService_1.default.delete(subcomissao_id);
                res.status(200).json({ message: 'Subcomissão deletada com sucesso!' });
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
                const subcomissao_id = parseInt(((_a = req.query.subcomissao_id) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
                const servidor_id = parseInt(((_b = req.query.servidor_id) === null || _b === void 0 ? void 0 : _b.toString()) || '0');
                const subcomissao = yield SubcomissaoService_1.default.get(subcomissao_id, servidor_id);
                res.status(200).json({ data: subcomissao });
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
                const subcomissoes = yield SubcomissaoService_1.default.getAll();
                res.status(200).json({ data: subcomissoes });
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
    static addServidores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subcomissoes_avaliadoras_id, servidores_id } = req.body;
                const subcomissao = yield SubcomissaoService_1.default.addServidores(Number(subcomissoes_avaliadoras_id), servidores_id);
                res.json({ data: subcomissao });
            }
            catch (e) {
                if (e instanceof HttpError_1.default) {
                    res.status(e.statusCode).json({ message: e.message });
                }
                else {
                    res.status(500).json({ message: e.message });
                }
            }
        });
    }
    static addAlvos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { subcomissoes_avaliadoras_id, servidores_id } = req.body;
                const subcomissao = yield SubcomissaoService_1.default.addAlvos(Number(subcomissoes_avaliadoras_id), servidores_id);
                res.json({ data: subcomissao });
            }
            catch (e) {
                if (e instanceof HttpError_1.default) {
                    res.status(e.statusCode).json({ message: e.message });
                }
                else {
                    res.status(500).json({ message: e.message });
                }
            }
        });
    }
    getSubcomissaoParticipantesByServidor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servidor_id = parseInt(req.query.servidor_id);
                if (!servidor_id) {
                    return (0, ResponseHandler_1.ResponseHandler)(res, 400, 'servidor_id é obrigatório');
                }
                const result = yield SubcomissaoService_1.default.getSubcomissaoAndParticipantesByServidor(servidor_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Participantes da subcomissão recuperados!', result);
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
exports.default = new SubcomissaoController;
//# sourceMappingURL=SubcomissaoController.js.map