"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servidorRoutes = void 0;
const express_1 = require("express");
const ServidorController_1 = __importDefault(require("../controllers/ServidorController"));
const multer_1 = __importDefault(require("multer"));
const Auth_1 = __importDefault(require("../middlewares/Auth"));
exports.servidorRoutes = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
exports.servidorRoutes.post('/', Auth_1.default.checkToken, Auth_1.default.isAdmin, upload.single("file"), ServidorController_1.default.create);
exports.servidorRoutes.get('/', Auth_1.default.checkToken, ServidorController_1.default.get);
exports.servidorRoutes.get('/inferiores', Auth_1.default.checkToken, ServidorController_1.default.getInferiores);
// servidorRoutes.post('/email', Auth.checkToken, ServidorController.editEmail)
exports.servidorRoutes.post('/chefia', Auth_1.default.checkToken, ServidorController_1.default.setChefia);
//# sourceMappingURL=servidorRoutes.js.map