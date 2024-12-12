import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ nullable: false })
  @Index('unique_username', { unique: true })
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ nullable: true })
  @Index('unique_email', { unique: true })
  @IsEmail()
  email: string;
}
