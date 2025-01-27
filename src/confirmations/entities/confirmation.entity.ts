import { Role } from 'src/roles/entities/role.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Confirmation {
  @PrimaryGeneratedColumn()
  confirm_Id: number;

  @ManyToOne(() => Role, (role) => role.confirmations, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ Confirmation เมื่อ Role ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตเมื่อ Role ถูกอัปเดต
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Room, (room) => room.confirmations, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ Confirmation เมื่อ Room ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตเมื่อ Room ถูกอัปเดต
  })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => User, (user) => user.confirmations, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ Confirmation เมื่อ User ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตเมื่อ User ถูกอัปเดต
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
