"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = require("./routers/userRoutes");
const authRoutes_1 = require("./routers/authRoutes");
const servidorRoutes_1 = require("./routers/servidorRoutes");
const avaliacaoRoutes_1 = require("./routers/avaliacaoRoutes");
const cargoRoutes_1 = require("./routers/cargoRoutes");
const subcomissaoRoutes_1 = __importDefault(require("./routers/subcomissaoRoutes"));
const comissaoRoutes_1 = __importDefault(require("./routers/comissaoRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Configuração do CORS
const corsOptions = {
    origin: [
        'http://localhost:3000', // Desenvolvimento local
        process.env.FRONTEND_URL, // URL do frontend em produção
    ].filter(Boolean), // Remove valores undefined/null
    credentials: true, // Permite cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // Cache das opções de preflight por 24 horas
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use("/user", userRoutes_1.userRoutes);
app.use("/auth", authRoutes_1.authRoutes);
app.use("/servidor", servidorRoutes_1.servidorRoutes);
app.use("/cargo", cargoRoutes_1.cargoRoutes);
app.use("/subcomissao", subcomissaoRoutes_1.default);
app.use("/comissao", comissaoRoutes_1.default);
app.use("/avaliacao", avaliacaoRoutes_1.avaliacaoRoutes);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await Cargo.create({nome: "AUXILIAR ADMINISTRATIVO", nivel: 'medio'})
        // await Cargo.create({nome: "AJUDANTE DE SANEAMENTO", nivel: 'fundamental'})
        // await Cargo.create({nome: "TÉCNICO OPERACIONAL ETA/ETE", nivel: 'medio'})
        // await Cargo.create({nome: "TECNICO EM SERGURANCA DO TRABALHO", nivel: 'medio'})
        // await Cargo.create({nome: "TÉCNICO EM ELETROMECÂNICA", nivel: 'medio'})
        // await Cargo.create({nome: "TÉCNICO DEM EDIFICAÇÕES", nivel: 'medio'})
        // await Cargo.create({nome: "QUÍMICO", nivel: 'superior'})
        // await Cargo.create({nome: "PEDREIRO", nivel: 'fundamental'})
        // await Cargo.create({nome: "OPERADOR DE MAQUINA PESADA", nivel: 'fundamental'})
        // await Cargo.create({nome: "MOTORISTA", nivel: 'fundamental'})
        // await Cargo.create({nome: "FISCAL", nivel: 'medio'})
        // await Cargo.create({nome: "ENGENHEIRO CIVIL", nivel: 'superior'})
        // await Cargo.create({nome: "ENCANADOR", nivel: 'fundamental'})
        // await Cargo.create({nome: "BIÓLOGO", nivel: 'superior'})
        // await Cargo.create({nome: "AGENTE ADMINISTRATIVO", nivel: 'medio'})
        // const password_hash = await passwordHash('admin@2025');
        // await User.create({
        //     username: 'admin',
        //     password_hash,
        //     role: 'admin'
        // })
        return console.log(`Server e database rodando na porta ${port}`);
    }
    catch (e) {
        return console.log('Erro no servidor: ' + e);
    }
}));
//# sourceMappingURL=index.js.map