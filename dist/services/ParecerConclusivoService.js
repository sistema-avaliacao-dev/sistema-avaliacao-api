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
const HttpError_1 = __importDefault(require("../utils/HttpError"));
const Avaliacao_1 = __importDefault(require("../database/models/Avaliacao"));
const Servidor_1 = __importDefault(require("../database/models/Servidor"));
const Cargos_1 = __importDefault(require("../database/models/Cargos"));
const PesoAvaliacao_1 = __importDefault(require("../database/models/PesoAvaliacao"));
const ParecerConclusivo_1 = __importDefault(require("../database/models/ParecerConclusivo"));
exports.default = new class ParecerConclusivoService {
    create(avaliacao_id, avaliacao_resposta, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ avaliacao_id, avaliacao_resposta, is_create: true });
                console.log(avaliacao_resposta);
                const avaliacao = yield Avaliacao_1.default.findOne({ where: { id: avaliacao_id } });
                const servidor = yield Servidor_1.default.findOne({ where: { id: avaliacao.servidores_id } });
                const cargo = yield Cargos_1.default.findOne({ where: { id: servidor.cargo_id } });
                const peso_avaliacao = yield PesoAvaliacao_1.default.findOne({ where: { cargo_id: cargo.id } });
                console.log(peso_avaliacao);
                console.log(cargo);
                const respostas = [];
                for (let i = 1; i <= 20; i++) {
                    const key = `questao_${i}`;
                    respostas.push(avaliacao_resposta[key]);
                }
                const pontos_obtidos_questao = [];
                const pontos_distribuidos_questao = [];
                respostas.map((resposta, index) => {
                    switch (resposta) {
                        case "A":
                            pontos_obtidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`]);
                            pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`]);
                            break;
                        case "B":
                            pontos_obtidos_questao.push(1.5 * peso_avaliacao[`peso_${index + 1}`]);
                            pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`]);
                            break;
                        case "C":
                            pontos_obtidos_questao.push(1 * peso_avaliacao[`peso_${index + 1}`]);
                            pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`]);
                            break;
                        case "D":
                            pontos_obtidos_questao.push(0 * peso_avaliacao[`peso_${index + 1}`]);
                            pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`]);
                            break;
                    }
                });
                let criterios = {
                    criterio_1: [],
                    criterio_2: [],
                    criterio_3: [],
                    criterio_4: [],
                    criterio_5: [],
                    criterio_6: [],
                    criterio_7: [],
                    criterio_8: [],
                    criterio_9: [],
                    criterio_10: [],
                    criterio_11: [],
                    criterio_12: [],
                };
                switch (cargo.nivel) {
                    case "SUPERIOR":
                        criterios.criterio_1 = [1];
                        criterios.criterio_2 = [2];
                        criterios.criterio_3 = [3];
                        criterios.criterio_4 = [4, 5, 6];
                        criterios.criterio_5 = [7];
                        criterios.criterio_6 = [8, 9, 10, 11];
                        criterios.criterio_7 = [12];
                        criterios.criterio_8 = [13];
                        criterios.criterio_9 = [14];
                        criterios.criterio_10 = [15, 16];
                        criterios.criterio_11 = [17, 18, 19];
                        criterios.criterio_12 = [20];
                        break;
                    case "MEDIO":
                        criterios.criterio_1 = [1];
                        criterios.criterio_2 = [2];
                        criterios.criterio_3 = [3];
                        criterios.criterio_4 = [4, 5, 6];
                        criterios.criterio_5 = [7];
                        criterios.criterio_6 = [8, 9, 10];
                        criterios.criterio_7 = [11];
                        criterios.criterio_8 = [12];
                        criterios.criterio_9 = [13];
                        criterios.criterio_10 = [14, 15];
                        criterios.criterio_11 = [16, 17, 18];
                        criterios.criterio_12 = [19];
                        break;
                    case "FUNDAMENTAL":
                        criterios.criterio_1 = [1];
                        criterios.criterio_2 = [2];
                        criterios.criterio_3 = [3];
                        criterios.criterio_4 = [4, 5];
                        criterios.criterio_5 = [6];
                        criterios.criterio_6 = [7, 8];
                        criterios.criterio_7 = [9];
                        criterios.criterio_8 = [10];
                        criterios.criterio_9 = [11];
                        criterios.criterio_10 = [12, 13];
                        criterios.criterio_11 = [14, 15, 16];
                        criterios.criterio_12 = [17];
                        break;
                }
                const pontuacao_obtida_criterios = [];
                const pontuacao_distribuida_criterios = [];
                Object.values(criterios).map((criterio, index) => {
                    let pontuacao_obtida = 0;
                    let pontuacao_distribuida = 0;
                    criterio.map((questao) => {
                        pontuacao_obtida += pontos_obtidos_questao[questao - 1];
                        pontuacao_distribuida += pontos_distribuidos_questao[questao - 1];
                    });
                    pontuacao_obtida_criterios.push(pontuacao_obtida);
                    pontuacao_distribuida_criterios.push(pontuacao_distribuida);
                });
                const pontuacao_total_distribuida = pontuacao_distribuida_criterios.reduce((acc, valor) => acc + valor, 0);
                const pontuacao_total_obtida = pontuacao_obtida_criterios.reduce((acc, valor) => acc + valor, 0);
                yield ParecerConclusivo_1.default.create({
                    avaliacao_id: avaliacao_id,
                    criterio_1_distribuido: pontuacao_distribuida_criterios[0],
                    criterio_1_obtido: pontuacao_obtida_criterios[0],
                    criterio_2_distribuido: pontuacao_distribuida_criterios[1],
                    criterio_2_obtido: pontuacao_obtida_criterios[1],
                    criterio_3_distribuido: pontuacao_distribuida_criterios[2],
                    criterio_3_obtido: pontuacao_obtida_criterios[2],
                    criterio_4_distribuido: pontuacao_distribuida_criterios[3],
                    criterio_4_obtido: pontuacao_obtida_criterios[3],
                    criterio_5_distribuido: pontuacao_distribuida_criterios[4],
                    criterio_5_obtido: pontuacao_obtida_criterios[4],
                    criterio_6_distribuido: pontuacao_distribuida_criterios[5],
                    criterio_6_obtido: pontuacao_obtida_criterios[5],
                    criterio_7_distribuido: pontuacao_distribuida_criterios[6],
                    criterio_7_obtido: pontuacao_obtida_criterios[6],
                    criterio_8_distribuido: pontuacao_distribuida_criterios[7],
                    criterio_8_obtido: pontuacao_obtida_criterios[7],
                    criterio_9_distribuido: pontuacao_distribuida_criterios[8],
                    criterio_9_obtido: pontuacao_obtida_criterios[8],
                    criterio_10_distribuido: pontuacao_distribuida_criterios[9],
                    criterio_10_obtido: pontuacao_obtida_criterios[9],
                    criterio_11_distribuido: pontuacao_distribuida_criterios[10],
                    criterio_11_obtido: pontuacao_obtida_criterios[10],
                    criterio_12_distribuido: pontuacao_distribuida_criterios[11],
                    criterio_12_obtido: pontuacao_obtida_criterios[11],
                    total_distribuido: pontuacao_total_distribuida,
                    total_obtido: pontuacao_total_obtida
                }, { transaction });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    update(avaliacao_id, avaliacao_resposta, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(avaliacao_resposta);
                yield this.validate({ avaliacao_id, avaliacao_resposta });
                const parecer_conclusivo = yield ParecerConclusivo_1.default.findOne({ where: { avaliacao_id: avaliacao_id } });
                yield parecer_conclusivo.update({
                    atividade_complexa: avaliacao_resposta.atividade_complexa,
                    metas_pontos_fortes: avaliacao_resposta.metas_pontos_fortes && avaliacao_resposta.metas_pontos_fortes,
                    metas_pontos_fracos: avaliacao_resposta.metas_pontos_fracos && avaliacao_resposta.metas_pontos_fracos,
                    metas_melhorias: avaliacao_resposta.metas_melhorias && avaliacao_resposta.metas_melhorias,
                    inibidores_falta_integracao: avaliacao_resposta.inibidores_falta_integracao && avaliacao_resposta.inibidores_falta_integracao,
                    inibidores_falta_funcao: avaliacao_resposta.inibidores_falta_funcao && avaliacao_resposta.inibidores_falta_funcao,
                    inibidores_problemas_particulares: avaliacao_resposta.inibidores_problemas_particulares && avaliacao_resposta.inibidores_problemas_particulares,
                    inibidores_dificuldades_chefia: avaliacao_resposta.inibidores_dificuldades_chefia && avaliacao_resposta.inibidores_dificuldades_chefia,
                    inibidores_desinteresse_servidor: avaliacao_resposta.inibidores_desinteresse_servidor && avaliacao_resposta.inibidores_desinteresse_servidor,
                    inibidores_outros: avaliacao_resposta.inibidores_outros && avaliacao_resposta.inibidores_outros,
                    conclusao_apto: avaliacao_resposta.conclusao_apto
                }, { transaction });
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    get(avaliacao_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.validate({ avaliacao_id });
                const parecer_conclusivo = yield ParecerConclusivo_1.default.findOne({ where: { avaliacao_id: avaliacao_id } });
                return parecer_conclusivo;
            }
            catch (e) {
                if (e) {
                    if (e instanceof HttpError_1.default)
                        throw e;
                    throw new HttpError_1.default(500, e.message);
                }
            }
        });
    }
    validate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ avaliacao_id, avaliacao_resposta, is_create, is_update }) {
            if (!avaliacao_id) {
                throw new HttpError_1.default(400, 'Avaliação não enviada');
            }
            const avaliacao = yield Avaliacao_1.default.findOne({ where: { id: avaliacao_id } });
            if (!avaliacao) {
                throw new HttpError_1.default(404, 'Avaliação não encontrada');
            }
            const servidor = yield Servidor_1.default.findOne({ where: { id: avaliacao.servidores_id } });
            if (!servidor) {
                throw new HttpError_1.default(404, 'Servidor não encontrado');
            }
            if (is_create) {
                if (!avaliacao_resposta) {
                    throw new HttpError_1.default(404, 'Subcomissão não respondeu a avaliação ainda');
                }
                const peso_avaliacao = yield PesoAvaliacao_1.default.findOne({ where: { cargo_id: servidor.cargo_id } });
                if (!peso_avaliacao) {
                    throw new HttpError_1.default(404, 'Peso não encontrado, contate o suporte');
                }
                const cargo = yield Cargos_1.default.findOne({ where: { id: servidor.cargo_id } });
                if (!cargo) {
                    throw new HttpError_1.default(404, 'Cargo não encontrado, contate o suporte');
                }
            }
            if (is_update) {
                if (!avaliacao_resposta) {
                    throw new HttpError_1.default(400, 'Respostas não enviadas');
                }
                if (avaliacao_resposta.atividade_complexa === undefined || avaliacao_resposta.atividade_complexa === null) {
                    throw new HttpError_1.default(400, 'Selecione se a atividade é complexa');
                }
                if (avaliacao_resposta.conclusao_apto != true && avaliacao_resposta.conclusao_apto != false) {
                    throw new HttpError_1.default(400, 'Informe se o avaliado está apto');
                }
                const parecer_conclusivo = yield ParecerConclusivo_1.default.findOne({ where: { avaliacao_id: avaliacao_id } });
                if (!parecer_conclusivo) {
                    throw new HttpError_1.default(404, 'Parecer conclusivo não encontrado');
                }
            }
        });
    }
};
//# sourceMappingURL=ParecerConclusivoService.js.map