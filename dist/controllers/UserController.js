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
const User_1 = __importDefault(require("../database/models/User"));
const passwordHash_1 = __importDefault(require("../utils/passwordHash"));
const passwordCompare_1 = __importDefault(require("../utils/passwordCompare"));
const db_1 = __importDefault(require("../database/db"));
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const getTokenDecoded_1 = __importDefault(require("../utils/getTokenDecoded"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction; // colocar tipagem
            try {
                transaction = yield db_1.default.transaction();
                const username = req.body.username;
                const password = req.body.password;
                const role = req.body.role;
                //Validação de campos obrigatórios
                if (!password) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Senha é um campo obrigatório, digite sua senha!");
                    return;
                }
                if (!username) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Username é um campo obrigatório, digite seu username!");
                    return;
                }
                if (!role) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Role é um campo obrigatório, digite uma role!");
                    return;
                }
                //Validação de pré-existência de usuário com o mesmo username
                const usernameExists = yield User_1.default.findOne({ where: { username } });
                if (usernameExists) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Esse username já está em uso, digite outro!");
                    return;
                }
                //Criação de usuário
                const password_hash = yield (0, passwordHash_1.default)(password);
                const user = {
                    username,
                    password_hash,
                    role
                };
                yield User_1.default.create(Object.assign({}, user), { transaction });
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Usuário criado, faça seu login!!");
            }
            catch (e) {
                // Reverte qualquer INSERT/UPDATE já feito
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
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                const decoded = yield (0, getTokenDecoded_1.default)(token);
                const user = {
                    id: decoded.dataValues.id,
                    role: decoded.dataValues.role
                };
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Usuário encontrado', user);
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
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction;
            try {
                transaction = yield db_1.default.transaction();
                const { currentPassword, newPassword, role, userId } = req.body;
                // Validação de campos obrigatórios
                if (role != 'admin') {
                    if (!currentPassword) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 400, "Senha atual é obrigatória");
                        return;
                    }
                }
                if (!newPassword) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Nova senha é obrigatória");
                    return;
                }
                // Buscar usuário
                const user = yield User_1.default.findOne({ where: { id: userId } });
                if (!user) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 404, "Usuário não encontrado");
                    return;
                }
                // Validar senha atual
                if (role != 'admin') {
                    const passwordValid = yield (0, passwordCompare_1.default)(currentPassword, user);
                    if (!passwordValid) {
                        (0, ResponseHandler_1.ResponseHandler)(res, 401, "Senha atual incorreta");
                        return;
                    }
                }
                // Validar se a nova senha é diferente da atual
                const isSamePassword = yield (0, passwordCompare_1.default)(newPassword, user);
                if (isSamePassword) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "A nova senha deve ser diferente da senha atual");
                    return;
                }
                // Atualizar senha
                const password_hash = yield (0, passwordHash_1.default)(newPassword);
                yield user.update({ password_hash }, { transaction });
                yield transaction.commit();
                (0, ResponseHandler_1.ResponseHandler)(res, 200, "Senha atualizada com sucesso");
            }
            catch (e) {
                if (transaction) {
                    yield transaction.rollback();
                }
                if (e instanceof HttpError_1.default) {
                    console.log(e);
                    (0, ResponseHandler_1.ResponseHandler)(res, e.statusCode, e.message);
                    return;
                }
                console.log(e);
                (0, ResponseHandler_1.ResponseHandler)(res, 500, "Erro ao atualizar senha");
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map