"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargoRoutes = void 0;
const express_1 = require("express");
const CargoController_1 = __importDefault(require("../controllers/CargoController"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
exports.cargoRoutes = (0, express_1.Router)();
exports.cargoRoutes.get('/', Auth_1.default.checkToken, CargoController_1.default.get);
//# sourceMappingURL=cargoRoutes.js.map