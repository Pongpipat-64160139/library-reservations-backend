import { Floor } from 'src/floors/entities/floor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column()
  room_Name: string;

  @Column()
  capacity: number;

  @Column()
  Max_hours: number;

  @Column()
  room_Status: string;

  @Column()
  room_Type: string;

  @Column()
  room_Minimum: number;

  @Column()
  orderFood: string;

  @ManyToOne(() => Floor, (floor) => floor.rooms)
  floor: Floor;
}
