import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Comissao from "../database/models/Comissao";
import ComissaoAlvo from "../database/models/ComissaoAlvo";
import ComissaoServidor from "../database/models/ComissaoServidor";
import { ComissaoGet } from "../controllers/ComissaoController";
import Servidor from "../database/models/Servidor";
import Cargo from "../database/models/Cargos";

interface ValidateParams {
    comissao_id?: number,
    nome?: string,
    nivel?: string,
    is_update?: boolean,
    is_delete?: boolean,
    is_get?: boolean,
    servidor_id?: number
}

class ComissaoService {
    async create(nome: string, nivel: string) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ nome, nivel })

            await Comissao.create({
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

    async update(comissao_id: number, nome: string, nivel: string) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ comissao_id, nome, nivel, is_update: true })

            await Comissao.update({
                nome: nome,
                nivel: nivel
            }, { where: { id: comissao_id }, transaction })

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

    async delete(comissao_id: number) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ comissao_id, is_delete: true })

            //Deleção das outras tabelas
            await ComissaoAlvo.destroy({ where: { comissoes_avaliadoras_id: comissao_id }, transaction })
            await ComissaoServidor.destroy({ where: { comissoes_avaliadoras_id: comissao_id }, transaction })

            //Deleção da Comissão
            await Comissao.destroy({ where: { id: comissao_id }, transaction })

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

    async get(comissao_id: number, servidor_id?: number) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            await this.validate({ comissao_id, servidor_id, is_get: true })

            let comissaoId = comissao_id
            const servidor: Servidor = await Servidor.findOne({ where: { users_id: servidor_id }, transaction })

            if (servidor_id) {
                const comissao_servidor = await ComissaoServidor.findOne({ where: { servidores_id: servidor.id }, transaction })
                if (comissao_servidor) {
                    comissaoId = comissao_servidor.comissoes_avaliadoras_id
                }
            }
            const comissao: Comissao = await Comissao.findOne({ where: { id: comissaoId }, transaction })
            const comissao_alvos: ComissaoAlvo[] = await ComissaoAlvo.findAll({ where: { comissoes_avaliadoras_id: comissaoId }, transaction })
            const comissao_servidores: ComissaoServidor[] = await ComissaoServidor.findAll({ where: { comissoes_avaliadoras_id: comissaoId }, transaction })

            const comissao_get: ComissaoGet = {
                comissao,
                comissao_alvos: [...comissao_alvos],
                comissao_servidores: [...comissao_servidores]
            }

            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

            return comissao_get

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
            const comissoes: Comissao[] = await Comissao.findAll()
            return comissoes
        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    private async validate({ comissao_id, nome, nivel, is_update, is_delete, is_get, servidor_id }: ValidateParams) {
        try {
            //Validação update
            if (is_update) {

                //Validações de campos obrigatórios
                if (!nome) {
                    throw new HttpError(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da Comissão!')
                }
                if (!nivel) {
                    throw new HttpError(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da Comissão!')
                }
                if (!comissao_id) {
                    throw new HttpError(400, 'Comissão não selecionada, selecione uma Comissão para deletar a Comissão!')
                }

                //Validação de nível válido
                if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                    throw new HttpError(400, 'Nivel inválido, selecione um nível válido!')
                }

                //Validação de existência da Comissao
                const comissao: Comissao = await Comissao.findOne({ where: { id: comissao_id } })
                if (!comissao) {
                    throw new HttpError(404, 'Comissão não encontrada, selecione uma Comissão válida!')
                }

                //Validação de Comissão já existente
                const nome_exist: Comissao = await Comissao.findOne({ where: { nome: nome, id: { [Op.ne]: comissao_id } } })
                if (nome_exist) {
                    throw new HttpError(400, 'Esse nome ja está em uso, crie uma Comissão com um nome diferente das subcomissões já criadas!')
                }

            } else if (is_delete) {

                //Validações de campos obrigatórios
                if (!comissao_id) {
                    throw new HttpError(400, 'Comissão não selecionada, selecione uma Comissão para deletar a Comissão!')
                }

                //Validação de Comissão existente
                const comissao: Comissao = await Comissao.findOne({ where: { id: comissao_id } })
                if (!comissao) {
                    throw new HttpError(404, 'Comissão não encontrada, selecione uma Comissão válida!')
                }

            } else if (is_get) {
                if (comissao_id) {
                    const comissao: Comissao = await Comissao.findOne({ where: { id: comissao_id } })
                    if (!comissao) {
                        throw new HttpError(404, 'Comissão não encontrada, selecione uma Comissão válida!')
                    }
                } else if (servidor_id) {
                    const servidor: Servidor = await Servidor.findOne({ where: { users_id: servidor_id } })
                    if (!servidor) {
                        throw new HttpError(404, 'Servidor não encontrado, selecione um servidor válido!')
                    }
                } else {
                    throw new HttpError(400, 'Selecione uma Comissão ou um Servidor para obter as informações!')
                }
            } else {
                //Validações de campos obrigatórios
                if (!nome) {
                    throw new HttpError(400, 'Nome é um campo obrigatório e não foi enviado, envie o nome da Comissão!')
                }
                if (!nivel) {
                    throw new HttpError(400, 'Nivel é um campo obrigatório e não foi selecionado, selecione o nivel da Comissão!')
                }

                //Validação de nível válido
                if (nivel != 'fundamental' && nivel != 'medio' && nivel != 'superior') {
                    throw new HttpError(400, 'Nivel inválido, selecione um nível válido!')
                }

                //Validação de Comissão já existente
                const nome_exist: Comissao = await Comissao.findOne({ where: { nome: nome } })
                if (nome_exist) {
                    throw new HttpError(400, 'Esse nome ja está em uso, crie uma Comissão com um nome diferente das subcomissões já criadas!')
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

export default new ComissaoService