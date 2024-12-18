import { Role } from 'src/roles/entities/role.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Confirmation {
  @PrimaryGeneratedColumn()
  confirm_Id: number;

  @ManyToOne(() => Role, (role) => role.confirmations, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Room, (room) => room.confirmations, { nullable: false })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => User, (user) => user.confirmations, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
