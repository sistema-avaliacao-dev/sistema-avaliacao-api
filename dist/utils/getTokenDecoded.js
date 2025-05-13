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
exports.default = getTokenDecoded;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
function getTokenDecoded(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof (jsonwebtoken_1.default.verify(token, auth_1.auth.secret)) == String.prototype) {
            return JSON.parse(jsonwebtoken_1.default.verify(token, auth_1.auth.secret).toString());
        }
        else {
            return jsonwebtoken_1.default.verify(token, auth_1.auth.secret);
        }
    });
}
//# sourceMappingURL=getTokenDecoded.js.map