import { DataType, Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'driver_session',
  timestamps: true,
  freezeTableName: true,
})
export class DriverSession extends Model {
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
  declare driverId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare refreshExpiresAt: Date;
}
