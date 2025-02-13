import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';
@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  floorId: number;

  @Column({ unique: true })
  floor_Number: number;

  @Column()
  total_Room: number;

  @Column({ type: 'time' })
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
  openTime: string;

  @Column({ type: 'time' })
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
  closedTime: string;

  @OneToMany(() => Room, (room) => room.floor, {
    cascade: true, // ลบห้องทั้งหมดเมื่อชั้นถูกลบ
    onDelete: 'CASCADE', // ลบข้อมูล room ถ้า floor ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตข้อมูล room ถ้า floor มีการเปลี่ยนแปลง
  })
  rooms: Room[];
}
