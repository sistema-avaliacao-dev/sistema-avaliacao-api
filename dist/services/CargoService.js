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
const Cargos_1 = __importDefault(require("../database/models/Cargos"));
exports.default = new class CargoService {
    get(cargo_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ cargo_id });
                let cargo;
                if (cargo_id) {
                    cargo = yield Cargos_1.default.findOne({ where: { id: cargo_id } });
                }
                else {
                    cargo = yield Cargos_1.default.findAll();
                }
                return cargo;
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
        return __awaiter(this, arguments, void 0, function* ({ cargo_id }) {
            try {
                if (cargo_id) {
                    const cargo_exists = yield Cargos_1.default.findOne({ where: { id: cargo_id } });
                    if (!cargo_exists) {
                        throw new HttpError_1.default(404, 'Cargo não encontrado');
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
};
//# sourceMappingURL=CargoService.js.map