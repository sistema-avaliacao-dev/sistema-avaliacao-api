import { Request, Response } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import { Op, Transaction } from "sequelize";
import sequelize from "../database/db";
import Servidor, { ServidorAttributes } from "../database/models/Servidor";
import User from "../database/models/User";
import Cargo from "../database/models/Cargos"; // Importando o modelo de Cargos
import { randomCode } from "../utils/randomCode";
import passwordHash from "../utils/passwordHash";
import { parseCSV } from "../middlewares/fileRead";
import fs from "fs";
import HttpError from "../utils/HttpError";
import ServidorService from "../services/ServidorService";
import emailValidator from "email-validator"
import { normalizeString, findBestMatch } from "../utils/stringUtils";

class ServidorController {
    async create(req: Request, res: Response) {
        let transaction: Transaction | null = null;

        try {
            transaction = await sequelize.transaction();
            const file = req.file;

            if (!file) {
                ResponseHandler(res, 400, "Nenhum arquivo foi enviado");
                return;
            }

            const servidores = await parseCSV(res, file.path);

            // Buscar todos os servidores já cadastrados
            const allServidores = await Servidor.findAll();
            const servidoresMap = new Map(allServidores.map(s => [s.cpf, s]));
            const novosCPFs = new Set(servidores.map(s => s.cpf));

            // Tornar inativos os servidores que não estão na nova lista
            await Promise.all(allServidores.map(async servidor => {
                if (!novosCPFs.has(servidor.cpf)) {
                    await servidor.update({ is_active: false }, { transaction });
                }
            }));

            // Buscar todos os cargos existentes no banco e normalizar os nomes
            const allCargos = await Cargo.findAll({ attributes: ["id", "nome"] });
            const cargoMap = new Map(
                allCargos.map(cargo => [normalizeString(cargo.nome), cargo.id])
            );

            // Processar os servidores do CSV
            await Promise.all(servidores.map(async servidor => {
                const servidorExist = servidoresMap.get(servidor.cpf);

                // Normaliza o nome do cargo para comparação
                const normalizedCargo = normalizeString(servidor.cargo);
                let cargo_id = cargoMap.get(normalizedCargo);

                // Se não encontrar correspondência exata, tenta encontrar o mais próximo
                if (!cargo_id) {
                    const bestMatch = findBestMatch(normalizedCargo, Array.from(cargoMap.keys()), 5); // Permitir até 5 diferenças
                    if (bestMatch) {
                        cargo_id = cargoMap.get(bestMatch);
                    } else {
                        console.warn(`Cargo não encontrado: ${servidor.cargo} (Normalizado: ${normalizedCargo})`);
                    }
                }

                const servidor_data: ServidorAttributes = {
                    nome: servidor.nome,
                    cpf: servidor.cpf,
                    matricula: servidor.matricula,
                    grau_instrucao: servidor.grau_instrucao,
                    situacao_grau_instrucao: servidor.situacao_grau_instrucao,
                    cargo_id: cargo_id || null, // Garante que nenhum cargo_id seja indefinido
                    lotacao: servidor.lotacao,
                    data_admissao: servidor.data_admissao,
                    is_active: true
                };

                if (servidorExist) {
                    await servidorExist.update(servidor_data, { transaction });
                } else {
                    let user = await User.findOne({ where: { username: servidor.matricula } });

                    if (!user) {
                        const password_hash = await passwordHash(servidor.matricula);

                        user = await User.create({
                            username: servidor.matricula,
                            password_hash,
                            role: "servidor"
                        }, { transaction });
                    }

                    await Servidor.create({
                        users_id: user.id,
                        ...servidor_data
                    }, { transaction });
                }
            }));

            await transaction.commit();
            ResponseHandler(res, 200, "Servidores cadastrados e atualizados com sucesso!");

        } catch (e) {
            if (transaction) {
                await transaction.rollback();
            }
            console.error(e);
            ResponseHandler(res, 500, "Erro no servidor, contate o suporte!");
        } finally {
            if (req.file && req.file.path) fs.unlinkSync(req.file.path);
        }
    }

    async get(req: Request, res: Response){
        try{

            const servidor_id: number = parseInt(req.query.servidor_id?.toString())
            const user_id: number = parseInt(req.query.user_id?.toString())

            const servidor = await ServidorService.get(servidor_id, user_id)

            ResponseHandler(res, 200, 'Servidor encontrado', servidor)

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

    async setChefia(req: Request, res: Response) {
        try {
            const servidor_id: number = parseInt(req.query.servidor_id?.toString())
            const chefia_id: number = parseInt(req.query.chefia_id?.toString())

            await ServidorService.setChefia(servidor_id, chefia_id)

            ResponseHandler(res, 200, 'Chefia imediata atualizada')
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

    // async editEmail(req: Request, res: Response) {
    //     let transaction: Transaction | null = null;

    //     try {
    //         transaction = await sequelize.transaction();

    //         const servidor_id: number = req.body.servidor_id
    //         const email: string = req.body.email

    //         if (!servidor_id) {
    //             console.log("Servidor não enviado");
    //             ResponseHandler(res, 404, "Servidor não enviado, selecione um servidor para editar o email!");
    //             return
    //         }

    //         const servidor: Servidor = await Servidor.findOne({ where: { id: servidor_id } })
    //         if (!servidor) {
    //             console.log("Servidor não econtrado");
    //             ResponseHandler(res, 404, "Servidor não encontrado, selecione um servidor cadastrado!");
    //             return
    //         }

    //         const emailIsValid: boolean = emailValidator.validate(email)
    //         if (!emailIsValid) {
    //             console.log("Email inválido");
    //             ResponseHandler(res, 400, "Email inválido, informe um email válido!");
    //             return
    //         }

    //         const emailInUse: Servidor = await Servidor.findOne({ where: { email: email, id: { [Op.ne]: servidor.id } } })
    //         if (emailInUse) {
    //             console.log("Email em uso");
    //             ResponseHandler(res, 400, "O email informado ja está em uso por outro servidor!");
    //             return
    //         }

    //         await servidor.update({ email: email }, {transaction})

    //         await transaction.commit();
    //         ResponseHandler(res, 200, "Email editado!");

    //     } catch (e) {
    //         if (transaction) {
    //             await transaction.rollback();
    //         }
    //         if (e) {
    //             console.error(e);
    //             ResponseHandler(res, 500, "Erro no servidor, contate o suporte!");
    //         }
    //     }
    // }

    async getInferiores(req: Request, res: Response) {
        try {
            const servidor_id: number = parseInt(req.query.servidor_id?.toString())

            const inferiores = await ServidorService.getInferiores(servidor_id)

            ResponseHandler(res, 200, 'Inferiores encontrados', inferiores)
        } catch (e) {
            ResponseHandler(res, 500, (e as Error).message);
        }
    }
}

export default new ServidorController();
