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
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const ResponseHandler_1 = require("../middlewares/ResponseHandler");
const SubcomissaoServidorService_1 = __importDefault(require("../services/SubcomissaoServidorService"));
class SubcomissaoServidorController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subcomissao_id = req.body.subcomissao_id;
                const servidor_id = req.body.servidor_id;
                yield SubcomissaoServidorService_1.default.create(subcomissao_id, servidor_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor da subcomissão definido com sucesso!');
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const subcomissao_servidor_id = parseInt((_a = req.query.subcomissao_servidor_id) === null || _a === void 0 ? void 0 : _a.toString());
                yield SubcomissaoServidorService_1.default.delete(subcomissao_servidor_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor retirado da subcomissão com sucesso!');
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
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const subcomissao_servidor_id = parseInt((_a = req.query.subcomissao_servidor_id) === null || _a === void 0 ? void 0 : _a.toString());
                const subcomissao_id = parseInt((_b = req.query.subcomissao_id) === null || _b === void 0 ? void 0 : _b.toString());
                const subcomissao_servidor = yield SubcomissaoServidorService_1.default.get(subcomissao_servidor_id, subcomissao_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Servidor da subcomissão encontrado', subcomissao_servidor);
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
exports.default = new SubcomissaoServidorController;
//# sourceMappingURL=SubcomissaoServidorController.js.map