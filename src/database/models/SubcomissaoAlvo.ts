import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface SubcomissaoAlvoAttributes {
  id?: number
  subcomissoes_avaliadoras_id: number
  servidores_id: number
  createdAt: Date
  updatedAt: Date
}

interface SubcomissaoAlvoCreationAttributes extends Optional<SubcomissaoAlvoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "subcomissoes_alvos",
  modelName: "SubcomissaoAlvo",
  createdAt: true,
  updatedAt: true,
})
export default class SubcomissaoAlvo extends Model<
  SubcomissaoAlvoAttributes,
  SubcomissaoAlvoCreationAttributes
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