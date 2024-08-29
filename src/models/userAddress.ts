import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from './user';

@Table({
  tableName: 'UserAddress',
  timestamps: false,
})
export class UserAddress extends Model {
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
  })
  Street!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  City!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Zipcode!: string;

  @BelongsTo(() => User)
  user!: User;
}
