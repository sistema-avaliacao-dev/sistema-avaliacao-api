"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Cargos_1 = __importDefault(require("./Cargos"));
let Servidor = class Servidor extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        allowNull: false
    })
], Servidor.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    })
], Servidor.prototype, "users_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Servidor.prototype, "cpf", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Servidor.prototype, "matricula", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Servidor.prototype, "nome", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: {
            model: "cargos",
            key: "id"
        }
    })
], Servidor.prototype, "cargo_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Servidor.prototype, "lotacao", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Servidor.prototype, "grau_instrucao", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false
    })
], Servidor.prototype, "situacao_grau_instrucao", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false
    })
], Servidor.prototype, "data_admissao", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
        references: {
            model: "servidores",
            key: "id"
        }
    })
], Servidor.prototype, "chefia_imediata_servidores_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false
    })
], Servidor.prototype, "is_active", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Cargos_1.default, 'cargo_id')
], Servidor.prototype, "cargo", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Servidor, 'chefia_imediata_servidores_id')
], Servidor.prototype, "chefia_imediata", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Servidor, 'chefia_imediata_servidores_id')
], Servidor.prototype, "subordinados", void 0);
Servidor = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "servidores",
        modelName: "Servidor",
        createdAt: true,
        updatedAt: true,
    })
], Servidor);
exports.default = Servidor;
//# sourceMappingURL=Servidor.js.map