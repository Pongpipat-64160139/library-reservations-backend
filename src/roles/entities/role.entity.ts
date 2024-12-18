import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
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

  @Column({ nullable: false })
  department: string;

  @OneToMany(() => RoleAssignment, (roleAss) => roleAss.role)
  roleAssignments: RoleAssignment[];


  @OneToMany(()=> Confirmation , (confirm)=> confirm.role)
  confirmations: Confirmation[]
}
