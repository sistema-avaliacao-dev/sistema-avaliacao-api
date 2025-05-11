import { Request, Response } from "express";
import { ResponseHandler } from "../middlewares/ResponseHandler";
import HttpError from "../utils/HttpError";
import Cargo from "../database/models/Cargos";
import CargoService from "../services/CargoService";


export default new class CargoController {
    async get(req: Request, res: Response) {
        try {
            const cargo_id: number = parseInt(req.query.cargo_id?.toString())

            const cargo = await CargoService.get(cargo_id)


            ResponseHandler(res, 200, 'Cargo encontrado', cargo)

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