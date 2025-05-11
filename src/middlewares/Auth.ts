import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "./ResponseHandler";
import User from "../database/models/User";
import passwordCompare from "../utils/passwordCompare";
import jwt from "jsonwebtoken";
import { auth } from "../utils/auth";
import getTokenDecoded from "../utils/getTokenDecoded";

class Auth{
    async login(req: Request, res: Response){
        try{
            const username: string = req.body.username
            const password: string = req.body.password

            //Validação de campos obrigatórios
            if(!username){
                ResponseHandler(res, 400, "Username é um campo obrigatório, digite seu username!")
                return
            }
            if(!password){
                ResponseHandler(res, 400, "Senha é um campo obrigatório, digite sua senha!")
                return
            }

            //Validação de existência do usuário
            const user: User = await User.findOne({where: {username}})
            if(!user){
                ResponseHandler(res, 404, "Usuário não encontrado, digite um login válido!")
                return
            }

            //Validação de senha
            const passwordValid = await passwordCompare(password, user)
            if(!passwordValid){
                ResponseHandler(res, 401, "Senha inválida, digite uma senha válida ou recupere sua conta!")
                return
            }

            delete user.password_hash
            const token = jwt.sign(
                { ...user },
                auth.secret,
            );

            ResponseHandler(res, 200, 'Usuário autenticado', { token })
        }catch (e) {
            if (e) {
                console.log(e)
                ResponseHandler(res, 500, "Erro no servidor")
            }
        }
    }

    async checkToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                throw ResponseHandler(res, 401, 'Token não enviado, envie um token!!')
            }

            const decoded = await getTokenDecoded(token)
            if (!decoded) {
                throw ResponseHandler(res, 401, 'Token inválido, envie um token válido!!')
            }

            next()
        } catch (e) {
            if (e) {
                ResponseHandler(res, 401, "Token inválido, envie um token válido!!")
            }
        }
    }

    async isAdmin(req: Request, res: Response, next: NextFunction) {
        const decoded = await getTokenDecoded(req.headers.authorization?.replace('Bearer ', ''))
        if(decoded.dataValues.role !== 'admin'){
            ResponseHandler(res, 401, "Usuário não autorizado, você não tem permissão para acessar esta página!")
            return
        }
        next()
    }

    async isServidor(req: Request, res: Response, next: NextFunction) {
        const decoded = await getTokenDecoded(req.headers.authorization?.replace('Bearer ', ''))
        if(decoded.dataValues.role !== 'servidor'){
            ResponseHandler(res, 401, "Usuário não autorizado, você não tem permissão para acessar esta página!")
            return
        }
        next()
    }
}

export default new Auth()