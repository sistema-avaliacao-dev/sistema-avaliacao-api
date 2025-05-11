import HttpError from "../utils/HttpError";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import { Request, Response } from "express";
import SubcomissaoAlvo from "../database/models/SubcomissaoAlvo";
import SubcomissaoAlvoService from "../services/SubcomissaoAlvoService";

class SubcomissaoAlvoController{
    async create(req: Request, res: Response){
        try {
            const subcomissoes_avaliadoras_id: number = req.body.subcomissoes_avaliadoras_id
            const servidores_id: number = req.body.servidores_id

            await SubcomissaoAlvoService.create(subcomissoes_avaliadoras_id, servidores_id)

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
            const subcomissao_alvo_id: number = parseInt(req.query.subcomissao_alvo_id?.toString())

            await SubcomissaoAlvoService.delete(subcomissao_alvo_id)

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
            const subcomissao_alvo_id: number = parseInt(req.query.subcomissao_alvo_id?.toString())
            const subcomissao_id: number = parseInt(req.query.subcomissao_id?.toString())

            const subcomissao_alvo: SubcomissaoAlvo | SubcomissaoAlvo[] = await SubcomissaoAlvoService.get(subcomissao_alvo_id, subcomissao_id)

            ResponseHandler(res, 200, 'Servidor avaliado encontrado', subcomissao_alvo)

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

export default new SubcomissaoAlvoController