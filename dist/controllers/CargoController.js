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
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const CargoService_1 = __importDefault(require("../services/CargoService"));
exports.default = new class CargoController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const cargo_id = parseInt((_a = req.query.cargo_id) === null || _a === void 0 ? void 0 : _a.toString());
                const cargo = yield CargoService_1.default.get(cargo_id);
                (0, ResponseHandler_1.ResponseHandler)(res, 200, 'Cargo encontrado', cargo);
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
};
//# sourceMappingURL=CargoController.js.map