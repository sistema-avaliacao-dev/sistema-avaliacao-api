import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  HasMany
} from "sequelize-typescript";
import Cargo from "./Cargos";

export interface ServidorAttributes {
  id?: number
  users_id?: number
  cpf: string
  matricula: string
  nome: string
  email?: string
  cargo_id: number
  lotacao: string
  grau_instrucao: string
  situacao_grau_instrucao: string
  data_admissao: string
  chefia_imediata_servidores_id?: number
  is_active?: boolean
}

interface ServidorCreationAttributes extends Optional<ServidorAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "servidores",
  modelName: "Servidor",
  createdAt: true,
  updatedAt: true,
})
export default class Servidor extends Model<
  ServidorAttributes,
  ServidorCreationAttributes
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
        model: "users",
        key: "id"
    }
  })
  declare users_id: number;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare cpf: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare matricula: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare nome: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  declare email: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: "cargos",
      key: "id"
  }
  })
  declare cargo_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare lotacao: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare grau_instrucao: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare situacao_grau_instrucao: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  declare data_admissao: string;
   
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    references: {
        model: "servidores",
        key: "id"
    }
  })
  declare chefia_imediata_servidores_id: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  declare is_active: boolean;

  @BelongsTo(() => Cargo, 'cargo_id')
  declare cargo: Cargo;

  @BelongsTo(() => Servidor, 'chefia_imediata_servidores_id')
  declare chefia_imediata: Servidor;

  @HasMany(() => Servidor, 'chefia_imediata_servidores_id')
  declare subordinados: Servidor[];
}