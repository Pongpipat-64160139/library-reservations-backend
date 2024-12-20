import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  eq_Id: number;

  @Column({ type: 'varchar', length: 255 })
  equip_Name: string;

  @OneToMany(()=> EquipmentBooking,(eqb)=> eqb.equipmnet)
  equipmentBookings: EquipmentBooking[];
}
