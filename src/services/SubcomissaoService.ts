import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Subcomissao from "../database/models/Subcomissao";
import SubcomissaoAlvo from "../database/models/SubcomissaoAlvo";
import SubcomissaoServidor from "../database/models/SubcomissaoServidor";
import { SubcomissaoGet } from "../controllers/SubcomissaoController";
import Servidor from "../database/models/Servidor";
import Cargo from "../database/models/Cargos";
import User from "../database/models/User";

interface ValidateParams {
    subcomissao_id?: number,
    nome?: string,
    nivel?: string,
    is_update?: boolean,
    is_delete?: boolean,
    is_get?: boolean,
    servidor_id?: number
}

class SubcomissaoService {
    async create(nome: string, nivel: string) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ nome, nivel })

            await Subcomissao.create({
                nome: nome,
                nivel: nivel
            }, { transaction })

            // Se chegou aqui sem erros, confirma a transação
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

    async update(subcomissao_id: number, nome: string, nivel: string) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ subcomissao_id, nome, nivel, is_update: true })

            await Subcomissao.update({
                nome: nome,
                nivel: nivel
            }, { where: { id: subcomissao_id }, transaction })

            // Se chegou aqui sem erros, confirma a transação
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

    async delete(subcomissao_id: number) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ subcomissao_id, is_delete: true })

            //Deleção das outras tabelas
            await SubcomissaoAlvo.destroy({ where: { subcomissoes_avaliadoras_id: subcomissao_id }, transaction })
            await SubcomissaoServidor.destroy({ where: { subcomissoes_avaliadoras_id: subcomissao_id }, transaction })

            //Deleção da subcomissão
            await Subcomissao.destroy({ where: { id: subcomissao_id }, transaction })

            // Se chegou aqui sem erros, confirma a transação
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

    async get(subcomissao_id?: number, servidor_id?: number) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ subcomissao_id, servidor_id, is_get: true })

            let subcomissaoId = subcomissao_id
            const servidor: Servidor = await Servidor.findOne({ where: { users_id: servidor_id }, transaction })

            if (servidor_id) {
                const subcomissao_servidor = await SubcomissaoServidor.findOne({ where: { servidores_id: servidor.id }, transaction })
                if (subcomissao_servidor) {
                    subcomissaoId = subcomissao_servidor.subcomissoes_avaliadoras_id
                }
            }
            const subcomissao: Subcomissao = await Subcomissao.findOne({ where: { id: subcomissaoId }, transaction })
            const subcomissao_alvos: SubcomissaoAlvo[] = await SubcomissaoAlvo.findAll({ where: { subcomissoes_avaliadoras_id: subcomissaoId }, transaction })
            const subcomissao_servidores: SubcomissaoServidor[] = await SubcomissaoServidor.findAll({ where: { subcomissoes_avaliadoras_id: subcomissaoId }, transaction })

            const subcomissao_get: SubcomissaoGet = {
                subcomissao,
                subcomissao_alvos: [...subcomissao_alvos],
                subcomissao_servidores: [...subcomissao_servidores]
            }

            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

            return subcomissao_get

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

    async getAll() {
        try {
            const subcomissoes: Subcomissao[] = await Subcomissao.findAll()
            return subcomissoes
        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async addServidores(subcomissao_id: number, servidores_id: number[]) {
        const subcomissao = await Subcomissao.findByPk(subcomissao_id);
        if (!subcomissao) {
            throw new Error("Subcomissão não encontrada");
        }

        const servidores = await Servidor.findAll({
            where: {
                id: servidores_id,
            },
        });

        if (servidores.length !== servidores_id.length) {
            throw new Error("Um ou mais servidores não encontrados");
        }

        await SubcomissaoServidor.bulkCreate(
            servidores_id.map((servidor_id) => ({
                subcomissoes_avaliadoras_id: subcomissao_id,
                servidores_id: servidor_id,
            }))
        );

        return this.get(subcomissao_id);
    }

    async addAlvos(subcomissao_id: number, servidores_id: number[]) {
        const subcomissao = await Subcomissao.findByPk(subcomissao_id);
        if (!subcomissao) {
            throw new Error("Subcomissão não encontrada");
        }

        const servidores = await Servidor.findAll({
            where: {
                id: servidores_id,
            },
        });

        if (servidores.length !== servidores_id.length) {
            throw new Error("Um ou mais servidores não encontrados");
        }

        await SubcomissaoAlvo.bulkCreate(
            servidores_id.map((servidor_id) => ({
                subcomissoes_avaliadoras_id: subcomissao_id,
                servidores_id: servidor_id,
            }))
        );

        return this.get(subcomissao_id);
    }

    async getSubcomissaoAndParticipantesByServidor(servidor_id: number) {
        // Find the SubcomissaoAlvo for this servidor
        const subcomissaoAlvo = await SubcomissaoAlvo.findOne({ where: { servidores_id: servidor_id } });
        if (!subcomissaoAlvo) {
            throw new Error('Nenhuma subcomissão avaliando este servidor.');
        }
        // Get the subcomissao info
        const subcomissao = await Subcomissao.findByPk(subcomissaoAlvo.subcomissoes_avaliadoras_id);
        // Get all participants (servidores) of this subcomissao
        const subcomissaoServidores = await SubcomissaoServidor.findAll({ where: { subcomissoes_avaliadoras_id: subcomissaoAlvo.subcomissoes_avaliadoras_id } });
        const servidorIds = subcomissaoServidores.map(ss => ss.servidores_id);
        const participantes = await Servidor.findAll({
            where: { id: servidorIds },
            attributes: ['id', 'nome', 'matricula']
        });
        return {
            subcomissao,
            participantes
        };
    }

    private async validate({ subcomissao_id, nome, nivel, is_update, is_delete, is_get, servidor_id }: ValidateParams) {
        try {
            //Validação update
            if (is_update) {

                //Validações de campos obrigatórios
                if (!nome) {
                    throw new HttpError(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da subcomissão!')
                }
                if (!nivel) {
                    throw new HttpError(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da subcomissão!')
                }
                if (!subcomissao_id) {
                    throw new HttpError(400, 'Subcomissão não selecionada, selecione uma subcomissão para deletar a subcomissão!')
                }

                //Validação de nível válido
                if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                    throw new HttpError(400, 'Nivel inválido, selecione um nível válido!')
                }

                //Validação de existência da subcomissao
                const subcomissao: Subcomissao = await Subcomissao.findOne({ where: { id: subcomissao_id } })
                if (!subcomissao) {
                    throw new HttpError(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!')
                }

                //Validação de subcomissão já existente
                const nome_exist: Subcomissao = await Subcomissao.findOne({ where: { nome: nome, id: { [Op.ne]: subcomissao_id } } })
                if (nome_exist) {
                    throw new HttpError(400, 'Esse nome ja está em uso, crie uma subcomissão com um nome diferente das subcomissões já criadas!')
                }

            } else if (is_delete) {

                //Validações de campos obrigatórios
                if (!subcomissao_id) {
                    throw new HttpError(400, 'Subcomissão não selecionada, selecione uma subcomissão para deletar a subcomissão!')
                }

                //Validação de subcomissão existente
                const subcomissao: Subcomissao = await Subcomissao.findOne({ where: { id: subcomissao_id } })
                if (!subcomissao) {
                    throw new HttpError(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!')
                }

            } else if (is_get) {
                if (subcomissao_id) {
                    const subcomissao: Subcomissao = await Subcomissao.findOne({ where: { id: subcomissao_id } })
                    if (!subcomissao) {
                        throw new HttpError(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!')
                    }
                } else if (servidor_id) {

                    const servidor: Servidor = await Servidor.findOne({ where: { users_id: servidor_id } })
                    if (!servidor) {
                        throw new HttpError(404, 'Servidor não encontrado, selecione um servidor válido!')
                    }

                } else {
                    throw new HttpError(400, 'Selecione um servidor ou uma subcomissão para obter as informações!')
                }


            } else {
                //Validações de campos obrigatórios
                if (!nome) {
                    throw new HttpError(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da subcomissão!')
                }
                if (!nivel) {
                    throw new HttpError(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da subcomissão!')
                }

                //Validação de nível válido
                if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                    throw new HttpError(400, 'Nivel inválido, selecione um nível válido!')
                }

                //Validação de subcomissão já existente
                const nome_exist: Subcomissao = await Subcomissao.findOne({ where: { nome: nome } })
                if (nome_exist) {
                    throw new HttpError(400, 'Esse nome ja está em uso, crie uma subcomissão com um nome diferente das subcomissões já criadas!')
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

export default new SubcomissaoService