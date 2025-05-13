"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const database_1 = __importDefault(require("../config/database"));
const sequelize = new sequelize_typescript_1.Sequelize(Object.assign(Object.assign({}, database_1.default.getDatabaseConfig()), { dialect: 'mysql', models: [__dirname + "/models"] }));
exports.default = sequelize;
//# sourceMappingURL=db.js.map