import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo
} from "sequelize-typescript";
import Servidor from "./Servidor";

export interface ComissaoServidorAttributes {
  id?: number
  comissoes_avaliadoras_id: number
  servidores_id: number
  createdAt: Date
  updatedAt: Date
}

interface ComissaoServidorCreationAttributes extends Optional<ComissaoServidorAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "comissoes_servidores",
  modelName: "ComissaoServidor",
  createdAt: true,
  updatedAt: true,
})
export default class ComissaoServidor extends Model<
  ComissaoServidorAttributes,
  ComissaoServidorCreationAttributes
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
        model: "comissoes_avaliadoras",
        key: "id"
    }
  })
  declare comissoes_avaliadoras_id: number;
  
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

  @BelongsTo(() => Servidor, 'servidores_id')
  declare servidor: Servidor;
}