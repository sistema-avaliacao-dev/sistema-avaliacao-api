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
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
const Cargos_1 = __importDefault(require("../database/models/Cargos"));
const User_1 = __importDefault(require("../database/models/User"));
class ServidorService {
    setChefia(servidor_id, chefia_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                //Validações
                yield this.validate({ servidor_id, chefia_id });
                const servidor = yield Servidor_1.default.findOne({ where: { id: servidor_id } });
                const chefia = yield Servidor_1.default.findOne({ where: { id: chefia_id } });
                yield servidor.update({ chefia_imediata_servidores_id: chefia.id }, { transaction });
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
    get(servidor_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.validate({ servidor_id, user_id, is_get: true });
                let servidor;
                if (user_id) {
                    servidor = yield Servidor_1.default.findOne({
                        where: { users_id: user_id },
                        include: [
                            {
                                model: Cargos_1.default,
                                as: 'cargo',
                                attributes: ['id', 'nome']
                            }
                        ]
                    });
                }
                else if (servidor_id) {
                    servidor = yield Servidor_1.default.findOne({
                        where: { id: servidor_id },
                        include: [
                            {
                                model: Cargos_1.default,
                                as: 'cargo',
                                attributes: ['id', 'nome']
                            },
                            {
                                model: Servidor_1.default,
                                as: 'chefia_imediata',
                                attributes: ['id', 'nome']
                            }
                        ]
                    });
                }
                else {
                    servidor = yield Servidor_1.default.findAll({
                        include: [
                            {
                                model: Cargos_1.default,
                                as: 'cargo',
                                attributes: ['id', 'nome']
                            },
                            {
                                model: Servidor_1.default,
                                as: 'chefia_imediata',
                                attributes: ['id', 'nome']
                            }
                        ]
                    });
                }
                return servidor;
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
    getInferiores(servidor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ servidor_id, is_get_inferiores: true });
                const servidor = yield Servidor_1.default.findOne({ where: { users_id: servidor_id } });
                const inferiores = yield Servidor_1.default.findAll({
                    where: {
                        chefia_imediata_servidores_id: servidor.id
                    }, include: [
                        {
                            model: Cargos_1.default,
                            as: 'cargo',
                            attributes: ['id', 'nome']
                        }
                    ]
                });
                return inferiores;
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
    validate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ servidor_id, chefia_id, is_get, is_get_inferiores, user_id }) {
            try {
                if (is_get_inferiores) {
                    if (!servidor_id) {
                        throw new HttpError_1.default(400, 'Servidor não selecionado, selecione o servidor!');
                    }
                    const servidor = yield Servidor_1.default.findOne({ where: { users_id: servidor_id } });
                    if (!servidor) {
                        throw new HttpError_1.default(404, 'Servidor não encontrado, slecione um servidor válido!');
                    }
                }
                else {
                    if (user_id) {
                        const user = yield User_1.default.findOne({ where: { id: user_id } });
                        if (!user) {
                            throw new HttpError_1.default(404, 'Usuário não encontrado, slecione um usuário válido!');
                        }
                    }
                    else {
                        //Validações de campos obrigatórios
                        if (!servidor_id && !is_get) {
                            throw new HttpError_1.default(400, 'Servidor não selecionado, selecione o servidor!');
                        }
                        if (servidor_id) {
                            const servidor = yield Servidor_1.default.findOne({ where: { id: servidor_id } });
                            if (!servidor && !servidor_id) {
                                throw new HttpError_1.default(404, 'Servidor não encontrado, slecione um servidor válido!');
                            }
                        }
                        if (!is_get) {
                            if (!chefia_id) {
                                throw new HttpError_1.default(400, 'Chefia imediata não selecionada, selecione a chefia imediata!');
                            }
                            const chefia = yield Servidor_1.default.findOne({ where: { id: chefia_id } });
                            if (!chefia) {
                                throw new HttpError_1.default(404, 'Chefia não encontrada, slecione um servidor válido!');
                            }
                        }
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
exports.default = new ServidorService;
//# sourceMappingURL=ServidorService.js.map