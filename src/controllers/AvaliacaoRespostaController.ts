import { Request, Response } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import HttpError from "../utils/HttpError";
import { respostasAvaliacao } from "../utils/types/respostasAvaliacao";
import AvaliacaoRespostaService from "../services/AvaliacaoRespostaService";
import AvaliacaoResposta from "../database/models/AvaliacaoResposta";

class AvaliacaoRespostaController {
    async create(req: Request, res: Response) {
        try {
            const avaliacao_id: number = parseInt(req.body.avaliacao_id)
            const tipo: string = req.body.tipo
            const respostas: respostasAvaliacao = req.body.respostas

            await AvaliacaoRespostaService.create(avaliacao_id, tipo, respostas)

            ResponseHandler(res, 200, 'Resposta de avaliação enviada')
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

    async get(req: Request, res: Response) {
        try {
            const avaliacao_id: number = parseInt(req.query.avaliacao_id?.toString())

            const respostas_avaliacao: AvaliacaoResposta[] = await AvaliacaoRespostaService.get(avaliacao_id)

            ResponseHandler(res, 200, "Avaliação recuperada!", respostas_avaliacao)

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
}

export default new AvaliacaoRespostaController()