import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './user';

@Table({
  tableName: 'UserContact',
  timestamps: false,
})
export class UserContact extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  UserId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  Email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  Phone!: string;

  @BelongsTo(() => User)
  user!: User;
}
