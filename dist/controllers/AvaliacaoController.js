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
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
const Avaliacao_1 = __importDefault(require("../database/models/Avaliacao"));
const SubcomissaoAlvo_1 = __importDefault(require("../database/models/SubcomissaoAlvo"));
const ComissaoAlvo_1 = __importDefault(require("../database/models/ComissaoAlvo"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const AvaliacaoService_1 = __importDefault(require("../services/AvaliacaoService"));
const SubcomissaoServidor_1 = __importDefault(require("../database/models/SubcomissaoServidor"));
const ComissaoServidor_1 = __importDefault(require("../database/models/ComissaoServidor"));
class AvaliacaoController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = null;
            try {
                transaction = yield db_1.default.transaction();
                const servidores_id = req.body.servidores_id;
                if (!servidores_id) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Servidor não selecionado, selecione um servidor para dar início à avaliação!");
                    return;
                }
                for (const servidor_id of servidores_id) {
                    const servidor = yield Servidor_1.default.findOne({ where: { id: servidor_id }, transaction });
                    if (!servidor) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 404, `Servidor não encontrado, selecione um servidor válido para dar início a sua avaliação!`);
                        return;
                    }
                    // if (!servidor.email) {
                    //     ResponseHandler(res, 400, `Servidor ${servidor.nome} não tem email cadastrado, cadastre o email do servidor antes de dar início a sua avaliação!`)
                    //     return
                    // }
                    if (!servidor.chefia_imediata_servidores_id) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 400, `Servidor ${servidor.nome} não tem chefia imediata cadastrada, cadastre a chefia imediata do servidor antes de dar início a sua avaliação!`);
                        return;
                    }
                    const has_subcomissao = yield SubcomissaoAlvo_1.default.findOne({ where: { servidores_id: servidor_id } });
                    if (!has_subcomissao) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 400, `Servidor ${servidor.nome} não tem uma subcomissão cadastrada, cadastre a subcomissão do servidor antes de dar início a sua avaliação!`);
                        return;
                    }
                    const has_comissao = yield ComissaoAlvo_1.default.findOne({ where: { servidores_id: servidor_id } });
                    if (!has_comissao) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 400, `Servidor ${servidor.nome} não tem uma comissão cadastrada, cadastre a comissão do servidor antes de dar início a sua avaliação!`);
                        return;
                    }
                    const avaliacao_ativa = yield Avaliacao_1.default.findOne({ where: { servidores_id: servidor_id, data_fim: { [sequelize_1.Op.is]: null } }, transaction });
                    if (avaliacao_ativa) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 400, `Servidor ${servidor.nome} já tem uma avaliação em andamento, certifique-se de que a ultima avaliação seja finalizada para iniciar uma nova avaliação!`);
                        return;
                    }
                    const chefia = yield Servidor_1.default.findOne({ where: { id: servidor.chefia_imediata_servidores_id } });
                    const subcomissao_participantes_table = yield SubcomissaoServidor_1.default.findAll({ where: { subcomissoes_avaliadoras_id: has_subcomissao.subcomissoes_avaliadoras_id } });
                    const subcomissao_participantes = yield Promise.all(subcomissao_participantes_table.map((m) => __awaiter(this, void 0, void 0, function* () {
                        const servidor = yield Servidor_1.default.findOne({ where: { id: m.servidores_id } });
                        return servidor;
                    })));
                    const comissao_participantes_table = yield ComissaoServidor_1.default.findAll({ where: { comissoes_avaliadoras_id: has_comissao.comissoes_avaliadoras_id } });
                    const comissao_participantes = yield Promise.all(comissao_participantes_table.map((m) => __awaiter(this, void 0, void 0, function* () {
                        const servidor = yield Servidor_1.default.findOne({ where: { id: m.servidores_id } });
                        return servidor;
                    })));
                    yield Avaliacao_1.default.create({
                        servidores_id: servidor_id,
                        subcomissao_snapshot: subcomissao_participantes,
                        chefia_snapshot: chefia,
                        comissao_snapshot: comissao_participantes
                    }, { transaction });
                    yield transaction.commit();
                }
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Avaliação iniciada!");
            }
            catch (e) {
                if (transaction) {
                    yield transaction.rollback();
                }
                if (e) {
                    console.log(e);
                    (0, ResponseHandler_1.ResponseHandler)(res, 500, "Erro no servidor");
                }
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const avaliacao_id = parseInt((_a = req.query.avaliacao_id) === null || _a === void 0 ? void 0 : _a.toString());
                const servidor_id = parseInt((_b = req.query.servidor_id) === null || _b === void 0 ? void 0 : _b.toString());
                const avaliacao = yield AvaliacaoService_1.default.get(avaliacao_id, servidor_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Avaliação recuperada!", avaliacao);
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
    getBySubcomissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const subcomissao_id = parseInt((_a = req.query.subcomissao_id) === null || _a === void 0 ? void 0 : _a.toString());
                const avaliacoes = yield AvaliacaoService_1.default.getBySubcomissao(subcomissao_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Avaliação recuperada!", avaliacoes);
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
    getByComissao(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const comissao_id = parseInt((_a = req.query.comissao_id) === null || _a === void 0 ? void 0 : _a.toString());
                const avaliacoes = yield AvaliacaoService_1.default.getByComissao(comissao_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Avaliações recuperadas!", avaliacoes);
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
exports.default = new AvaliacaoController;
//# sourceMappingURL=AvaliacaoController.js.map