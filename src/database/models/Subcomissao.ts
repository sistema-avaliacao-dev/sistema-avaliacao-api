import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface SubcomissaoAttributes {
  id?: number
  nome: string
  nivel: string
  createdAt: Date
  updatedAt: Date
}

interface SubcomissaoCreationAttributes extends Optional<SubcomissaoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "subcomissoes_avaliadoras",
  modelName: "Subcomissao",
  createdAt: true,
  updatedAt: true,
})
export default class Subcomissao extends Model<
  SubcomissaoAttributes,
  SubcomissaoCreationAttributes
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
    allowNull: false,
    values: ['fundamental', 'medio', 'superior']
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