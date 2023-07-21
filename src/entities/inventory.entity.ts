import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  ean: string;

  @Column({ type: 'varchar', length: 100, name: 'product_name' })
  productName: string;

  @Column({ type: 'date', name: 'expires_in' })
  expiresIn: Date;

  @Column({ type: 'date', name: 'remove_date', nullable: true })
  removeDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'int', nullable: true, name: 'days_before_remove' })
  daysBeforeRemove: number;

  @Expose()
  get leftDaysToRemove() {
    return new Date(this.removeDate).getDate() - new Date().getDate();
  }

  @CreateDateColumn({
    type: 'varchar',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'varchar',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at'
  })
  updatedAt: Date;
}
