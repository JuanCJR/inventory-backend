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

  @Column({ type: 'varchar', length: 100 })
  product_name: string;

  @Column({ type: 'date', name: 'expires_in' })
  expiresIn: Date;

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
