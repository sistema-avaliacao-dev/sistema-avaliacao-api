"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeString = normalizeString;
exports.findBestMatch = findBestMatch;
const fast_levenshtein_1 = __importDefault(require("fast-levenshtein"));
/**
 * Normaliza uma string removendo acentos, caracteres especiais e convertendo para minúsculas.
 */
function normalizeString(str) {
    return str
        .normalize("NFD") // Decompõe caracteres acentuados
        .replace(/[̀-ͯ]/g, "") // Remove acentos
        .replace(/[^a-zA-Z0-9 ]/g, "") // Remove caracteres especiais
        .trim()
        .toLowerCase();
}
/**
 * Encontra a melhor correspondência para uma string dentro de um conjunto de opções usando a distância de Levenshtein.
 */
function findBestMatch(input, options, maxDistance = 3) {
    let bestMatch = null;
    let bestDistance = Infinity;
    for (const option of options) {
        const distance = fast_levenshtein_1.default.get(input, option);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = option;
        }
    }
    return bestDistance <= maxDistance ? bestMatch : null; // Permite até `maxDistance` erros na correspondência
}
//# sourceMappingURL=stringUtils.js.map