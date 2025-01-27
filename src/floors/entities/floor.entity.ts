import { Room } from 'src/rooms/entities/room.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  floorId: number;

  @Column({ unique: true })
  floor_Number: number;

  @Column()
  total_Room: number;

  @Column({ type: 'time' })
  openTime: string;

  @Column({ type: 'time' })
  closedTime: string;

  @OneToMany(() => Room, (room) => room.floor, {
    cascade: true, // ลบห้องทั้งหมดเมื่อชั้นถูกลบ
    onDelete: 'CASCADE', // ลบข้อมูล room ถ้า floor ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตข้อมูล room ถ้า floor มีการเปลี่ยนแปลง
  })
  rooms: Room[];
}
