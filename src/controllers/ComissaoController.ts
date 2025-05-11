import { Request, Response } from "express";
import ComissaoService from "../services/ComissaoService";
import HttpError from "../utils/HttpError";

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
}

export default new ComissaoController