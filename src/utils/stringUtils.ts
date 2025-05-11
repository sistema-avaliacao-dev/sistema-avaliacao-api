import levenshtein from "fast-levenshtein";



/**
 * Normaliza uma string removendo acentos, caracteres especiais e convertendo para minúsculas.
 */
export function normalizeString(str: string): string {
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
export function findBestMatch(input: string, options: string[], maxDistance: number = 3): string | null {
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const option of options) {
        const distance = levenshtein.get(input, option);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = option;
        }
    }

    return bestDistance <= maxDistance ? bestMatch : null; // Permite até `maxDistance` erros na correspondência
}