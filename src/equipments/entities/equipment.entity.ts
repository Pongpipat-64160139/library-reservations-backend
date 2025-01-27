import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  eq_Id: number;

  @Column({ type: 'varchar', length: 255 })
  equip_Name: string;

  @OneToMany(() => EquipmentBooking, (eqb) => eqb.equipmnet, {
    cascade: true, // ลบ EquipmentBooking ทั้งหมดเมื่อ Equipment ถูกลบ
    onDelete: 'CASCADE', // เมื่อ Equipment ถูกลบ, EquipmentBooking ที่เกี่ยวข้องจะถูกลบด้วย
    onUpdate: 'CASCADE', // เมื่อ Equipment อัปเดต, FK ใน EquipmentBooking จะถูกอัปเดต
  })
  equipmentBookings: EquipmentBooking[];
}
