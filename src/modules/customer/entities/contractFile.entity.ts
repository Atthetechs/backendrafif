import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customers } from './customer.entity';

@Entity()
export class ContractFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  key: string;

  @ManyToOne(() => Customers, (customer) => customer.contractFiles)
  customer: Customers;
}
