import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number; // รหัส Primary Key

  @Column({ type: 'varchar', length: 255, nullable: true })
  holiday_name: string; // ชื่อวันหยุด

  @Column({ type: 'date', unique: true })
  holiday_date: string; // วันที่วันหยุด (ต้องไม่ซ้ำ)

  @CreateDateColumn()
  created_at: Date; // วันที่สร้างข้อมูล

  @UpdateDateColumn()
  updated_at: Date; // วันที่อัปเดตข้อมูล
}
