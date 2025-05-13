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
const ResponseHandler_1 = require("./ResponseHandler");
const User_1 = __importDefault(require("../database/models/User"));
const passwordCompare_1 = __importDefault(require("../utils/passwordCompare"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../utils/auth");
const getTokenDecoded_1 = __importDefault(require("../utils/getTokenDecoded"));
class Auth {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = req.body.username;
                const password = req.body.password;
                //Validação de campos obrigatórios
                if (!username) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Username é um campo obrigatório, digite seu username!");
                    return;
                }
                if (!password) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 400, "Senha é um campo obrigatório, digite sua senha!");
                    return;
                }
                //Validação de existência do usuário
                const user = yield User_1.default.findOne({ where: { username } });
                if (!user) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 404, "Usuário não encontrado, digite um login válido!");
                    return;
                }
                //Validação de senha
                const passwordValid = yield (0, passwordCompare_1.default)(password, user);
                if (!passwordValid) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 401, "Senha inválida, digite uma senha válida ou recupere sua conta!");
                    return;
                }
                delete user.password_hash;
                const token = jsonwebtoken_1.default.sign(Object.assign({}, user), auth_1.auth.secret);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Usuário autenticado', { token });
            }
            catch (e) {
                if (e) {
                    console.log(e);
                    (0, ResponseHandler_1.ResponseHandler)(res, 500, "Erro no servidor");
                }
            }
        });
    }
    checkToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
                if (!token) {
                    throw (0, ResponseHandler_1.ResponseHandler)(res, 401, 'Token não enviado, envie um token!!');
                }
                const decoded = yield (0, getTokenDecoded_1.default)(token);
                if (!decoded) {
                    throw (0, ResponseHandler_1.ResponseHandler)(res, 401, 'Token inválido, envie um token válido!!');
                }
                next();
            }
            catch (e) {
                if (e) {
                    (0, ResponseHandler_1.ResponseHandler)(res, 401, "Token inválido, envie um token válido!!");
                }
            }
        });
    }
    isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const decoded = yield (0, getTokenDecoded_1.default)((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
            if (decoded.dataValues.role !== 'admin') {
                (0, ResponseHandler_1.ResponseHandler)(res, 401, "Usuário não autorizado, você não tem permissão para acessar esta página!");
                return;
            }
            next();
        });
    }
    isServidor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const decoded = yield (0, getTokenDecoded_1.default)((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
            if (decoded.dataValues.role !== 'servidor') {
                (0, ResponseHandler_1.ResponseHandler)(res, 401, "Usuário não autorizado, você não tem permissão para acessar esta página!");
                return;
            }
            next();
        });
    }
}
exports.default = new Auth();
//# sourceMappingURL=Auth.js.map