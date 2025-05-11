import { Request, Response } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import User, { UserAttributes } from "../database/models/User";
import passwordHash from "../utils/passwordHash";
import { Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import getTokenDecoded from "../utils/getTokenDecoded";

class UserController {
    async create(req: Request, res: Response) {
        let transaction: Transaction; // colocar tipagem

        try {
            transaction = await sequelize.transaction();

            const username: string = req.body.username
            const password: string = req.body.password
            const role: string = req.body.role

            //Validação de campos obrigatórios
            if (!password) {
                ResponseHandler(res, 400, "Senha é um campo obrigatório, digite sua senha!")
                return
            }
            if (!username) {
                ResponseHandler(res, 400, "Username é um campo obrigatório, digite seu username!")
                return
            }
            if (!role) {
                ResponseHandler(res, 400, "Role é um campo obrigatório, digite uma role!")
                return
            }

            //Validação de pré-existência de usuário com o mesmo username
            const usernameExists = await User.findOne({ where: { username } })
            if (usernameExists) {
                ResponseHandler(res, 400, "Esse username já está em uso, digite outro!")
                return
            }

            //Criação de usuário
            const password_hash = await passwordHash(password)
            const user: UserAttributes = {
                username,
                password_hash,
                role
            }
            await User.create({ ...user }, { transaction })

            ResponseHandler(res, 200, "Usuário criado, faça seu login!!")
        } catch (e) {
            // Reverte qualquer INSERT/UPDATE já feito
            if (transaction) {
                await transaction.rollback();
            }

            if (e) {
                console.log(e)
                ResponseHandler(res, 500, "Erro no servidor")
            }
        }
    }

    async getUser(req: Request, res: Response) {
        try {

            const token = req.headers.authorization?.replace('Bearer ', '');
            const decoded = await getTokenDecoded(token)

            const user = {
                id: decoded.dataValues.id,
                role: decoded.dataValues.role
            }

            ResponseHandler(res, 200, 'Usuário encontrado', user)

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

export default new UserController()