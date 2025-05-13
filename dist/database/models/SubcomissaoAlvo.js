"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let SubcomissaoAlvo = class SubcomissaoAlvo extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        allowNull: false
    })
], SubcomissaoAlvo.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: {
            model: "subcomissoes_avaliadoras",
            key: "id"
        }
    })
], SubcomissaoAlvo.prototype, "subcomissoes_avaliadoras_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: {
            model: "servidores",
            key: "id"
        }
    })
], SubcomissaoAlvo.prototype, "servidores_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW
    })
], SubcomissaoAlvo.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW
    })
], SubcomissaoAlvo.prototype, "updatedAt", void 0);
SubcomissaoAlvo = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "subcomissoes_alvos",
        modelName: "SubcomissaoAlvo",
        createdAt: true,
        updatedAt: true,
    })
], SubcomissaoAlvo);
exports.default = SubcomissaoAlvo;
//# sourceMappingURL=SubcomissaoAlvo.js.map