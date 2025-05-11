import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface ComissaoAlvoAttributes {
  id?: number
  comissoes_avaliadoras_id: number
  servidores_id: number
  createdAt: Date
  updatedAt: Date
}

interface ComissaoAlvoCreationAttributes extends Optional<ComissaoAlvoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "comissoes_alvos",
  modelName: "ComissaoAlvo",
  createdAt: true,
  updatedAt: true,
})
export default class ComissaoAlvo extends Model<
  ComissaoAlvoAttributes,
  ComissaoAlvoCreationAttributes
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
}