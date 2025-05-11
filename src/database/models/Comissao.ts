import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface ComissaoAttributes {
  id?: number
  nome: string
  nivel: string
  createdAt: Date
  updatedAt: Date
}

interface ComissaoCreationAttributes extends Optional<ComissaoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "comissoes_avaliadoras",
  modelName: "Comissao",
  createdAt: true,
  updatedAt: true,
})
export default class Comissao extends Model<
  ComissaoAttributes,
  ComissaoCreationAttributes
> {

  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false
  })
  declare id: number;
  
  @Column({
    type: DataType.STRING(150),
    allowNull: false
  })
  declare nome: string;
  
  @Column({
    type: DataType.STRING(150),
    allowNull: false
  })
  declare nivel: string;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare createdAt: Date;

  
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare updatedAt: Date;
}