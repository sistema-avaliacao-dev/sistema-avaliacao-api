"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const ResponseHandler_1 = require("../middlewares/ResponseHandler");
const date_fns_1 = require("date-fns");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const corrigirCaracteres = (texto) => {
    return texto
        .replace(/Ã©/g, 'é')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã£/g, 'ã')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã³/g, 'ó')
        .replace(/Ã¡/g, 'á')
        .replace(/Ãª/g, 'ê')
        .replace(/Ãµ/g, 'õ')
        .replace(/Ã�/g, 'í')
        .replace(/Ã€/g, 'À')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã“/g, 'Ó')
        .replace(/Ãš/g, 'Ú')
        .replace(/Ã‡/g, 'Ç')
        .replace(/Ã‘/g, 'Ñ');
};
const parseCSV = (res, filePath) => {
    return new Promise((resolve, reject) => {
        const servidores = [];
        fs_1.default.createReadStream(filePath, { encoding: 'utf-8' })
            .pipe((0, csv_parser_1.default)({ separator: ';' }))
            .on('data', (row) => {
            var _a, _b, _c, _d, _e, _f, _g;
            // Função para converter data corretamente
            const formatarData = (data) => {
                if (!data || data.trim() === "")
                    return null;
                const formatos = ["dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
                for (const formato of formatos) {
                    const parsedDate = (0, date_fns_1.parse)(data.trim(), formato, new Date());
                    if ((0, date_fns_1.isValid)(parsedDate)) {
                        return (0, date_fns_1.format)(parsedDate, "yyyy-MM-dd");
                    }
                }
                return null;
            };
            // Função para remover pontos
            const removerPontos = (texto) => {
                return texto.replace(/\./g, ''); // Remove todos os pontos
            };
            const servidor = {
                matricula: removerPontos(corrigirCaracteres(((_a = row.matriculaFormatada) === null || _a === void 0 ? void 0 : _a.trim()) || '')),
                nome: removerPontos(corrigirCaracteres(((_b = row.nomeFuncionario) === null || _b === void 0 ? void 0 : _b.trim()) || '')),
                cpf: removerPontos(((_c = row.cpf) === null || _c === void 0 ? void 0 : _c.trim()) || ''),
                grau_instrucao: removerPontos(corrigirCaracteres(((_d = row.grauInstrucao) === null || _d === void 0 ? void 0 : _d.trim()) || '')),
                situacao_grau_instrucao: removerPontos(corrigirCaracteres(((_e = row.situacaoGrauInstrucao) === null || _e === void 0 ? void 0 : _e.trim()) || '')),
                cargo: removerPontos(corrigirCaracteres(((_f = row.cargo) === null || _f === void 0 ? void 0 : _f.trim()) || '')),
                lotacao: removerPontos(corrigirCaracteres(((_g = row.lotacaoFisica) === null || _g === void 0 ? void 0 : _g.trim()) || '')),
                data_admissao: formatarData(row.dataAdmissao)
            };
            if (servidor.matricula && servidor.nome) {
                servidores.push(servidor);
            }
        })
            .on('end', () => {
            if (servidores.length === 0) {
                (0, ResponseHandler_1.ResponseHandler)(res, 400, "O arquivo CSV está vazio ou mal formatado!");
                return;
            }
            resolve(servidores);
        })
            .on('error', (error) => {
            console.error("Erro ao processar o CSV:", error);
            (0, ResponseHandler_1.ResponseHandler)(res, 500, "Erro ao processar o arquivo, tente novamente mais tarde!");
            return;
        });
    });
};
exports.parseCSV = parseCSV;
//# sourceMappingURL=fileRead.js.map