import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { RoleRoomAccess } from 'src/role-room-access/entities/role-room-access.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ nullable: false })
  @Index('unique_position', { unique: true })
  position: string;

  // @Column({ nullable: false })
  // department: string;

  @OneToMany(() => RoleAssignment, (roleAss) => roleAss.role, {
    cascade: true, // ลบ RoleAssignment เมื่อ Role ถูกลบ
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roleAssignments: RoleAssignment[];

  @OneToMany(() => Confirmation, (confirm) => confirm.role, {
    cascade: true, // ลบ Confirmation เมื่อ Role ถูกลบ
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  confirmations: Confirmation[];

  @OneToMany(() => RoleRoomAccess, (rra) => rra.role, {
    cascade: true, // ลบ RoleRoomAccess เมื่อ Role ถูกลบ
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roleRoomAccesses: RoleRoomAccess[];
}
