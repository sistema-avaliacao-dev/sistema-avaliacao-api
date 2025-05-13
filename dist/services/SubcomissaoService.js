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
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../database/db"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const Subcomissao_1 = __importDefault(require("../database/models/Subcomissao"));
const SubcomissaoAlvo_1 = __importDefault(require("../database/models/SubcomissaoAlvo"));
const SubcomissaoServidor_1 = __importDefault(require("../database/models/SubcomissaoServidor"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
class SubcomissaoService {
    create(nome, nivel) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ nome, nivel });
                yield Subcomissao_1.default.create({
                    nome: nome,
                    nivel: nivel
                }, { transaction });
                // Se chegou aqui sem erros, confirma a transação
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
    update(subcomissao_id, nome, nivel) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ subcomissao_id, nome, nivel, is_update: true });
                yield Subcomissao_1.default.update({
                    nome: nome,
                    nivel: nivel
                }, { where: { id: subcomissao_id }, transaction });
                // Se chegou aqui sem erros, confirma a transação
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
    delete(subcomissao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ subcomissao_id, is_delete: true });
                //Deleção das outras tabelas
                yield SubcomissaoAlvo_1.default.destroy({ where: { subcomissoes_avaliadoras_id: subcomissao_id }, transaction });
                yield SubcomissaoServidor_1.default.destroy({ where: { subcomissoes_avaliadoras_id: subcomissao_id }, transaction });
                //Deleção da subcomissão
                yield Subcomissao_1.default.destroy({ where: { id: subcomissao_id }, transaction });
                // Se chegou aqui sem erros, confirma a transação
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
    get(subcomissao_id, servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ subcomissao_id, servidor_id, is_get: true });
                let subcomissaoId = subcomissao_id;
                const servidor = yield Servidor_1.default.findOne({ where: { users_id: servidor_id }, transaction });
                if (servidor_id) {
                    const subcomissao_servidor = yield SubcomissaoServidor_1.default.findOne({ where: { servidores_id: servidor.id }, transaction });
                    if (subcomissao_servidor) {
                        subcomissaoId = subcomissao_servidor.subcomissoes_avaliadoras_id;
                    }
                }
                const subcomissao = yield Subcomissao_1.default.findOne({ where: { id: subcomissaoId }, transaction });
                const subcomissao_alvos = yield SubcomissaoAlvo_1.default.findAll({ where: { subcomissoes_avaliadoras_id: subcomissaoId }, transaction });
                const subcomissao_servidores = yield SubcomissaoServidor_1.default.findAll({ where: { subcomissoes_avaliadoras_id: subcomissaoId }, transaction });
                const subcomissao_get = {
                    subcomissao,
                    subcomissao_alvos: [...subcomissao_alvos],
                    subcomissao_servidores: [...subcomissao_servidores]
                };
                // Se chegou aqui sem erros, confirma a transação
                yield transaction.commit();
                return subcomissao_get;
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
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subcomissoes = yield Subcomissao_1.default.findAll();
                return subcomissoes;
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
    addServidores(subcomissao_id, servidores_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcomissao = yield Subcomissao_1.default.findByPk(subcomissao_id);
            if (!subcomissao) {
                throw new Error("Subcomissão não encontrada");
            }
            const servidores = yield Servidor_1.default.findAll({
                where: {
                    id: servidores_id,
                },
            });
            if (servidores.length !== servidores_id.length) {
                throw new Error("Um ou mais servidores não encontrados");
            }
            yield SubcomissaoServidor_1.default.bulkCreate(servidores_id.map((servidor_id) => ({
                subcomissoes_avaliadoras_id: subcomissao_id,
                servidores_id: servidor_id,
            })));
            return this.get(subcomissao_id);
        });
    }
    addAlvos(subcomissao_id, servidores_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subcomissao = yield Subcomissao_1.default.findByPk(subcomissao_id);
            if (!subcomissao) {
                throw new Error("Subcomissão não encontrada");
            }
            const servidores = yield Servidor_1.default.findAll({
                where: {
                    id: servidores_id,
                },
            });
            if (servidores.length !== servidores_id.length) {
                throw new Error("Um ou mais servidores não encontrados");
            }
            yield SubcomissaoAlvo_1.default.bulkCreate(servidores_id.map((servidor_id) => ({
                subcomissoes_avaliadoras_id: subcomissao_id,
                servidores_id: servidor_id,
            })));
            return this.get(subcomissao_id);
        });
    }
    getSubcomissaoAndParticipantesByServidor(servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the SubcomissaoAlvo for this servidor
            const subcomissaoAlvo = yield SubcomissaoAlvo_1.default.findOne({ where: { servidores_id: servidor_id } });
            if (!subcomissaoAlvo) {
                throw new Error('Nenhuma subcomissão avaliando este servidor.');
            }
            // Get the subcomissao info
            const subcomissao = yield Subcomissao_1.default.findByPk(subcomissaoAlvo.subcomissoes_avaliadoras_id);
            // Get all participants (servidores) of this subcomissao
            const subcomissaoServidores = yield SubcomissaoServidor_1.default.findAll({ where: { subcomissoes_avaliadoras_id: subcomissaoAlvo.subcomissoes_avaliadoras_id } });
            const servidorIds = subcomissaoServidores.map(ss => ss.servidores_id);
            const participantes = yield Servidor_1.default.findAll({
                where: { id: servidorIds },
                attributes: ['id', 'nome', 'matricula']
            });
            return {
                subcomissao,
                participantes
            };
        });
    }
    validate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ subcomissao_id, nome, nivel, is_update, is_delete, is_get, servidor_id }) {
            try {
                //Validação update
                if (is_update) {
                    //Validações de campos obrigatórios
                    if (!nome) {
                        throw new HttpError_1.default(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da subcomissão!');
                    }
                    if (!nivel) {
                        throw new HttpError_1.default(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da subcomissão!');
                    }
                    if (!subcomissao_id) {
                        throw new HttpError_1.default(400, 'Subcomissão não selecionada, selecione uma subcomissão para deletar a subcomissão!');
                    }
                    //Validação de nível válido
                    if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                        throw new HttpError_1.default(400, 'Nivel inválido, selecione um nível válido!');
                    }
                    //Validação de existência da subcomissao
                    const subcomissao = yield Subcomissao_1.default.findOne({ where: { id: subcomissao_id } });
                    if (!subcomissao) {
                        throw new HttpError_1.default(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!');
                    }
                    //Validação de subcomissão já existente
                    const nome_exist = yield Subcomissao_1.default.findOne({ where: { nome: nome, id: { [sequelize_1.Op.ne]: subcomissao_id } } });
                    if (nome_exist) {
                        throw new HttpError_1.default(400, 'Esse nome ja está em uso, crie uma subcomissão com um nome diferente das subcomissões já criadas!');
                    }
                }
                else if (is_delete) {
                    //Validações de campos obrigatórios
                    if (!subcomissao_id) {
                        throw new HttpError_1.default(400, 'Subcomissão não selecionada, selecione uma subcomissão para deletar a subcomissão!');
                    }
                    //Validação de subcomissão existente
                    const subcomissao = yield Subcomissao_1.default.findOne({ where: { id: subcomissao_id } });
                    if (!subcomissao) {
                        throw new HttpError_1.default(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!');
                    }
                }
                else if (is_get) {
                    if (subcomissao_id) {
                        const subcomissao = yield Subcomissao_1.default.findOne({ where: { id: subcomissao_id } });
                        if (!subcomissao) {
                            throw new HttpError_1.default(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!');
                        }
                    }
                    else if (servidor_id) {
                        const servidor = yield Servidor_1.default.findOne({ where: { users_id: servidor_id } });
                        if (!servidor) {
                            throw new HttpError_1.default(404, 'Servidor não encontrado, selecione um servidor válido!');
                        }
                    }
                    else {
                        throw new HttpError_1.default(400, 'Selecione um servidor ou uma subcomissão para obter as informações!');
                    }
                }
                else {
                    //Validações de campos obrigatórios
                    if (!nome) {
                        throw new HttpError_1.default(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da subcomissão!');
                    }
                    if (!nivel) {
                        throw new HttpError_1.default(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da subcomissão!');
                    }
                    //Validação de nível válido
                    if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                        throw new HttpError_1.default(400, 'Nivel inválido, selecione um nível válido!');
                    }
                    //Validação de subcomissão já existente
                    const nome_exist = yield Subcomissao_1.default.findOne({ where: { nome: nome } });
                    if (nome_exist) {
                        throw new HttpError_1.default(400, 'Esse nome ja está em uso, crie uma subcomissão com um nome diferente das subcomissões já criadas!');
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
}
exports.default = new SubcomissaoService;
//# sourceMappingURL=SubcomissaoService.js.map