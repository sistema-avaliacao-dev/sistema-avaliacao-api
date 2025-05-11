import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface CargoAttributes {
  id?: number
  nome: string
  nivel: string
}

interface CargoCreationAttributes extends Optional<CargoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "cargos",
  modelName: "Cargo",
  createdAt: false,
  updatedAt: false,
})
export default class Cargo extends Model<
  CargoAttributes,
  CargoCreationAttributes
> {

  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nome: string;
  
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nivel: string;
}