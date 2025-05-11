import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Subcomissao from "../database/models/Subcomissao";
import SubcomissaoAlvo from "../database/models/SubcomissaoAlvo";
import SubcomissaoServidor from "../database/models/SubcomissaoServidor";
import { SubcomissaoGet } from "../controllers/SubcomissaoController";
import Servidor from "../database/models/Servidor";


interface ValidateParams{
    subcomissao_alvo_id?: number,
    subcomissao_id?: number,
    subcomissoes_avaliadoras_id?: number,
    servidores_id?: number,
    is_delete?: boolean,
    is_get?: boolean
}

class SubcomissaoAlvoService{
    async create(subcomissoes_avaliadoras_id: number, servidores_id: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            await this.validate({subcomissoes_avaliadoras_id, servidores_id})

            await SubcomissaoAlvo.create({
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

    async delete(subcomissao_alvo_id: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            await this.validate({subcomissao_alvo_id, is_delete: true})

            //Deleção do alvo
            await SubcomissaoAlvo.destroy({where: {id: subcomissao_alvo_id}, transaction})
            
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

    async get(subcomissao_alvo_id?: number, subcomissao_id?: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            const subcomissao_alvo: SubcomissaoAlvo | SubcomissaoAlvo[] = await this.validate({subcomissao_alvo_id, subcomissao_id, is_get: true})
            
            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

            return subcomissao_alvo

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


    private async validate({subcomissao_id, subcomissao_alvo_id, subcomissoes_avaliadoras_id, servidores_id, is_delete, is_get}: ValidateParams){
        try{
            
            if(is_delete || is_get){

                if(is_delete){
                    if(!subcomissao_alvo_id){
                        throw new HttpError(404, 'Selecione um servidor avaliado para tirar dessa subcomissão!')
                    }
                }else{
                    if(!subcomissao_alvo_id && !subcomissao_id){
                        throw new HttpError(404, 'Selecione um servidor avaliado ou uma subcomissão para visualizar as informações desejadas!')
                    }
                }

                if(subcomissao_alvo_id){
                
                    //Validação de subcomissão alvo existente
                    const subcomissao_alvo_exist: SubcomissaoAlvo = await SubcomissaoAlvo.findOne({where: {id: subcomissao_alvo_id}})
                    if(!subcomissao_alvo_exist){
                        throw new HttpError(404, 'Servidor avaliado não encontrado, selecione um servidor avaliado válido!')
                    }

                    return subcomissao_alvo_exist

                }else{
                    //Validação de subcomissão existente
                    const subcomissao_exist: Subcomissao = await Subcomissao.findOne({where: {id: subcomissao_id}})
                    if(!subcomissao_exist){
                        throw new HttpError(404, 'Subcomissão não encontrade, selecione uma subcomissão válida!')
                    }

                    const subcomissao_alvos: SubcomissaoAlvo[] = await SubcomissaoAlvo.findAll({where: {subcomissoes_avaliadoras_id: subcomissao_id}})

                    return subcomissao_alvos
                }

            }else{
                
                
                //Validações de campos obrigatórios
                if(!subcomissoes_avaliadoras_id){
                    throw new HttpError(400, 'Subcomissão não selecionada, selecione uma subcomissão para colocar um servidor para ser avaliado por ela!')
                }
                if(!servidores_id){
                    throw new HttpError(400, 'Servidor não selecionado, selecione um servidor para ser avaliado pela subcomissao!')
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
                const subcomissao_alvo_exists: SubcomissaoAlvo = await SubcomissaoAlvo.findOne({where: {subcomissoes_avaliadoras_id: subcomissoes_avaliadoras_id, servidores_id: servidores_id}})
                if(subcomissao_alvo_exists){
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

export default new SubcomissaoAlvoService