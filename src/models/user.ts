import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasOne, HasMany } from 'sequelize-typescript';
import { UserContact } from './userContact';
import { UserAddress } from './userAddress';

@Table({
  tableName: 'Users',
  timestamps: false,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  Username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Password!: string;

  @HasOne(() => UserContact)
  contact!: UserContact;

  @HasOne(() => UserAddress)
  address!: UserAddress;
}
