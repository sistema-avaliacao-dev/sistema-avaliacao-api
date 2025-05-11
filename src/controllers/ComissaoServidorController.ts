import HttpError from "../utils/HttpError";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import { Request, Response } from "express";
import ComissaoServidorService from "../services/ComissaoServidorService";
import ComissaoServidor from "../database/models/ComissaoServidor";


class ComissaoServidorController{
    async create(req: Request, res: Response){
        try {
            const comissao_id: number = req.body.comissao_id
            const servidor_id: number = req.body.servidor_id

            await ComissaoServidorService.create(comissao_id, servidor_id)

            ResponseHandler(res, 200, 'Servidor da comissão definido com sucesso!')
            
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
            const comissao_servidor_id: number = parseInt(req.query.comissao_servidor_id?.toString())

            await ComissaoServidorService.delete(comissao_servidor_id)

            ResponseHandler(res, 200, 'Servidor retirado da comissão com sucesso!')

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
            const comissao_servidor_id: number = parseInt(req.query.comissao_servidor_id?.toString())
            const comissao_id: number = parseInt(req.query.comissao_id?.toString())

            const comissao_servidor: ComissaoServidor | ComissaoServidor[] = await ComissaoServidorService.get(comissao_servidor_id, comissao_id)

            ResponseHandler(res, 200, 'Servidor da comissao encontrado', comissao_servidor)

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

export default new ComissaoServidorController