import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface SubcomissaoServidorAttributes {
  id?: number
  subcomissoes_avaliadoras_id: number
  servidores_id: number
  createdAt: Date
  updatedAt: Date
}

interface SubcomissaoServidorCreationAttributes extends Optional<SubcomissaoServidorAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "subcomissoes_servidores",
  modelName: "SubcomissaoServidor",
  createdAt: true,
  updatedAt: true,
})
export default class SubcomissaoServidor extends Model<
  SubcomissaoServidorAttributes,
  SubcomissaoServidorCreationAttributes
> {

  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
        model: "subcomissoes_avaliadoras",
        key: "id"
    }
  })
  declare subcomissoes_avaliadoras_id: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
        model: "servidores",
        key: "id"
    }
  })
  declare servidores_id: number;
  
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