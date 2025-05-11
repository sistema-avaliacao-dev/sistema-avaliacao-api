import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface AvaliacaoRespostaAttributes {
  id?: number
  tipo: string
  avaliacoes_id: number
  questao_1: string
  questao_2: string
  questao_3: string
  questao_4: string
  questao_5: string
  questao_6: string
  questao_7: string
  questao_8: string
  questao_9: string
  questao_10: string
  questao_11: string
  questao_12: string
  questao_13: string
  questao_14: string
  questao_15: string
  questao_16: string
  questao_17?: string
  questao_18?: string
  questao_19?: string
  questao_20?: string
  observacoes?: string
  sugestoes?: string
  uso_alcool_drogas?: boolean
  createdAt: Date
  updatedAt: Date
}

interface AvaliacaoRespostaCreationAttributes extends Optional<AvaliacaoRespostaAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "avaliacoes_respostas",
  modelName: "AvaliacaoResposta",
  createdAt: true,
  updatedAt: true,
})
export default class AvaliacaoResposta extends Model<
  AvaliacaoRespostaAttributes,
  AvaliacaoRespostaCreationAttributes
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
        model: "avaliacoes",
        key: "id"
    }
  })
  declare avaliacoes_id: string;
  
  
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    values: ['auto_avaliacao', 'supervisor', 'subcomissao', 'parecer_conclusivo']
  })
  declare tipo: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_1: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_2: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_3: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_4: string;

  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_5: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_6: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_7: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_8: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_9: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_10: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_11: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_12: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_13: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_14: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_15: string;
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare questao_16: string;
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare questao_17: string;
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare questao_18: string;
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare questao_19: string;
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare questao_20: string;
  
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
    type: DataType.TEXT,
    allowNull: true
  })
  declare observacoes: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  declare sugestoes: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  declare uso_alcool_drogas: boolean;
}