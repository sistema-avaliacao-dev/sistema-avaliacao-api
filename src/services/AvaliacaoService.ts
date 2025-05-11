import { Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Avaliacao from "../database/models/Avaliacao";
import Subcomissao from "../database/models/Subcomissao";
import ComissaoAlvo from "../database/models/ComissaoAlvo";
import SubcomissaoAlvo from "../database/models/SubcomissaoAlvo";
import Servidor from "../database/models/Servidor";
import Cargo from "../database/models/Cargos";
import Comissao from "../database/models/Comissao";
import SubcomissaoServidor from "../database/models/SubcomissaoServidor";

interface  ValidateParams {
    avaliacao_id?: number
    subcomissao_id?: number
    comissao_id?: number
    servidor_id?: number
}


export default new class AvaliacaoService {
    async get(avaliacao_id: number, servidor_id: number) {
        try {
            await this.validate({ avaliacao_id, servidor_id })

            let avaliacao

            if (servidor_id) { 
                avaliacao = await Avaliacao.findAll({ 
                    where: { servidores_id: servidor_id },
                    include: [
                        {
                            model: Servidor,
                            as: 'servidor',
                            include: [
                                {
                                    model: Cargo,
                                    as: 'cargo',
                                    attributes: ['id', 'nome', 'nivel']
                                },
                                {
                                    model: Servidor,
                                    as: 'chefia_imediata',
                                    attributes: ['id', 'nome', 'matricula', 'email', 'cargo_id'],
                                    include: [
                                        { model: Cargo, as: 'cargo', attributes: ['id', 'nome'] }
                                    ]
                                }
                            ],
                            attributes: ['id', 'nome', 'matricula', 'email', 'lotacao', 'data_admissao']
                        }
                    ]
                })
            } else if (avaliacao_id) {
                avaliacao = await Avaliacao.findOne({ 
                    where: { id: avaliacao_id },
                    include: [
                        {
                            model: Servidor,
                            as: 'servidor',
                            include: [
                                {
                                    model: Cargo,
                                    as: 'cargo',
                                    attributes: ['id', 'nome', 'nivel']
                                },
                                {
                                    model: Servidor,
                                    as: 'chefia_imediata',
                                    attributes: ['id', 'nome', 'matricula', 'email', 'cargo_id'],
                                    include: [
                                        { model: Cargo, as: 'cargo', attributes: ['id', 'nome'] }
                                    ]
                                }
                            ],
                            attributes: ['id', 'nome', 'matricula', 'email', 'lotacao', 'data_admissao']
                        }
                    ]
                })
                // Buscar membros da comissão
                let comissao = [];
                if (avaliacao && avaliacao.servidores_id) {
                  const ComissaoAlvo = require('../database/models/ComissaoAlvo').default;
                  const ComissaoServidor = require('../database/models/ComissaoServidor').default;
                  const Servidor = require('../database/models/Servidor').default;
                  const comissaoAlvo = await ComissaoAlvo.findOne({ where: { servidores_id: avaliacao.servidores_id } });
                  if (comissaoAlvo) {
                    const comissaoServidores = await ComissaoServidor.findAll({
                      where: { comissoes_avaliadoras_id: comissaoAlvo.comissoes_avaliadoras_id },
                      include: [{ model: Servidor, attributes: ['id', 'nome', 'matricula', 'email'] }]
                    });
                    comissao = comissaoServidores.map((cs: any) => cs.servidor);
                  }
                }
                return {
                  ...(avaliacao.toJSON ? avaliacao.toJSON() : avaliacao),
                  comissao
                };
            } else {
                avaliacao = await Avaliacao.findAll({
                    include: [
                        {
                            model: Servidor,
                            as: 'servidor',
                            include: [
                                {
                                    model: Cargo,
                                    as: 'cargo',
                                    attributes: ['id', 'nome', 'nivel']
                                },
                                {
                                    model: Servidor,
                                    as: 'chefia_imediata',
                                    attributes: ['id', 'nome', 'matricula', 'email', 'cargo_id'],
                                    include: [
                                        { model: Cargo, as: 'cargo', attributes: ['id', 'nome'] }
                                    ]
                                }
                            ],
                            attributes: ['id', 'nome', 'matricula', 'email', 'lotacao', 'data_admissao']
                        }
                    ]
                })
            }

            return avaliacao

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async getByComissao(comissao_id: number){
        try{
            await this.validate({ comissao_id })

            const servidores_comissao = await ComissaoAlvo.findAll({where: {comissoes_avaliadoras_id: comissao_id}})

            const servidores_avaliacoes = await Promise.all(
                servidores_comissao.map(async (servidor_comissao: ComissaoAlvo) => {
                    const avaliacoes = await Avaliacao.findAll({
                        where: {servidores_id: servidor_comissao.servidores_id},
                        include: [
                            {
                                model: Servidor,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargo,
                                        as: 'cargo',
                                        attributes: ['id', 'nome']
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email']
                            }
                        ]
                    })

                    return avaliacoes
                })
            )

            return servidores_avaliacoes.flat()
            
        }catch(e){
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async getBySubcomissao(subcomissao_id: number){
        try{
            await this.validate({ subcomissao_id })

            const servidores_subcomissao = await SubcomissaoAlvo.findAll({where: {subcomissoes_avaliadoras_id: subcomissao_id}})

            const servidores_avaliacoes = await Promise.all(
                servidores_subcomissao.map(async (servidor_subcomissao: SubcomissaoAlvo) => {
                    const avaliacoes = await Avaliacao.findAll({
                        where: {servidores_id: servidor_subcomissao.servidores_id},
                        include: [
                            {
                                model: Servidor,
                                as: 'servidor',
                                include: [
                                    {
                                        model: Cargo,
                                        as: 'cargo',
                                        attributes: ['id', 'nome']
                                    }
                                ],
                                attributes: ['id', 'nome', 'matricula', 'email']
                            }
                        ]
                    })

                    return avaliacoes
                })
            )

            return servidores_avaliacoes.flat()
            
        }catch(e){
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async create(servidores_id: number, otherFields: any) {
        let transaction: Transaction;
        try {
            transaction = await sequelize.transaction();

            // Fetch supervisor (chefia imediata)
            const servidor = await Servidor.findByPk(servidores_id, { include: ['chefia_imediata', 'cargo'] });
            let chefia = null;
            if (servidor && servidor.chefia_imediata) {
                chefia = {
                    id: servidor.chefia_imediata.id,
                    nome: servidor.chefia_imediata.nome,
                    matricula: servidor.chefia_imediata.matricula,
                    cargo: servidor.chefia_imediata.cargo ? {
                        id: servidor.chefia_imediata.cargo.id,
                        nome: servidor.chefia_imediata.cargo.nome
                    } : null
                };
            }

            // Fetch subcomissao (the one evaluating this servidor)
            const subAlvo = await SubcomissaoAlvo.findOne({ where: { servidores_id } });
            let subcomissao_snapshot: any[] = [];
            if (subAlvo) {
                const subServidores = await SubcomissaoServidor.findAll({
                    where: { subcomissoes_avaliadoras_id: subAlvo.subcomissoes_avaliadoras_id },
                    include: [{ model: Servidor, attributes: ['id', 'nome', 'matricula'] }]
                });
                subcomissao_snapshot = subServidores.map(ss => ({
                    id: ss.servidores_id,
                    nome: (ss as any).servidor?.nome,
                    matricula: (ss as any).servidor?.matricula
                }));
            }

            await Avaliacao.create({
                servidores_id,
                ...otherFields,
                chefia_snapshot: chefia,
                subcomissao_snapshot
            }, { transaction });

            await transaction.commit();
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

    private async validate({ avaliacao_id, subcomissao_id, comissao_id, servidor_id }: ValidateParams) {
        try {
            if (servidor_id) {
                const servidor_exists = await Servidor.findOne({ where: { id: servidor_id } })
                if (!servidor_exists) {
                    throw new HttpError(404, 'Servidor não encontrado')
                }
            }else if (avaliacao_id) {
                const avaliacao_exists = await Avaliacao.findOne({ where: { id: avaliacao_id } })
                if (!avaliacao_exists) {
                    throw new HttpError(404, 'Avaliação não encontrada')
                }
            }

            if(subcomissao_id){
                const subcomissao_exists = await Subcomissao.findOne({ where: { id: subcomissao_id } })
                if (!subcomissao_exists) {
                    throw new HttpError(404, 'Subcomissão não encontrada')
                }
            }

            if(comissao_id){
                const comissao_exists = await Comissao.findOne({ where: { id: comissao_id } })
                if (!comissao_exists) {
                    throw new HttpError(404, 'Comissão não encontrada')
                }
            }

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }
}