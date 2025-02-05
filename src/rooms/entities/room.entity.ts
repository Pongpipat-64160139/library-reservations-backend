import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { Floor } from 'src/floors/entities/floor.entity';
import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';
import { RoleRoomAccess } from 'src/role-room-access/entities/role-room-access.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column()
  room_Name: string;

  @Column()
  capacity: number;

  @Column()
  max_hours: number;

  @Column({ type: 'enum', enum: ['ว่าง', 'ไม่ว่าง', 'จอง'], default: ['ว่าง'] })
  room_Status: string;

  @Column()
  room_Type: string;

  @Column()
  room_Minimum: number;

  @Column()
  orderFood: string;

  @Column()
  RoomKey:string

  @Column({ nullable: true }) // ✅ เพิ่ม Attribute เก็บ Path รูป
  imagePath: string; // เก็บ URL ของรูปที่อัปโหลดไปที่ Cloudinary

  @Column()
  DetailRoom:string

  
  @ManyToOne(() => Floor, (floor) => floor.rooms, {
    nullable: false,
    onDelete: 'CASCADE', // ถ้าลบ Floor จะลบ Room ทั้งหมดที่เชื่อมโยงกัน
    onUpdate: 'CASCADE', // ถ้าอัปเดต Floor จะอัปเดต Room ด้วย
  })
  floor: Floor;

  @OneToMany(() => Confirmation, (confirmation) => confirmation.room, {
    cascade: true, // ลบ Confirmation เมื่อ Room ถูกลบ
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  confirmations: Confirmation[];

  @OneToMany(() => NormalRoomBooking, (nrb) => nrb.roomBooking, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  normalRoomBookings: NormalRoomBooking[];

  @OneToMany(() => RoleRoomAccess, (rra) => rra.room, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roleRoomAccesses: RoleRoomAccess[];

  @OneToMany(() => SpecialRoomBooking, (srb) => srb.room, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  specialRoomBookings: SpecialRoomBooking[];
}
