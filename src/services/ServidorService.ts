import { Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Servidor from "../database/models/Servidor";
import Cargo from "../database/models/Cargos";
import User from "../database/models/User";

interface ValidateParams {
    servidor_id: number,
    chefia_id?: number,
    is_get?: boolean,
    is_get_inferiores?: boolean,
    user_id?: number
}

class ServidorService {
    async setChefia(servidor_id: number, chefia_id: number) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            //Validações
            await this.validate({ servidor_id, chefia_id })

            const servidor: Servidor = await Servidor.findOne({ where: { id: servidor_id } })
            const chefia: Servidor = await Servidor.findOne({ where: { id: chefia_id } })

            await servidor.update({ chefia_imediata_servidores_id: chefia.id }, { transaction })

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

    async get(servidor_id: number, user_id?: number) {
        try {
            this.validate({ servidor_id, user_id, is_get: true })

            let servidor: Servidor | Servidor[]
            if (user_id) {
                servidor = await Servidor.findOne({
                    where: { users_id: user_id },
                    include: [
                        {
                            model: Cargo,
                            as: 'cargo',
                            attributes: ['id', 'nome']
                        }
                    ]
                })
            } else if (servidor_id) {
                servidor = await Servidor.findOne({
                    where: { id: servidor_id },
                    include: [
                        {
                            model: Cargo,
                            as: 'cargo',
                            attributes: ['id', 'nome']
                        },
                        {
                            model: Servidor,
                            as: 'chefia_imediata',
                            attributes: ['id', 'nome']
                        }
                    ]
                })
            } else {
                servidor = await Servidor.findAll({
                    include: [
                        {
                            model: Cargo,
                            as: 'cargo',
                            attributes: ['id', 'nome']
                        },
                        {
                            model: Servidor,
                            as: 'chefia_imediata',
                            attributes: ['id', 'nome']
                        }
                    ]
                })
            }

            return servidor

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    async getInferiores(servidor_id: number) {
        try {
            await this.validate({ servidor_id, is_get_inferiores: true })

            const servidor: Servidor = await Servidor.findOne({ where: { users_id: servidor_id } })

            const inferiores = await Servidor.findAll({
                where: {
                    chefia_imediata_servidores_id: servidor.id
                }, include: [
                    {
                        model: Cargo,
                        as: 'cargo',
                        attributes: ['id', 'nome']
                    }
                ]
            })

            return inferiores
        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    private async validate({ servidor_id, chefia_id, is_get, is_get_inferiores, user_id }: ValidateParams) {
        try {
            if (is_get_inferiores) {
                if (!servidor_id) {
                    throw new HttpError(400, 'Servidor não selecionado, selecione o servidor!')
                }
                const servidor: Servidor = await Servidor.findOne({ where: { users_id: servidor_id } })
                if (!servidor) {
                    throw new HttpError(404, 'Servidor não encontrado, slecione um servidor válido!')
                }
            } else {

                if (user_id) {
                    const user: User = await User.findOne({ where: { id: user_id } })
                    if (!user) {
                        throw new HttpError(404, 'Usuário não encontrado, slecione um usuário válido!')
                    }
                } else {

                    //Validações de campos obrigatórios
                    if (!servidor_id && !is_get) {
                        throw new HttpError(400, 'Servidor não selecionado, selecione o servidor!')
                    }
                    if (servidor_id) {
                        const servidor: Servidor = await Servidor.findOne({ where: { id: servidor_id } })
                        if (!servidor && !servidor_id) {
                            throw new HttpError(404, 'Servidor não encontrado, slecione um servidor válido!')
                        }
                    }

                    if (!is_get) {
                        if (!chefia_id) {
                            throw new HttpError(400, 'Chefia imediata não selecionada, selecione a chefia imediata!')
                        }
                        const chefia: Servidor = await Servidor.findOne({ where: { id: chefia_id } })
                        if (!chefia) {
                            throw new HttpError(404, 'Chefia não encontrada, slecione um servidor válido!')
                        }

                    }
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

export default new ServidorService