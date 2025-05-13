import { Request, Response } from "express";
import ComissaoService from "../services/ComissaoService";
import HttpError from "../utils/HttpError";
import { ResponseHandler } from "../middlewares/ResponseHandler";

export interface ComissaoGet {
    comissao: any,
    comissao_alvos: any[],
    comissao_servidores: any[]
}

class ComissaoController {
    async create(req: Request, res: Response) {
        try {
            const { nome, nivel } = req.body

            await ComissaoService.create(nome, nivel)

            res.status(201).json({ message: 'Comissão criada com sucesso!' })
        } catch (e) {
            if (e) {
            if (e instanceof HttpError) {
                    res.status(e.statusCode).json({ message: e.message })
                } else {
                    res.status(500).json({ message: (e as Error).message })
                }
            }
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { comissao_id, nome, nivel } = req.body

            await ComissaoService.update(comissao_id, nome, nivel)

            res.status(200).json({ message: 'Comissão atualizada com sucesso!' })
        } catch (e) {
            if (e) {
            if (e instanceof HttpError) {
                    res.status(e.statusCode).json({ message: e.message })
                } else {
                    res.status(500).json({ message: (e as Error).message })
                }
            }
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const comissao_id = parseInt(req.query.comissao_id?.toString() || '0')

            await ComissaoService.delete(comissao_id)

            res.status(200).json({ message: 'Comissão deletada com sucesso!' })
        } catch (e) {
            if (e) {
            if (e instanceof HttpError) {
                    res.status(e.statusCode).json({ message: e.message })
                } else {
                    res.status(500).json({ message: (e as Error).message })
                }
            }
        }
    }

    async get(req: Request, res: Response) {
        try {
            const comissao_id = parseInt(req.query.comissao_id?.toString() || '0')
            const servidor_id = parseInt(req.query.servidor_id?.toString() || '0')

            const comissao: ComissaoGet = await ComissaoService.get(comissao_id, servidor_id)

            res.status(200).json({ data: comissao })
        } catch (e) {
            if (e) {
            if (e instanceof HttpError) {
                    res.status(e.statusCode).json({ message: e.message })
                } else {
                    res.status(500).json({ message: (e as Error).message })
                }
            }
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const comissoes = await ComissaoService.getAll()

            res.status(200).json({ data: comissoes })
        } catch (e) {
            if (e) {
            if (e instanceof HttpError) {
                    res.status(e.statusCode).json({ message: e.message })
                } else {
                    res.status(500).json({ message: (e as Error).message })
                }
            }
        }
    }

    async getComissaoParticipantesByServidor(req: Request, res: Response) {
        try {
            const servidor_id = parseInt(req.query.servidor_id as string);
            if (!servidor_id) {
                return ResponseHandler(res, 400, 'servidor_id é obrigatório');
            }
            const result = await ComissaoService.getComissaoAndParticipantesByServidor(servidor_id);
            ResponseHandler(res, 200, 'Participantes da comissão recuperados!', result);
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

export default new ComissaoController