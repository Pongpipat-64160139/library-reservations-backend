import { Equipment } from 'src/equipments/entities/equipment.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EquipmentBooking {
  @PrimaryGeneratedColumn()
  eqb_Id: number;

  @Column()
  require: string;

  @ManyToOne(() => Equipment, (eq) => eq.equipmentBookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eq_Id' })
  equipmnet: Equipment;

  @ManyToOne(() => SpecialRoomBooking, (srb) => srb.equipmentBookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'srb_Id' })
  srb: SpecialRoomBooking;
}
