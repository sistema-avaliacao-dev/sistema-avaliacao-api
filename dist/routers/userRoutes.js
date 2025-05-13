"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.post('/', Auth_1.default.checkToken, Auth_1.default.isAdmin, UserController_1.default.create);
exports.userRoutes.get('/', Auth_1.default.checkToken, UserController_1.default.getUser);
exports.userRoutes.put('/password', Auth_1.default.checkToken, UserController_1.default.updatePassword);
//# sourceMappingURL=userRoutes.js.map