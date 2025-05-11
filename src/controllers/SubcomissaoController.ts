import { Request, Response } from "express";
import SubcomissaoService from "../services/SubcomissaoService";
import HttpError from "../utils/HttpError";
import { ResponseHandler } from "../middlewares/ResponseHandler";

export interface SubcomissaoGet {
    subcomissao: any,
    subcomissao_alvos: any[],
    subcomissao_servidores: any[]
}

class SubcomissaoController {
    async create(req: Request, res: Response) {
        try {
            const { nome, nivel } = req.body

            await SubcomissaoService.create(nome, nivel)

            res.status(201).json({ message: 'Subcomissão criada com sucesso!' })
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
            const { subcomissao_id, nome, nivel } = req.body

            await SubcomissaoService.update(subcomissao_id, nome, nivel)

            res.status(200).json({ message: 'Subcomissão atualizada com sucesso!' })
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
            const subcomissao_id = parseInt(req.query.subcomissao_id?.toString() || '0')

            await SubcomissaoService.delete(subcomissao_id)

            res.status(200).json({ message: 'Subcomissão deletada com sucesso!' })
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
            const subcomissao_id = parseInt(req.query.subcomissao_id?.toString() || '0')
            const servidor_id = parseInt(req.query.servidor_id?.toString() || '0')

            const subcomissao: SubcomissaoGet = await SubcomissaoService.get(subcomissao_id, servidor_id)

            res.status(200).json({ data: subcomissao })
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
            const subcomissoes = await SubcomissaoService.getAll()

            res.status(200).json({ data: subcomissoes })
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

    static async addServidores(req: Request, res: Response) {
        try {
            const { subcomissoes_avaliadoras_id, servidores_id } = req.body;
            const subcomissao = await SubcomissaoService.addServidores(
                Number(subcomissoes_avaliadoras_id),
                servidores_id
            );
            res.json({ data: subcomissao });
        } catch (e) {
            if (e instanceof HttpError) {
                res.status(e.statusCode).json({ message: e.message });
            } else {
                res.status(500).json({ message: (e as Error).message });
        }
    }
    }

    static async addAlvos(req: Request, res: Response) {
        try {
            const { subcomissoes_avaliadoras_id, servidores_id } = req.body;
            const subcomissao = await SubcomissaoService.addAlvos(
                Number(subcomissoes_avaliadoras_id),
                servidores_id
            );
            res.json({ data: subcomissao });
        } catch (e) {
            if (e instanceof HttpError) {
                res.status(e.statusCode).json({ message: e.message });
            } else {
                res.status(500).json({ message: (e as Error).message });
            }
        }
    }

    async getSubcomissaoParticipantesByServidor(req: Request, res: Response) {
        try {
            const servidor_id = parseInt(req.query.servidor_id as string);
            if (!servidor_id) {
                return ResponseHandler(res, 400, 'servidor_id é obrigatório');
            }
            const result = await SubcomissaoService.getSubcomissaoAndParticipantesByServidor(servidor_id);
            ResponseHandler(res, 200, 'Participantes da subcomissão recuperados!', result);
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

export default new SubcomissaoController