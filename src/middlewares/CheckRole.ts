import { NextFunction, Request, Response } from "express";
import { decodedType } from "../utils/types/decodedType";
import getTokenDecoded from "../utils/getTokenDecoded";
import { ResponseHandler } from "./ResponseHandler";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const decoded: decodedType = await getTokenDecoded(token)
            let authorized = false

            roles.map(role => {
                if (decoded.role == role) {
                    authorized = true
                }
            })

            if (authorized) {
                next()
            }

            ResponseHandler(res, 401, 'Usuário não autorizado')
            return
        } catch (e) {
            console.log(e);
            ResponseHandler(res, 500, 'Erro no servidor')
        }
    }
}