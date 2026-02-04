import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'driver_session',
  timestamps: true,
  freezeTableName: true,
})
export class DriverSeesion extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare driverId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare refreshExpireAt?: Date;
}
