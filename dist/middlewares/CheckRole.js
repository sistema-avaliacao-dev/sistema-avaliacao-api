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
exports.checkRole = void 0;
const getTokenDecoded_1 = __importDefault(require("../utils/getTokenDecoded"));
const ResponseHandler_1 = require("./ResponseHandler");
const checkRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            const decoded = yield (0, getTokenDecoded_1.default)(token);
            let authorized = false;
            roles.map(role => {
                if (decoded.role == role) {
                    authorized = true;
                }
            });
            if (authorized) {
                next();
            }
            (0, ResponseHandler_1.ResponseHandler)(res, 401, 'Usuário não autorizado');
            return;
        }
        catch (e) {
            console.log(e);
            (0, ResponseHandler_1.ResponseHandler)(res, 500, 'Erro no servidor');
        }
    });
};
exports.checkRole = checkRole;
//# sourceMappingURL=CheckRole.js.map