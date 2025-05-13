"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const Auth_1 = __importDefault(require("../middlewares/Auth"));
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post('/login', Auth_1.default.login);
//# sourceMappingURL=authRoutes.js.map