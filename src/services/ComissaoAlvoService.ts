import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Comissao from "../database/models/Comissao";
import ComissaoAlvo from "../database/models/ComissaoAlvo";
import ComissaoServidor from "../database/models/ComissaoServidor";
import { ComissaoGet } from "../controllers/ComissaoController";
import Servidor from "../database/models/Servidor";


interface ValidateParams{
    comissao_alvo_id?: number,
    comissao_id?: number,
    comissoes_avaliadoras_id?: number,
    servidores_id?: number,
    is_delete?: boolean,
    is_get?: boolean
}

class ComissaoAlvoService{
    async create(comissoes_avaliadoras_id: number, servidores_id: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            await this.validate({comissoes_avaliadoras_id, servidores_id})

            await ComissaoAlvo.create({
                comissoes_avaliadoras_id: comissoes_avaliadoras_id,
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

    async delete(comissao_alvo_id: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            await this.validate({comissao_alvo_id, is_delete: true})

            //Deleção do alvo
            await ComissaoAlvo.destroy({where: {id: comissao_alvo_id}, transaction})
            
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

    async get(comissao_alvo_id?: number, comissao_id?: number){
        let transaction: Transaction;

        try{
            transaction = await sequelize.transaction();

            const comissao_alvo: ComissaoAlvo | ComissaoAlvo[] = await this.validate({comissao_alvo_id, comissao_id, is_get: true})
            
            // Se chegou aqui sem erros, confirma a transação
            await transaction.commit();

            return comissao_alvo

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


    private async validate({comissao_id, comissao_alvo_id, comissoes_avaliadoras_id, servidores_id, is_delete, is_get}: ValidateParams){
        try{
            
            if(is_delete || is_get){

                if(is_delete){
                    if(!comissao_alvo_id){
                        throw new HttpError(404, 'Selecione um servidor avaliado para tirar dessa subcomissão!')
                    }
                }else{
                    if(!comissao_alvo_id && !comissao_id){
                        throw new HttpError(404, 'Selecione um servidor avaliado ou uma subcomissão para visualizar as informações desejadas!')
                    }
                }

                if(comissao_alvo_id){
                
                    //Validação de subcomissão alvo existente
                    const comissao_alvo_exist: ComissaoAlvo = await ComissaoAlvo.findOne({where: {id: comissao_alvo_id}})
                    if(!comissao_alvo_exist){
                        throw new HttpError(404, 'Servidor avaliado não encontrado, selecione um servidor avaliado válido!')
                    }

                    return comissao_alvo_exist

                }else{
                    //Validação de subcomissão existente
                    const comissao_exist: Comissao = await Comissao.findOne({where: {id: comissao_id}})
                    if(!comissao_exist){
                        throw new HttpError(404, 'Subcomissão não encontrade, selecione uma subcomissão válida!')
                    }

                    const comissao_alvos: ComissaoAlvo[] = await ComissaoAlvo.findAll({where: {comissoes_avaliadoras_id: comissao_id}})

                    return comissao_alvos
                }

            }else{
                
                
                //Validações de campos obrigatórios
                if(!comissoes_avaliadoras_id){
                    throw new HttpError(400, 'Subcomissão não selecionada, selecione uma subcomissão para colocar um servidor para ser avaliado por ela!')
                }
                if(!servidores_id){
                    throw new HttpError(400, 'Servidor não selecionado, selecione um servidor para ser avaliado pela Comissao!')
                }

                
                //Validação de existência de subcomissão 
                const comissao_exists: Comissao = await Comissao.findOne({where: {id: comissoes_avaliadoras_id}})
                if(!comissao_exists){
                    throw new HttpError(404, 'Subcomissão não encontrada, selecione uma subcomissão válida!')
                }

                //Validação de existência de servidor 
                const servidor_exists: Servidor = await Servidor.findOne({where: {id: servidores_id}})
                if(!servidor_exists){
                    throw new HttpError(404, 'Servidor não encontrado, selecione um servidor válido!')
                }

                //Validação de alvo já definido
                const comissao_alvo_exists: ComissaoAlvo = await ComissaoAlvo.findOne({where: {comissoes_avaliadoras_id: comissoes_avaliadoras_id, servidores_id: servidores_id}})
                if(comissao_alvo_exists){
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

export default new ComissaoAlvoService