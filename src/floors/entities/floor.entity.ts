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

  @OneToMany(() => Room, (room) => room.floor)
  rooms: Room[];
}
