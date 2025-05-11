import { Transaction } from "sequelize/types";
import HttpError from "../utils/HttpError";
import Avaliacao from "../database/models/Avaliacao";
import AvaliacaoResposta from "../database/models/AvaliacaoResposta";
import Servidor from "../database/models/Servidor";
import Cargo from "../database/models/Cargos";
import PesoAvaliacao from "../database/models/PesoAvaliacao";
import ParecerConclusivo from "../database/models/ParecerConclusivo";

interface ValidateParams {
    avaliacao_id?: number
    avaliacao_resposta?: any
    is_create?: boolean
    is_update?: boolean
}

interface CriteriosType {
    criterio_1: number[]
    criterio_2: number[]
    criterio_3: number[]
    criterio_4: number[]
    criterio_5: number[]
    criterio_6: number[]
    criterio_7: number[]
    criterio_8: number[]
    criterio_9: number[]
    criterio_10: number[]
    criterio_11: number[]
    criterio_12: number[]
}


export default new class ParecerConclusivoService {
    async create(avaliacao_id: number, avaliacao_resposta: any, transaction: Transaction) {
        try {

            await this.validate({ avaliacao_id, avaliacao_resposta, is_create: true })
            console.log(avaliacao_resposta)

            const avaliacao: Avaliacao = await Avaliacao.findOne({ where: { id: avaliacao_id } })
            const servidor: Servidor = await Servidor.findOne({ where: { id: avaliacao.servidores_id } })
            const cargo: Cargo = await Cargo.findOne({ where: { id: servidor.cargo_id } })
            const peso_avaliacao: any = await PesoAvaliacao.findOne({ where: { cargo_id: cargo.id } })

            console.log(peso_avaliacao)
            console.log(cargo)

            const respostas: string[] = []
            for (let i = 1; i <= 20; i++) {
                const key = `questao_${i}`;
                respostas.push(avaliacao_resposta[key]);
            }

            const pontos_obtidos_questao: number[] = []
            const pontos_distribuidos_questao: number[] = []
            respostas.map((resposta, index) => {
                switch (resposta) {
                    case "A":
                        pontos_obtidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`])
                        pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`])
                        break
                    case "B":
                        pontos_obtidos_questao.push(1.5 * peso_avaliacao[`peso_${index + 1}`])
                        pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`])
                        break
                    case "C":
                        pontos_obtidos_questao.push(1 * peso_avaliacao[`peso_${index + 1}`])
                        pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`])
                        break
                    case "D":
                        pontos_obtidos_questao.push(0 * peso_avaliacao[`peso_${index + 1}`])
                        pontos_distribuidos_questao.push(2 * peso_avaliacao[`peso_${index + 1}`])
                        break
                }
            })

            let criterios: CriteriosType = {
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

                    criterios.criterio_1 = [1]
                    criterios.criterio_2 = [2]
                    criterios.criterio_3 = [3]
                    criterios.criterio_4 = [4, 5, 6]
                    criterios.criterio_5 = [7]
                    criterios.criterio_6 = [8, 9, 10, 11]
                    criterios.criterio_7 = [12]
                    criterios.criterio_8 = [13]
                    criterios.criterio_9 = [14]
                    criterios.criterio_10 = [15, 16]
                    criterios.criterio_11 = [17, 18, 19]
                    criterios.criterio_12 = [20]

                    break
                case "MEDIO":

                    criterios.criterio_1 = [1]
                    criterios.criterio_2 = [2]
                    criterios.criterio_3 = [3]
                    criterios.criterio_4 = [4, 5, 6]
                    criterios.criterio_5 = [7]
                    criterios.criterio_6 = [8, 9, 10]
                    criterios.criterio_7 = [11]
                    criterios.criterio_8 = [12]
                    criterios.criterio_9 = [13]
                    criterios.criterio_10 = [14, 15]
                    criterios.criterio_11 = [16, 17, 18]
                    criterios.criterio_12 = [19]

                    break
                case "FUNDAMENTAL":

                    criterios.criterio_1 = [1]
                    criterios.criterio_2 = [2]
                    criterios.criterio_3 = [3]
                    criterios.criterio_4 = [4, 5]
                    criterios.criterio_5 = [6]
                    criterios.criterio_6 = [7, 8]
                    criterios.criterio_7 = [9]
                    criterios.criterio_8 = [10]
                    criterios.criterio_9 = [11]
                    criterios.criterio_10 = [12, 13]
                    criterios.criterio_11 = [14, 15, 16]
                    criterios.criterio_12 = [17]

                    break
            }

            const pontuacao_obtida_criterios: number[] = []
            const pontuacao_distribuida_criterios: number[] = []
            Object.values(criterios).map((criterio, index) => {
                let pontuacao_obtida: number = 0
                let pontuacao_distribuida: number = 0

                criterio.map((questao: number) => {
                    pontuacao_obtida += pontos_obtidos_questao[questao - 1]
                    pontuacao_distribuida += pontos_distribuidos_questao[questao - 1]
                })

                pontuacao_obtida_criterios.push(pontuacao_obtida)
                pontuacao_distribuida_criterios.push(pontuacao_distribuida)
            })

            const pontuacao_total_distribuida = pontuacao_distribuida_criterios.reduce((acc, valor) => acc + valor, 0);
            const pontuacao_total_obtida = pontuacao_obtida_criterios.reduce((acc, valor) => acc + valor, 0);

            await ParecerConclusivo.create({
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
            }, { transaction })
        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async update(avaliacao_id: number, avaliacao_resposta: any, transaction: Transaction) {
        try {

            console.log(avaliacao_resposta)
            await this.validate({ avaliacao_id, avaliacao_resposta })

            const parecer_conclusivo = await ParecerConclusivo.findOne({ where: { avaliacao_id: avaliacao_id } })

            await parecer_conclusivo.update({
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
            }, { transaction })

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async get(avaliacao_id: number) {
        try {

            await this.validate({avaliacao_id})

            const parecer_conclusivo = await ParecerConclusivo.findOne({ where: { avaliacao_id: avaliacao_id } })

            return parecer_conclusivo

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    private async validate({ avaliacao_id, avaliacao_resposta, is_create, is_update }: ValidateParams) {
        if (!avaliacao_id) {
            throw new HttpError(400, 'Avaliação não enviada')
        }

        const avaliacao = await Avaliacao.findOne({ where: { id: avaliacao_id } })
        if (!avaliacao) {
            throw new HttpError(404, 'Avaliação não encontrada')
        }


        const servidor: Servidor = await Servidor.findOne({ where: { id: avaliacao.servidores_id } })
        if (!servidor) {
            throw new HttpError(404, 'Servidor não encontrado')
        }

        if (is_create) {
            if (!avaliacao_resposta) {
                throw new HttpError(404, 'Subcomissão não respondeu a avaliação ainda')
            }

            const peso_avaliacao: PesoAvaliacao = await PesoAvaliacao.findOne({ where: { cargo_id: servidor.cargo_id } })
            if (!peso_avaliacao) {
                throw new HttpError(404, 'Peso não encontrado, contate o suporte')
            }

            const cargo: Cargo = await Cargo.findOne({ where: { id: servidor.cargo_id } })
            if (!cargo) {
                throw new HttpError(404, 'Cargo não encontrado, contate o suporte')
            }
        }

        if (is_update) {
            if (!avaliacao_resposta) {
                throw new HttpError(400, 'Respostas não enviadas')
            }

            if (avaliacao_resposta.atividade_complexa === undefined || avaliacao_resposta.atividade_complexa === null) {
                throw new HttpError(400, 'Selecione se a atividade é complexa')
            }

            if (avaliacao_resposta.conclusao_apto != true && avaliacao_resposta.conclusao_apto != false) {
                throw new HttpError(400, 'Informe se o avaliado está apto')
            }

            const parecer_conclusivo = await ParecerConclusivo.findOne({ where: { avaliacao_id: avaliacao_id } })
            if (!parecer_conclusivo) {
                throw new HttpError(404, 'Parecer conclusivo não encontrado')
            }
        }
    }
}