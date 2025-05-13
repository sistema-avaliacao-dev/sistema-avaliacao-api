import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo
} from "sequelize-typescript";
import Servidor from "./Servidor";

export interface AvaliacaoAttributes {
  id?: number
  servidores_id: number
  status: string
  data_inicio: Date
  data_fim: Date
  chefia_snapshot?: any;
  subcomissao_snapshot?: any;
  comissao_snapshot?: any;
  createdAt: Date
  updatedAt: Date
}

interface AvaliacaoCreationAttributes extends Optional<AvaliacaoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "avaliacoes",
  modelName: "Avaliacao",
  createdAt: true,
  updatedAt: true,
})
export default class Avaliacao extends Model<
  AvaliacaoAttributes,
  AvaliacaoCreationAttributes
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
        model: "servidores",
        key: "id"
    }
  })
  declare servidores_id: string;
  
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    values: ['auto_avaliacao', 'supervisor', 'subcomissao', 'comissao'],
    defaultValue: 'auto_avaliacao'
  })
  declare status: string;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  declare data_inicio: Date;
  
  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  declare data_fim: Date;

  
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

  @Column({
    type: DataType.JSON,
    allowNull: true
  })
  declare chefia_snapshot: any;

  @Column({
    type: DataType.JSON,
    allowNull: true
  })
  declare subcomissao_snapshot: any;

  @Column({
    type: DataType.JSON,
    allowNull: true
  })
  declare comissao_snapshot: any;

  @BelongsTo(() => Servidor, 'servidores_id')
  declare servidor: Servidor;
}