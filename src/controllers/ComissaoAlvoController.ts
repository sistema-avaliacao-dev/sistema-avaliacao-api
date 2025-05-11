import HttpError from "../utils/HttpError";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import { Request, Response } from "express";
import ComissaoAlvo from "../database/models/ComissaoAlvo";
import ComissaoAlvoService from "../services/ComissaoAlvoService";

class ComissaoAlvoController{
    async create(req: Request, res: Response){
        try {
            const comissoes_avaliadoras_id: number = req.body.comissoes_avaliadoras_id
            const servidores_id: number = req.body.servidores_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            await ComissaoAlvoService.create(comissoes_avaliadoras_id, servidores_id)

            ResponseHandler(res, 200, 'Servidor avaliado definido com sucesso!')
            
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

    async delete(req: Request, res: Response){
        try{
            const comissao_alvo_id: number = parseInt(req.query.comissao_alvo_id?.toString())

            await ComissaoAlvoService.delete(comissao_alvo_id)

            ResponseHandler(res, 200, 'Servidor avaliado deletado com sucesso!')

        }catch(e){
            if (e instanceof HttpError) {
                console.log(e)
                ResponseHandler(res, e.statusCode, e.message);
                return;
            }
            console.log(e)
            ResponseHandler(res, 500, (e as Error).message);
        }
    }

    async get(req: Request, res: Response){
        try{
            const comissao_alvo_id: number = parseInt(req.query.comissao_alvo_id?.toString())
            const comissao_id: number = parseInt(req.query.comissao_id?.toString())

            const comissao_alvo: ComissaoAlvo | ComissaoAlvo[] = await ComissaoAlvoService.get(comissao_alvo_id, comissao_id)

            ResponseHandler(res, 200, 'Servidor avaliado encontrado', comissao_alvo)

        }catch(e){
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

export default new ComissaoAlvoController