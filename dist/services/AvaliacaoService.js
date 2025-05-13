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
const db_1 = __importDefault(require("../database/db"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const Avaliacao_1 = __importDefault(require("../database/models/Avaliacao"));
const Subcomissao_1 = __importDefault(require("../database/models/Subcomissao"));
const ComissaoAlvo_1 = __importDefault(require("../database/models/ComissaoAlvo"));
const SubcomissaoAlvo_1 = __importDefault(require("../database/models/SubcomissaoAlvo"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
const Cargos_1 = __importDefault(require("../database/models/Cargos"));
const Comissao_1 = __importDefault(require("../database/models/Comissao"));
const SubcomissaoServidor_1 = __importDefault(require("../database/models/SubcomissaoServidor"));
exports.default = new class AvaliacaoService {
    get(avaliacao_id, servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ avaliacao_id, servidor_id });
                let avaliacao;
                if (servidor_id) {
                    avaliacao = yield Avaliacao_1.default.findAll({
                        where: { servidores_id: servidor_id },
                        include: [
                            {
                                model: Servidor_1.default,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargos_1.default,
                                        as: 'cargo',
                                        attributes: ['id', 'nome', 'nivel']
                                    },
                                    {
                                        model: Servidor_1.default,
                                        as: 'chefia_imediata',
                                        attributes: ['id', 'nome', 'matricula', 'email', 'cargo_id'],
                                        include: [
                                            { model: Cargos_1.default, as: 'cargo', attributes: ['id', 'nome'] }
                                        ]
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email', 'lotacao', 'data_admissao']
                            }
                        ]
                    });
                }
                else if (avaliacao_id) {
                    avaliacao = yield Avaliacao_1.default.findOne({
                        where: { id: avaliacao_id },
                        include: [
                            {
                                model: Servidor_1.default,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargos_1.default,
                                        as: 'cargo',
                                        attributes: ['id', 'nome', 'nivel']
                                    },
                                    {
                                        model: Servidor_1.default,
                                        as: 'chefia_imediata',
                                        attributes: ['id', 'nome', 'matricula', 'email', 'cargo_id'],
                                        include: [
                                            { model: Cargos_1.default, as: 'cargo', attributes: ['id', 'nome'] }
                                        ]
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email', 'lotacao', 'data_admissao']
                            }
                        ]
                    });
                    return Object.assign({}, (avaliacao.toJSON ? avaliacao.toJSON() : avaliacao));
                }
                else {
                    avaliacao = yield Avaliacao_1.default.findAll({
                        include: [
                            {
                                model: Servidor_1.default,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargos_1.default,
                                        as: 'cargo',
                                        attributes: ['id', 'nome', 'nivel']
                                    },
                                    {
                                        model: Servidor_1.default,
                                        as: 'chefia_imediata',
                                        attributes: ['id', 'nome', 'matricula', 'email', 'cargo_id'],
                                        include: [
                                            { model: Cargos_1.default, as: 'cargo', attributes: ['id', 'nome'] }
                                        ]
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email', 'lotacao', 'data_admissao']
                            }
                        ]
                    });
                }
                return avaliacao;
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    getByComissao(comissao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ comissao_id });
                const servidores_comissao = yield ComissaoAlvo_1.default.findAll({ where: { comissoes_avaliadoras_id: comissao_id } });
                const servidores_avaliacoes = yield Promise.all(servidores_comissao.map((servidor_comissao) => __awaiter(this, void 0, void 0, function* () {
                    const avaliacoes = yield Avaliacao_1.default.findAll({
                        where: { servidores_id: servidor_comissao.servidores_id },
                        include: [
                            {
                                model: Servidor_1.default,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargos_1.default,
                                        as: 'cargo',
                                        attributes: ['id', 'nome']
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email']
                            }
                        ]
                    });
                    return avaliacoes;
                })));
                return servidores_avaliacoes.flat();
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    getBySubcomissao(subcomissao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ subcomissao_id });
                const servidores_subcomissao = yield SubcomissaoAlvo_1.default.findAll({ where: { subcomissoes_avaliadoras_id: subcomissao_id } });
                const servidores_avaliacoes = yield Promise.all(servidores_subcomissao.map((servidor_subcomissao) => __awaiter(this, void 0, void 0, function* () {
                    const avaliacoes = yield Avaliacao_1.default.findAll({
                        where: { servidores_id: servidor_subcomissao.servidores_id },
                        include: [
                            {
                                model: Servidor_1.default,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargos_1.default,
                                        as: 'cargo',
                                        attributes: ['id', 'nome']
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email']
                            }
                        ]
                    });
                    return avaliacoes;
                })));
                return servidores_avaliacoes.flat();
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    create(servidores_id, otherFields) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                // Fetch supervisor (chefia imediata)
                const servidor = yield Servidor_1.default.findByPk(servidores_id, { include: ['chefia_imediata', 'cargo'] });
                let chefia = null;
                if (servidor && servidor.chefia_imediata) {
                    chefia = {
                        id: servidor.chefia_imediata.id,
                        nome: servidor.chefia_imediata.nome,
                        matricula: servidor.chefia_imediata.matricula,
                        cargo: servidor.chefia_imediata.cargo ? {
                            id: servidor.chefia_imediata.cargo.id,
                            nome: servidor.chefia_imediata.cargo.nome
                        } : null
                    };
                }
                // Fetch subcomissao (the one evaluating this servidor)
                const subAlvo = yield SubcomissaoAlvo_1.default.findOne({ where: { servidores_id } });
                let subcomissao_snapshot = [];
                if (subAlvo) {
                    const subServidores = yield SubcomissaoServidor_1.default.findAll({
                        where: { subcomissoes_avaliadoras_id: subAlvo.subcomissoes_avaliadoras_id },
                        include: [{ model: Servidor_1.default, attributes: ['id', 'nome', 'matricula'] }]
                    });
                    subcomissao_snapshot = subServidores.map(ss => {
                        var _a, _b;
                        return ({
                            id: ss.servidores_id,
                            nome: (_a = ss.servidor) === null || _a === void 0 ? void 0 : _a.nome,
                            matricula: (_b = ss.servidor) === null || _b === void 0 ? void 0 : _b.matricula
                        });
                    });
                }
                yield Avaliacao_1.default.create(Object.assign(Object.assign({ servidores_id }, otherFields), { chefia_snapshot: chefia, subcomissao_snapshot }), { transaction });
                yield transaction.commit();
            }
            catch (e) {
                if (transaction) {
                    yield transaction.rollback();
                }
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    validate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ avaliacao_id, subcomissao_id, comissao_id, servidor_id }) {
            try {
                if (servidor_id) {
                    const servidor_exists = yield Servidor_1.default.findOne({ where: { id: servidor_id } });
                    if (!servidor_exists) {
                        throw new HttpError_1.default(404, 'Servidor não encontrado');
                    }
                }
                else if (avaliacao_id) {
                    const avaliacao_exists = yield Avaliacao_1.default.findOne({ where: { id: avaliacao_id } });
                    if (!avaliacao_exists) {
                        throw new HttpError_1.default(404, 'Avaliação não encontrada');
                    }
                }
                if (subcomissao_id) {
                    const subcomissao_exists = yield Subcomissao_1.default.findOne({ where: { id: subcomissao_id } });
                    if (!subcomissao_exists) {
                        throw new HttpError_1.default(404, 'Subcomissão não encontrada');
                    }
                }
                if (comissao_id) {
                    const comissao_exists = yield Comissao_1.default.findOne({ where: { id: comissao_id } });
                    if (!comissao_exists) {
                        throw new HttpError_1.default(404, 'Comissão não encontrada');
                    }
                }
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
};
//# sourceMappingURL=AvaliacaoService.js.map