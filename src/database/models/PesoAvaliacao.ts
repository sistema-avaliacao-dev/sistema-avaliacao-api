import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface PesoAvaliacaoAttributes {
  id?: number
  cargo_id: number
  peso_1: number
  peso_2: number
  peso_3: number
  peso_4: number
  peso_5: number
  peso_6: number
  peso_7: number
  peso_8: number
  peso_9: number
  peso_10: number
  peso_11: number
  peso_12: number
  peso_13: number
  peso_14: number
  peso_15: number
  peso_16: number
  peso_17?: number
  peso_18?: number
  peso_19?: number
  peso_20?: number
  pontuacao_maxima: number
  pontuacao_minima_estagio_probatorio: number
  pontuacao_minima_progressao: number
  createdAt: Date
  updatedAt: Date
}

interface PesoAvaliacaoCreationAttributes extends Optional<PesoAvaliacaoAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "pesos_avaliacao",
  modelName: "PesoAvaliacao",
  createdAt: false,
  updatedAt: false,
})
export default class PesoAvaliacao extends Model<
  PesoAvaliacaoAttributes,
  PesoAvaliacaoCreationAttributes
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
        model: 'cargos',
        key: 'id'
    }
  })
  declare cargo_id: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_1: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_2: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_3: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_4: number;

  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_5: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_6: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_7: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_8: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_9: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_10: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_11: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_12: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_13: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_14: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_15: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare peso_16: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare peso_17: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare peso_18: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare peso_19: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare peso_20: number;

  
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare pontuacao_maxima: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare pontuacao_minima_estagio_probatorio: number;

  
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare pontuacao_minima_progressao: number;
  
}