import { Request, Response } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import Servidor from "../database/models/Servidor";
import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import Avaliacao from "../database/models/Avaliacao";
import SubcomissaoAlvo from "../database/models/SubcomissaoAlvo";
import ComissaoAlvo from "../database/models/ComissaoAlvo";
import HttpError from "../utils/HttpError";
import AvaliacaoService from "../services/AvaliacaoService";
import SubcomissaoServidor from "../database/models/SubcomissaoServidor";
import ComissaoServidor from "../database/models/ComissaoServidor";

class AvaliacaoController {
    async create(req: Request, res: Response) {
        let transaction: Transaction | null = null;

        try {
            transaction = await sequelize.transaction();
            const servidores_id: number[] = req.body.servidores_id

            if (!servidores_id) {
                ResponseHandler(res, 400, "Servidor não selecionado, selecione um servidor para dar início à avaliação!")
                return
            }

            for (const servidor_id of servidores_id) {
                const servidor: Servidor = await Servidor.findOne({ where: { id: servidor_id }, transaction })

                if (!servidor) {
                    ResponseHandler(res, 404, `Servidor não encontrado, selecione um servidor válido para dar início a sua avaliação!`)
                    return
                }

                // if (!servidor.email) {
                //     ResponseHandler(res, 400, `Servidor ${servidor.nome} não tem email cadastrado, cadastre o email do servidor antes de dar início a sua avaliação!`)
                //     return
                // }

                if (!servidor.chefia_imediata_servidores_id) {
                    ResponseHandler(res, 400, `Servidor ${servidor.nome} não tem chefia imediata cadastrada, cadastre a chefia imediata do servidor antes de dar início a sua avaliação!`)
                    return
                }

                const has_subcomissao: SubcomissaoAlvo = await SubcomissaoAlvo.findOne({ where: { servidores_id: servidor_id } })
                if (!has_subcomissao) {
                    ResponseHandler(res, 400, `Servidor ${servidor.nome} não tem uma subcomissão cadastrada, cadastre a subcomissão do servidor antes de dar início a sua avaliação!`)
                    return
                }

                const has_comissao: ComissaoAlvo = await ComissaoAlvo.findOne({ where: { servidores_id: servidor_id } })
                if (!has_comissao) {
                    ResponseHandler(res, 400, `Servidor ${servidor.nome} não tem uma comissão cadastrada, cadastre a comissão do servidor antes de dar início a sua avaliação!`)
                    return
                }

                const avaliacao_ativa: Avaliacao = await Avaliacao.findOne({ where: { servidores_id: servidor_id, data_fim: { [Op.is]: null } }, transaction })
                if (avaliacao_ativa) {
                    ResponseHandler(res, 400, `Servidor ${servidor.nome} já tem uma avaliação em andamento, certifique-se de que a ultima avaliação seja finalizada para iniciar uma nova avaliação!`)
                    return
                }

                const chefia = await Servidor.findOne({ where: { id: servidor.chefia_imediata_servidores_id } })
                const subcomissao_participantes_table = await SubcomissaoServidor.findAll({ where: { subcomissoes_avaliadoras_id: has_subcomissao.subcomissoes_avaliadoras_id } })
                const subcomissao_participantes = await Promise.all(
                    subcomissao_participantes_table.map(async (m: any) => {
                        const servidor = await Servidor.findOne({ where: { id: m.servidores_id } })
                        return servidor
                    })
                )
                const comissao_participantes_table = await ComissaoServidor.findAll({ where: { comissoes_avaliadoras_id: has_comissao.comissoes_avaliadoras_id } })
                const comissao_participantes = await Promise.all(
                    comissao_participantes_table.map(async (m: any) => {
                        const servidor = await Servidor.findOne({ where: { id: m.servidores_id } })
                        return servidor
                    })
                )
                await Avaliacao.create({
                    servidores_id: servidor_id,
                    subcomissao_snapshot: subcomissao_participantes,
                    chefia_snapshot: chefia,
                    comissao_snapshot: comissao_participantes
                }, { transaction })

                await transaction.commit();
            }


            ResponseHandler(res, 200, "Avaliação iniciada!")

        } catch (e) {
            if (transaction) {
                await transaction.rollback();
            }

            if (e) {
                console.log(e)
                ResponseHandler(res, 500, "Erro no servidor")
            }
        }
    }

    async get(req: Request, res: Response) {
        try {
            const avaliacao_id: number = parseInt(req.query.avaliacao_id?.toString())
            const servidor_id: number = parseInt(req.query.servidor_id?.toString())

            const avaliacao = await AvaliacaoService.get(avaliacao_id, servidor_id)

            ResponseHandler(res, 200, "Avaliação recuperada!", avaliacao)
        } catch (e) {
            if (e instanceof HttpError) {
                console.log(e)
                ResponseHandler(res, e.statusCode, e.message);
                return;
            }
            console.log(e)
            ResponseHandler(res, 500, (e as Error).message);
        }
    }

    async getBySubcomissao(req: Request, res: Response) {
        try {
            const subcomissao_id: number = parseInt(req.query.subcomissao_id?.toString())

            const avaliacoes = await AvaliacaoService.getBySubcomissao(subcomissao_id)

            ResponseHandler(res, 200, "Avaliação recuperada!", avaliacoes)
        } catch (e) {
            if (e instanceof HttpError) {
                console.log(e)
                ResponseHandler(res, e.statusCode, e.message);
                return;
            }
            console.log(e)
            ResponseHandler(res, 500, (e as Error).message);
        }
    }

    async getByComissao(req: Request, res: Response) {
        try {
            const comissao_id: number = parseInt(req.query.comissao_id?.toString())

            const avaliacoes = await AvaliacaoService.getByComissao(comissao_id)

            ResponseHandler(res, 200, "Avaliações recuperadas!", avaliacoes)
        } catch (e) {
            if (e instanceof HttpError) {
                console.log(e)
                ResponseHandler(res, e.statusCode, e.message);
                return;
            }
            console.log(e)
            ResponseHandler(res, 500, (e as Error).message);
        }
    }
}

export default new AvaliacaoController