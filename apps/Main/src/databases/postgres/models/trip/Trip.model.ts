import { DataType, Table, Column, Model } from 'sequelize-typescript';

enum TripStatus {
  REQUESTED = 'REQUESTED',
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Table({
  tableName: 'trip',
  timestamps: true,
  freezeTableName: true,
})
export class Trip extends Model {
  /* =====================
     Primary Key
  ===================== */
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  /* =====================
     Relations
  ===================== */
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare passengerId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare driverId?: string;

  /* =====================
     Location
  ===================== */
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare originLat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare originLng: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare destinationLat: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare destinationLng: number;

  /* =====================
     Trip State
  ===================== */
  @Column({
    type: DataType.ENUM(...Object.values(TripStatus)),
    allowNull: false,
    defaultValue: TripStatus.REQUESTED,
  })
  declare status: TripStatus;

  /* =====================
     Fare - Estimate
  ===================== */
  @Column(DataType.FLOAT)
  declare estimatedDistanceKm?: number;

  @Column(DataType.INTEGER)
  declare estimatedDurationMin?: number;

  @Column(DataType.INTEGER)
  declare priceEstimate?: number;

  /* =====================
     Fare - Final
  ===================== */
  @Column(DataType.FLOAT)
  declare actualDistanceKm?: number;

  @Column(DataType.INTEGER)
  declare actualDurationMin?: number;

  @Column(DataType.INTEGER)
  declare finalFare?: number;

  /* =====================
     Timeline
  ===================== */
  @Column(DataType.DATE)
  declare acceptedAt?: Date;

  @Column(DataType.DATE)
  declare startedAt?: Date;

  @Column(DataType.DATE)
  declare finishedAt?: Date;

  @Column(DataType.DATE)
  declare cancelledAt?: Date;

  @Column(DataType.UUID)
  declare cancelledBy?: string;
}
