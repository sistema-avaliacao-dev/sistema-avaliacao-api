import HttpError from "../utils/HttpError";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import { Request, Response } from "express";
import SubcomissaoServidorService from "../services/SubcomissaoServidorService";
import SubcomissaoServidor from "../database/models/SubcomissaoServidor";


class SubcomissaoServidorController{
    async create(req: Request, res: Response){
        try {
            const subcomissao_id: number = req.body.subcomissao_id
            const servidor_id: number = req.body.servidor_id

            await SubcomissaoServidorService.create(subcomissao_id, servidor_id)

            ResponseHandler(res, 200, 'Servidor da subcomissão definido com sucesso!')
            
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
            const subcomissao_servidor_id: number = parseInt(req.query.subcomissao_servidor_id?.toString())

            await SubcomissaoServidorService.delete(subcomissao_servidor_id)

            ResponseHandler(res, 200, 'Servidor retirado da subcomissão com sucesso!')

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
            const subcomissao_servidor_id: number = parseInt(req.query.subcomissao_servidor_id?.toString())
            const subcomissao_id: number = parseInt(req.query.subcomissao_id?.toString())

            const subcomissao_servidor: SubcomissaoServidor | SubcomissaoServidor[] = await SubcomissaoServidorService.get(subcomissao_servidor_id, subcomissao_id)

            ResponseHandler(res, 200, 'Servidor da subcomissão encontrado', subcomissao_servidor)

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

export default new SubcomissaoServidorController