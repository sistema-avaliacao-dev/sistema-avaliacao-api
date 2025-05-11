import { Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import { respostasAvaliacao } from "../utils/types/respostasAvaliacao";
import Avaliacao from "../database/models/Avaliacao";
import AvaliacaoResposta from "../database/models/AvaliacaoResposta";
import { tiposAvalicaoResposta } from "../utils/tiposAvaliacaoResposta";
import ParecerConclusivoService from "./ParecerConclusivoService";
import Servidor from "../database/models/Servidor";
import Cargo from "../database/models/Cargos";

interface ValidateParams {
    avaliacao_id?: number,
    tipo?: string,
    respostas?: respostasAvaliacao,
    is_create?: boolean
}

export default new class AvaliacaoRespostaService {

    async create(avaliacao_id: number, tipo: string, respostas: respostasAvaliacao) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ avaliacao_id, tipo, respostas, is_create: true })

            const avaliacao: Avaliacao = await Avaliacao.findOne({ where: { id: avaliacao_id } })

            if (tipo == 'parecer_conclusivo') {
                const data_atual = new Date()

                await avaliacao.update({ data_fim: data_atual, status: 'finalizada' }, { transaction })

                await ParecerConclusivoService.update(avaliacao_id, respostas, transaction)
            } else {
                const avaliacao_resposta = await AvaliacaoResposta.create({
                    avaliacoes_id: avaliacao_id,
                    tipo,
                    ...respostas
                }, { transaction })

                let proximo_tipo: string = ''

                tiposAvalicaoResposta.map((tipo_modelo, index) => {
                    if (tipo_modelo == tipo) {
                        proximo_tipo = tiposAvalicaoResposta[index + 1]
                    }
                })

                if (proximo_tipo == 'parecer_conclusivo') {
                    await ParecerConclusivoService.create(avaliacao_id, avaliacao_resposta,transaction)
                }

                await avaliacao.update({ status: proximo_tipo }, { transaction })
            }

            await transaction.commit()
        } catch (e) {
            if (transaction) {
                await transaction.rollback();
            }
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async get(avaliacao_id: number) {
        try {

            await this.validate({ avaliacao_id })

            const respostas = await AvaliacaoResposta.findAll({ where: { avaliacoes_id: avaliacao_id } })
            const parecer_conclusivo = await ParecerConclusivoService.get(avaliacao_id)

            return {...respostas, parecer_conclusivo}

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    private async validate({ avaliacao_id, tipo, respostas, is_create }: ValidateParams) {

        if (!avaliacao_id) {
            throw new HttpError(400, 'Avaliação não enviada, selecione uma avaliação antes de responde-la')
        }
        const avaliacao: Avaliacao = await Avaliacao.findOne({ where: { id: avaliacao_id } })
        if (!avaliacao) {
            throw new HttpError(404, 'Avaliação não encontrada, selecione uma avaliação válida')
        }

        if (is_create) {

            if (avaliacao.data_fim) {
                throw new HttpError(400, 'Avaliação já foi finalizada, selecione uma avaliação em andamento')
            }


            if (!tipo) {
                throw new HttpError(400, 'Tipo de avaliação não enviado, envie o tipo da avaliação antes de responde-la')
            }
            if (!tiposAvalicaoResposta.includes(tipo)) {
                throw new HttpError(404, 'Tipo de avaliação não encontrado, selecione um tipo de avaliação válido')
            }
            if (tipo != avaliacao.status) {
                throw new HttpError(404, `A avaliação possui o seguinte status: ${avaliacao.status} `)
            }


            if (tipo !== 'parecer_conclusivo') {
                if (!respostas || Object.values(respostas).length == 0 || Object.values(respostas).length < 16) {
                    throw new HttpError(400, 'Respostas não enviadas, envie todas as respostas da avaliação para responde-la')
                }

                const servidor: Servidor = await Servidor.findOne({ where: { id: avaliacao.servidores_id } })
                const cargo: Cargo = await Cargo.findOne({ where: { id: servidor.cargo_id } })

                switch (cargo.nome) {
                    case "SUPERIOR":
                        if (Object.values(respostas).length != 19) {
                            throw new HttpError(400, 'Envie todas as 20 respostas para responder o formulário.')
                        }
                        break
                    case "MEDIO":
                        if (Object.values(respostas).length != 18) {
                            throw new HttpError(400, 'Envie todas as 19 respostas para responder o formulário.')
                        }
                        break
                    case "FUNDAMENTAL":
                        if (Object.values(respostas).length != 16) {
                            throw new HttpError(400, 'Envie todas as 19 respostas para responder o formulário.')
                        }
                        break
                }

            }

            if(tipo == 'parecer_conclusivo'){
                if(Object.values(respostas).length == 0 ){
                    throw new HttpError(400, 'Respostas não enviadas, envie todas as respostas da avaliação para responde-la')
                }

                if(respostas.atividade_complexa === undefined || respostas.atividade_complexa === null){
                    throw new HttpError(400, 'Selecione se a atividade é complexa')
                }

                if(respostas.conclusao_apto === undefined || respostas.conclusao_apto === null){
                    throw new HttpError(400, 'Selecione se o servidor está apto')
                }
            }


        }
    }
}