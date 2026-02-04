import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'driver',
  timestamps: true,
  freezeTableName: true,
})
export class Driver extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare phone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare firstName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare lastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare carModel?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare carColor?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare plateNumber?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isOnline?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isVerified?: boolean;
}
