import { Transaction } from "sequelize";
import sequelize from "../database/db";
import HttpError from "../utils/HttpError";
import Cargo from "../database/models/Cargos";

interface ValidateParams {
    cargo_id?: number
}

export default new class CargoService {
    async get(cargo_id: number) {

        try {

            await this.validate({ cargo_id })

            let cargo

            if (cargo_id) {
                cargo = await Cargo.findOne({ where: { id: cargo_id } })
            } else {
                cargo = await Cargo.findAll()
            }

            return cargo

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }
    }

    private async validate({ cargo_id }: ValidateParams) {
        try {

            if (cargo_id) {
                const cargo_exists = await Cargo.findOne({ where: { id: cargo_id } })
                if (!cargo_exists) {
                    throw new HttpError(404, 'Cargo não encontrado')
                }
            }

        } catch (e) {
            if (e) {
                if (e instanceof HttpError) throw e;
                throw new HttpError(500, (e as Error).message);
            }
        }

    }
}