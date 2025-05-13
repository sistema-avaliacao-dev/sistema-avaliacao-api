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
const Comissao_1 = __importDefault(require("../database/models/Comissao"));
const ComissaoAlvo_1 = __importDefault(require("../database/models/ComissaoAlvo"));
const ComissaoServidor_1 = __importDefault(require("../database/models/ComissaoServidor"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
class ComissaoService {
    create(nome, nivel) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ nome, nivel });
                yield Comissao_1.default.create({
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
    update(comissao_id, nome, nivel) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ comissao_id, nome, nivel, is_update: true });
                yield Comissao_1.default.update({
                    nome: nome,
                    nivel: nivel
                }, { where: { id: comissao_id }, transaction });
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
    delete(comissao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ comissao_id, is_delete: true });
                //Deleção das outras tabelas
                yield ComissaoAlvo_1.default.destroy({ where: { comissoes_avaliadoras_id: comissao_id }, transaction });
                yield ComissaoServidor_1.default.destroy({ where: { comissoes_avaliadoras_id: comissao_id }, transaction });
                //Deleção da Comissão
                yield Comissao_1.default.destroy({ where: { id: comissao_id }, transaction });
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
    get(comissao_id, servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ comissao_id, servidor_id, is_get: true });
                let comissaoId = comissao_id;
                const servidor = yield Servidor_1.default.findOne({ where: { users_id: servidor_id }, transaction });
                if (servidor_id) {
                    const comissao_servidor = yield ComissaoServidor_1.default.findOne({ where: { servidores_id: servidor.id }, transaction });
                    if (comissao_servidor) {
                        comissaoId = comissao_servidor.comissoes_avaliadoras_id;
                    }
                }
                const comissao = yield Comissao_1.default.findOne({ where: { id: comissaoId }, transaction });
                const comissao_alvos = yield ComissaoAlvo_1.default.findAll({ where: { comissoes_avaliadoras_id: comissaoId }, transaction });
                const comissao_servidores = yield ComissaoServidor_1.default.findAll({ where: { comissoes_avaliadoras_id: comissaoId }, transaction });
                const comissao_get = {
                    comissao,
                    comissao_alvos: [...comissao_alvos],
                    comissao_servidores: [...comissao_servidores]
                };
                // Se chegou aqui sem erros, confirma a transação
                yield transaction.commit();
                return comissao_get;
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
                const comissoes = yield Comissao_1.default.findAll();
                return comissoes;
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
    getComissaoAndParticipantesByServidor(servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the SubcomissaoAlvo for this servidor
            const comissaoAlvo = yield ComissaoAlvo_1.default.findOne({ where: { servidores_id: servidor_id } });
            if (!comissaoAlvo) {
                throw new Error('Nenhuma comissão avaliando este servidor.');
            }
            // Get the subcomissao info
            const comissao = yield Comissao_1.default.findByPk(comissaoAlvo.comissoes_avaliadoras_id);
            // Get all participants (servidores) of this subcomissao
            const comissaoServidores = yield ComissaoServidor_1.default.findAll({ where: { comissoes_avaliadoras_id: comissaoAlvo.comissoes_avaliadoras_id } });
            const servidorIds = comissaoServidores.map(ss => ss.servidores_id);
            const participantes = yield Servidor_1.default.findAll({
                where: { id: servidorIds },
                attributes: ['id', 'nome', 'matricula']
            });
            return {
                comissao,
                participantes
            };
        });
    }
    validate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ comissao_id, nome, nivel, is_update, is_delete, is_get, servidor_id }) {
            try {
                //Validação update
                if (is_update) {
                    //Validações de campos obrigatórios
                    if (!nome) {
                        throw new HttpError_1.default(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da Comissão!');
                    }
                    if (!nivel) {
                        throw new HttpError_1.default(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da Comissão!');
                    }
                    if (!comissao_id) {
                        throw new HttpError_1.default(400, 'Comissão não selecionada, selecione uma Comissão para deletar a Comissão!');
                    }
                    //Validação de nível válido
                    if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                        throw new HttpError_1.default(400, 'Nivel inválido, selecione um nível válido!');
                    }
                    //Validação de existência da Comissao
                    const comissao = yield Comissao_1.default.findOne({ where: { id: comissao_id } });
                    if (!comissao) {
                        throw new HttpError_1.default(404, 'Comissão não encontrada, selecione uma Comissão válida!');
                    }
                    //Validação de Comissão já existente
                    const nome_exist = yield Comissao_1.default.findOne({ where: { nome: nome, id: { [sequelize_1.Op.ne]: comissao_id } } });
                    if (nome_exist) {
                        throw new HttpError_1.default(400, 'Esse nome ja está em uso, crie uma Comissão com um nome diferente das subcomissões já criadas!');
                    }
                }
                else if (is_delete) {
                    //Validações de campos obrigatórios
                    if (!comissao_id) {
                        throw new HttpError_1.default(400, 'Comissão não selecionada, selecione uma Comissão para deletar a Comissão!');
                    }
                    //Validação de Comissão existente
                    const comissao = yield Comissao_1.default.findOne({ where: { id: comissao_id } });
                    if (!comissao) {
                        throw new HttpError_1.default(404, 'Comissão não encontrada, selecione uma Comissão válida!');
                    }
                }
                else if (is_get) {
                    if (comissao_id) {
                        const comissao = yield Comissao_1.default.findOne({ where: { id: comissao_id } });
                        if (!comissao) {
                            throw new HttpError_1.default(404, 'Comissão não encontrada, selecione uma Comissão válida!');
                        }
                    }
                    else if (servidor_id) {
                        const servidor = yield Servidor_1.default.findOne({ where: { users_id: servidor_id } });
                        if (!servidor) {
                            throw new HttpError_1.default(404, 'Servidor não encontrado, selecione um servidor válido!');
                        }
                    }
                    else {
                        throw new HttpError_1.default(400, 'Selecione uma Comissão ou um Servidor para obter as informações!');
                    }
                }
                else {
                    //Validações de campos obrigatórios
                    if (!nome) {
                        throw new HttpError_1.default(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da Comissão!');
                    }
                    if (!nivel) {
                        throw new HttpError_1.default(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da Comissão!');
                    }
                    //Validação de nível válido
                    if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                        throw new HttpError_1.default(400, 'Nivel inválido, selecione um nível válido!');
                    }
                    //Validação de Comissão já existente
                    const nome_exist = yield Comissao_1.default.findOne({ where: { nome: nome } });
                    if (nome_exist) {
                        throw new HttpError_1.default(400, 'Esse nome ja está em uso, crie uma Comissão com um nome diferente das subcomissões já criadas!');
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
exports.default = new ComissaoService;
//# sourceMappingURL=ComissaoService.js.map