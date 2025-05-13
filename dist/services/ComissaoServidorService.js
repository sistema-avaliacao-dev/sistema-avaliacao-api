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
const Comissao_1 = __importDefault(require("../database/models/Comissao"));
const ComissaoServidor_1 = __importDefault(require("../database/models/ComissaoServidor"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
class ComissaoServidorService {
    create(comissoes_avaliadoras_id, servidores_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ comissoes_avaliadoras_id, servidores_id });
                yield ComissaoServidor_1.default.create({
                    comissoes_avaliadoras_id: comissoes_avaliadoras_id,
                    servidores_id: servidores_id
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
    delete(comissao_servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                yield this.validate({ comissao_servidor_id, is_delete: true });
                //Deleção do alvo
                yield ComissaoServidor_1.default.destroy({ where: { id: comissao_servidor_id }, transaction });
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
    get(comissao_servidor_id, comissao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                const comissao_servidor = yield this.validate({ comissao_servidor_id, comissao_id, is_get: true });
                // Se chegou aqui sem erros, confirma a transação
                yield transaction.commit();
                return comissao_servidor;
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
        return __awaiter(this, arguments, void 0, function* ({ comissao_id, comissao_servidor_id, comissoes_avaliadoras_id, servidores_id, is_delete, is_get }) {
            try {
                if (is_delete || is_get) {
                    if (is_delete) {
                        if (!comissao_servidor_id) {
                            throw new HttpError_1.default(404, 'Selecione um servidor para retirar dessa subcomissão!');
                        }
                    }
                    else {
                        if (!comissao_servidor_id && !comissao_id) {
                            throw new HttpError_1.default(404, 'Selecione um servidor ou uma subcomissão para visualizar as informações desejadas!');
                        }
                    }
                    if (comissao_servidor_id) {
                        //Validação de subcomissão alvo existente
                        const comissao_servidor_exist = yield ComissaoServidor_1.default.findOne({ where: { id: comissao_servidor_id } });
                        if (!comissao_servidor_exist) {
                            throw new HttpError_1.default(404, 'Servidor não encontrado, selecione um servidor válido!');
                        }
                        return comissao_servidor_exist;
                    }
                    else {
                        //Validação de subcomissão existente
                        const comissao_exist = yield Comissao_1.default.findOne({ where: { id: comissao_id } });
                        if (!comissao_exist) {
                            throw new HttpError_1.default(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!');
                        }
                        const comissao_servidors = yield ComissaoServidor_1.default.findAll({ where: { comissoes_avaliadoras_id: comissao_id } });
                        return comissao_servidors;
                    }
                }
                else {
                    //Validações de campos obrigatórios
                    if (!comissoes_avaliadoras_id) {
                        throw new HttpError_1.default(400, 'Subcomissão não selecionada, selecione uma subcomissão para colocar um servidor nela!');
                    }
                    if (!servidores_id) {
                        throw new HttpError_1.default(400, 'Servidor não selecionado, selecione um servidor para colocar na Comissao!');
                    }
                    //Validação de existência de subcomissão 
                    const comissao_exists = yield Comissao_1.default.findOne({ where: { id: comissoes_avaliadoras_id } });
                    if (!comissao_exists) {
                        throw new HttpError_1.default(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!');
                    }
                    //Validação de existência de servidor 
                    const servidor_exists = yield Servidor_1.default.findOne({ where: { id: servidores_id } });
                    if (!servidor_exists) {
                        throw new HttpError_1.default(404, 'Servidor não encontrado, selecione um servidor válido!');
                    }
                    //Validação de alvo já definido
                    const comissao_servidor_exists = yield ComissaoServidor_1.default.findOne({ where: { comissoes_avaliadoras_id: comissoes_avaliadoras_id, servidores_id: servidores_id } });
                    if (comissao_servidor_exists) {
                        throw new HttpError_1.default(400, 'Servidor já está sendo avaliado por essa subcomissão, selecione uma subcomissão ou um servidor diferente!');
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
exports.default = new ComissaoServidorService;
//# sourceMappingURL=ComissaoServidorService.js.map