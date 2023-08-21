import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Inventory } from './inventory.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => User, (user) => user.store)
  users: User[];

  @OneToMany(() => Inventory, (inventory) => inventory.store)
  inventory: Inventory[];
}
