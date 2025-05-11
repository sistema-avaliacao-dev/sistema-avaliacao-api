import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import { ServidorAttributes } from '../database/models/Servidor';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { Response } from 'express';
import { parse, isValid, format } from 'date-fns';

const upload = multer({ dest: 'uploads/' });

interface ServidorInterface{
    cpf: string
    matricula: string
    nome: string
    cargo: string
    lotacao: string
    grau_instrucao: string
    situacao_grau_instrucao: string
    data_admissao: string
}

const corrigirCaracteres = (texto: string): string => {
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


export const parseCSV = (res: Response, filePath: string): Promise<ServidorInterface[]> => {
    return new Promise((resolve, reject) => {
        const servidores: ServidorInterface[] = [];

        fs.createReadStream(filePath, {encoding: 'utf-8'})
            .pipe(csvParser({ separator: ';' }))
            .on('data', (row) => {

                // Função para converter data corretamente
                const formatarData = (data: string): string | null => {
                    if (!data || data.trim() === "") return null;
                    
                    const formatos = ["dd/MM/yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
                    
                    for (const formato of formatos) {
                        const parsedDate = parse(data.trim(), formato, new Date());
                        if (isValid(parsedDate)) {
                            return format(parsedDate, "yyyy-MM-dd");
                        }
                    }
                    
                    return null;
                };

                // Função para remover pontos
                const removerPontos = (texto: string): string => {
                    return texto.replace(/\./g, ''); // Remove todos os pontos
                };

                const servidor: ServidorInterface = {
                    matricula: removerPontos(corrigirCaracteres(row.matriculaFormatada?.trim() || '')),
                    nome: removerPontos(corrigirCaracteres(row.nomeFuncionario?.trim() || '')),
                    cpf: removerPontos(row.cpf?.trim() || ''),
                    grau_instrucao: removerPontos(corrigirCaracteres(row.grauInstrucao?.trim() || '')),
                    situacao_grau_instrucao: removerPontos(corrigirCaracteres(row.situacaoGrauInstrucao?.trim() || '')),
                    cargo: removerPontos(corrigirCaracteres(row.cargo?.trim() || '')),
                    lotacao: removerPontos(corrigirCaracteres(row.lotacaoFisica?.trim() || '')),
                    data_admissao: formatarData(row.dataAdmissao)
                };

                if (servidor.matricula && servidor.nome) {
                    servidores.push(servidor);
                }
            })
            .on('end', () => {
                if (servidores.length === 0) {
                    ResponseHandler(res, 400, "O arquivo CSV está vazio ou mal formatado!");
                    return 
                }
                resolve(servidores);
                
            })
            .on('error', (error) => {
                console.error("Erro ao processar o CSV:", error);
                ResponseHandler(res, 500, "Erro ao processar o arquivo, tente novamente mais tarde!")
                return
            });
    });
};
