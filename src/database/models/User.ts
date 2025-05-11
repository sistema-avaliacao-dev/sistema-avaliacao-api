import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType
} from "sequelize-typescript";

export interface UserAttributes {
  id?: number
  username: string
  password_hash: string
  role: string
  createdAt?: Date
  updatedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
  createdAt: true,
  updatedAt: true,
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
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
    allowNull: false,
    unique: true
  })
  declare username: string;

  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password_hash: string;

  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare role: string;

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