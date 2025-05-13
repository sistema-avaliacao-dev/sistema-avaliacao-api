import { Request, Response } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import User, { UserAttributes } from "../database/models/User";
import passwordHash from "../utils/passwordHash";
import passwordCompare from "../utils/passwordCompare";
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

    async updatePassword(req: Request, res: Response) {
        let transaction: Transaction;

        try {
            transaction = await sequelize.transaction();

            const { currentPassword, newPassword } = req.body;
            const token = req.headers.authorization?.replace('Bearer ', '');
            const decoded = await getTokenDecoded(token);

            // Validação de campos obrigatórios
            if (!currentPassword) {
                ResponseHandler(res, 400, "Senha atual é obrigatória");
                return;
            }
            if (!newPassword) {
                ResponseHandler(res, 400, "Nova senha é obrigatória");
                return;
            }

            // Buscar usuário
            const user = await User.findOne({ where: { id: decoded.dataValues.id } });
            if (!user) {
                ResponseHandler(res, 404, "Usuário não encontrado");
                return;
            }

            // Validar senha atual
            const passwordValid = await passwordCompare(currentPassword, user);
            if (!passwordValid) {
                ResponseHandler(res, 401, "Senha atual incorreta");
                return;
            }

            // Validar se a nova senha é diferente da atual
            const isSamePassword = await passwordCompare(newPassword, user);
            if (isSamePassword) {
                ResponseHandler(res, 400, "A nova senha deve ser diferente da senha atual");
                return;
            }

            // Atualizar senha
            const password_hash = await passwordHash(newPassword);
            await user.update({ password_hash }, { transaction });

            await transaction.commit();
            ResponseHandler(res, 200, "Senha atualizada com sucesso");
        } catch (e) {
            if (transaction) {
                await transaction.rollback();
            }

            if (e instanceof HttpError) {
                console.log(e);
                ResponseHandler(res, e.statusCode, e.message);
                return;
            }
            console.log(e);
            ResponseHandler(res, 500, "Erro ao atualizar senha");
        }
    }
}

export default new UserController()