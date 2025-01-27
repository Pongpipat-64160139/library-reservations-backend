import { Role } from 'src/roles/entities/role.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleRoomAccess {
  @PrimaryGeneratedColumn()
  access_ID: number;

  @ManyToOne(() => Room, (room) => room.roleRoomAccesses, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => Role, (role) => role.roleRoomAccesses, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
