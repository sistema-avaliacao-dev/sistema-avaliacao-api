import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Subcomissao from "../database/models/Subcomissao";
import SubcomissaoServidor from "../database/models/SubcomissaoServidor";
import Servidor from "../database/models/Servidor";


interface ValidateParams{
    subcomissao_servidor_id?: number,
    subcomissao_id?: number,
    subcomissoes_avaliadoras_id?: number,
    servidores_id?: number,
    is_delete?: boolean,
    is_get?: boolean
}

class SubcomissaoServidorService{
    async create(subcomissoes_avaliadoras_id: number, servidores_id: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            await this.validate({subcomissoes_avaliadoras_id, servidores_id})

            await SubcomissaoServidor.create({
                subcomissoes_avaliadoras_id: subcomissoes_avaliadoras_id,
                servidores_id: servidores_id
            }, {transaction})
            
            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

        }catch(e){
            if (transaction) {
                await transaction.rollback();
            }
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            } 
        }
    }

    async delete(subcomissao_servidor_id: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            await this.validate({subcomissao_servidor_id, is_delete: true})

            //Deleção do alvo
            await SubcomissaoServidor.destroy({where: {id: subcomissao_servidor_id}, transaction})
            
            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

        }catch(e){
            if (transaction) {
                await transaction.rollback();
            }
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            } 
        }
    }

    async get(subcomissao_servidor_id?: number, subcomissao_id?: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            const subcomissao_servidor: SubcomissaoServidor | SubcomissaoServidor[] = await this.validate({subcomissao_servidor_id, subcomissao_id, is_get: true})
            
            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

            return subcomissao_servidor

        }catch(e){
            if (transaction) {
                await transaction.rollback();
            }
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            } 
        }
    }


    private async validate({subcomissao_id, subcomissao_servidor_id, subcomissoes_avaliadoras_id, servidores_id, is_delete, is_get}: ValidateParams){
        try{
            
            if(is_delete || is_get){

                if(is_delete){
                    if(!subcomissao_servidor_id){
                        throw new HttpError(404, 'Selecione um servidor para retirar dessa subcomissão!')
                    }
                }else{
                    if(!subcomissao_servidor_id && !subcomissao_id){
                        throw new HttpError(404, 'Selecione um servidor ou uma subcomissão para visualizar as informações desejadas!')
                    }
                }

                if(subcomissao_servidor_id){
                
                    //Validação de subcomissão alvo existente
                    const subcomissao_servidor_exist: SubcomissaoServidor = await SubcomissaoServidor.findOne({where: {id: subcomissao_servidor_id}})
                    if(!subcomissao_servidor_exist){
                        throw new HttpError(404, 'Servidor não encontrado, selecione um servidor válido!')
                    }

                    return subcomissao_servidor_exist

                }else{
                    //Validação de subcomissão existente
                    const subcomissao_exist: Subcomissao = await Subcomissao.findOne({where: {id: subcomissao_id}})
                    if(!subcomissao_exist){
                        throw new HttpError(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!')
                    }

                    const subcomissao_servidors: SubcomissaoServidor[] = await SubcomissaoServidor.findAll({where: {subcomissoes_avaliadoras_id: subcomissao_id}})

                    return subcomissao_servidors
                }

            }else{
                
                
                //Validações de campos obrigatórios
                if(!subcomissoes_avaliadoras_id){
                    throw new HttpError(400, 'Subcomissão não selecionada, selecione uma subcomissão para colocar um servidor nela!')
                }
                if(!servidores_id){
                    throw new HttpError(400, 'Servidor não selecionado, selecione um servidor para colocar na subcomissao!')
                }

                
                //Validação de existência de subcomissão 
                const subcomissao_exists: Subcomissao = await Subcomissao.findOne({where: {id: subcomissoes_avaliadoras_id}})
                if(!subcomissao_exists){
                    throw new HttpError(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!')
                }

                //Validação de existência de servidor 
                const servidor_exists: Servidor = await Servidor.findOne({where: {id: servidores_id}})
                if(!servidor_exists){
                    throw new HttpError(404, 'Servidor não encontrado, selecione um servidor válido!')
                }

                //Validação de alvo já definido
                const subcomissao_servidor_exists: SubcomissaoServidor = await SubcomissaoServidor.findOne({where: {subcomissoes_avaliadoras_id: subcomissoes_avaliadoras_id, servidores_id: servidores_id}})
                if(subcomissao_servidor_exists){
                    throw new HttpError(400, 'Servidor já está sendo avaliado por essa subcomissão, selecione uma subcomissão ou um servidor diferente!')
                }
            }


        }catch(e){
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }
}

export default new SubcomissaoServidorService