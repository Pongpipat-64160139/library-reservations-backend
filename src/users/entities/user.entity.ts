import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ unique: true, nullable: true })
  @IsEmail()
  email: string;
}
