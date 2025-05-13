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
const db_1 = __importDefault(require("../database/db"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
const User_1 = __importDefault(require("../database/models/User"));
const Cargos_1 = __importDefault(require("../database/models/Cargos")); // Importando o modelo de Cargos
const passwordHash_1 = __importDefault(require("../utils/passwordHash"));
const fileRead_1 = require("../middlewares/fileRead");
const fs_1 = __importDefault(require("fs"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const ServidorService_1 = __importDefault(require("../services/ServidorService"));
const stringUtils_1 = require("../utils/stringUtils");
class ServidorController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = null;
            try {
                transaction = yield db_1.default.transaction();
                const file = req.file;
                if (!file) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Nenhum arquivo foi enviado");
                    return;
                }
                const servidores = yield (0, fileRead_1.parseCSV)(res, file.path);
                // Buscar todos os servidores já cadastrados
                const allServidores = yield Servidor_1.default.findAll();
                const servidoresMap = new Map(allServidores.map(s => [s.cpf, s]));
                const novosCPFs = new Set(servidores.map(s => s.cpf));
                // Tornar inativos os servidores que não estão na nova lista
                yield Promise.all(allServidores.map((servidor) => __awaiter(this, void 0, void 0, function* () {
                    if (!novosCPFs.has(servidor.cpf)) {
                        yield servidor.update({ is_active: false }, { transaction });
                    }
                })));
                // Buscar todos os cargos existentes no banco e normalizar os nomes
                const allCargos = yield Cargos_1.default.findAll({ attributes: ["id", "nome"] });
                const cargoMap = new Map(allCargos.map(cargo => [(0, stringUtils_1.normalizeString)(cargo.nome), cargo.id]));
                // Processar os servidores do CSV
                yield Promise.all(servidores.map((servidor) => __awaiter(this, void 0, void 0, function* () {
                    const servidorExist = servidoresMap.get(servidor.cpf);
                    // Normaliza o nome do cargo para comparação
                    const normalizedCargo = (0, stringUtils_1.normalizeString)(servidor.cargo);
                    let cargo_id = cargoMap.get(normalizedCargo);
                    // Se não encontrar correspondência exata, tenta encontrar o mais próximo
                    if (!cargo_id) {
                        const bestMatch = (0, stringUtils_1.findBestMatch)(normalizedCargo, Array.from(cargoMap.keys()), 5); // Permitir até 5 diferenças
                        if (bestMatch) {
                            cargo_id = cargoMap.get(bestMatch);
                        }
                        else {
                            console.warn(`Cargo não encontrado: ${servidor.cargo} (Normalizado: ${normalizedCargo})`);
                        }
                    }
                    const servidor_data = {
                        nome: servidor.nome,
                        cpf: servidor.cpf,
                        matricula: servidor.matricula,
                        grau_instrucao: servidor.grau_instrucao,
                        situacao_grau_instrucao: servidor.situacao_grau_instrucao,
                        cargo_id: cargo_id || null, // Garante que nenhum cargo_id seja indefinido
                        lotacao: servidor.lotacao,
                        data_admissao: servidor.data_admissao,
                        is_active: true
                    };
                    if (servidorExist) {
                        yield servidorExist.update(servidor_data, { transaction });
                    }
                    else {
                        let user = yield User_1.default.findOne({ where: { username: servidor.matricula } });
                        if (!user) {
                            const password_hash = yield (0, passwordHash_1.default)(servidor.matricula);
                            user = yield User_1.default.create({
                                username: servidor.matricula,
                                password_hash,
                                role: "servidor"
                            }, { transaction });
                        }
                        yield Servidor_1.default.create(Object.assign({ users_id: user.id }, servidor_data), { transaction });
                    }
                })));
                yield transaction.commit();
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Servidores cadastrados e atualizados com sucesso!");
            }
            catch (e) {
                if (transaction) {
                    yield transaction.rollback();
                }
                console.error(e);
                (0, ResponseHandler_1.ResponseHandler)(res, 500, "Erro no servidor, contate o suporte!");
            }
            finally {
                if (req.file && req.file.path)
                    fs_1.default.unlinkSync(req.file.path);
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const servidor_id = parseInt((_a = req.query.servidor_id) === null || _a === void 0 ? void 0 : _a.toString());
                const user_id = parseInt((_b = req.query.user_id) === null || _b === void 0 ? void 0 : _b.toString());
                const servidor = yield ServidorService_1.default.get(servidor_id, user_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor encontrado', servidor);
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
    setChefia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const servidor_id = parseInt((_a = req.query.servidor_id) === null || _a === void 0 ? void 0 : _a.toString());
                const chefia_id = parseInt((_b = req.query.chefia_id) === null || _b === void 0 ? void 0 : _b.toString());
                yield ServidorService_1.default.setChefia(servidor_id, chefia_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Chefia imediata atualizada');
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
    // async editEmail(req: Request, res: Response) {
    //     let transaction: Transaction | null = null;
    //     try {
    //         transaction = await sequelize.transaction();
    //         const servidor_id: number = req.body.servidor_id
    //         const email: string = req.body.email
    //         if (!servidor_id) {
    //             console.log("Servidor não enviado");
    //             ResponseHandler(res, 404, "Servidor não enviado, selecione um servidor para editar o email!");
    //             return
    //         }
    //         const servidor: Servidor = await Servidor.findOne({ where: { id: servidor_id } })
    //         if (!servidor) {
    //             console.log("Servidor não econtrado");
    //             ResponseHandler(res, 404, "Servidor não encontrado, selecione um servidor cadastrado!");
    //             return
    //         }
    //         const emailIsValid: boolean = emailValidator.validate(email)
    //         if (!emailIsValid) {
    //             console.log("Email inválido");
    //             ResponseHandler(res, 400, "Email inválido, informe um email válido!");
    //             return
    //         }
    //         const emailInUse: Servidor = await Servidor.findOne({ where: { email: email, id: { [Op.ne]: servidor.id } } })
    //         if (emailInUse) {
    //             console.log("Email em uso");
    //             ResponseHandler(res, 400, "O email informado ja está em uso por outro servidor!");
    //             return
    //         }
    //         await servidor.update({ email: email }, {transaction})
    //         await transaction.commit();
    //         ResponseHandler(res, 200, "Email editado!");
    //     } catch (e) {
    //         if (transaction) {
    //             await transaction.rollback();
    //         }
    //         if (e) {
    //             console.error(e);
    //             ResponseHandler(res, 500, "Erro no servidor, contate o suporte!");
    //         }
    //     }
    // }
    getInferiores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const servidor_id = parseInt((_a = req.query.servidor_id) === null || _a === void 0 ? void 0 : _a.toString());
                const inferiores = yield ServidorService_1.default.getInferiores(servidor_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Inferiores encontrados', inferiores);
            }
            catch (e) {
                (0, ResponseHandler_1.ResponseHandler)(res, 500, e.message);
            }
        });
    }
}
exports.default = new ServidorController();
//# sourceMappingURL=ServidorController.js.map