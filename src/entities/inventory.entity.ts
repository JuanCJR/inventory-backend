import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { DateTime } from 'luxon';
import { Store } from './store.entity';
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

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Expose()
  get leftDaysToRemove() {
    const removeDate = DateTime.fromISO(
      new Date(this.removeDate).toISOString()
    );
    const now = DateTime.fromISO(new Date().toISOString());
    return removeDate.diff(now, 'days').days.toFixed(0);
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

  @ManyToOne(() => Store, (Store) => Store.inventory)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
