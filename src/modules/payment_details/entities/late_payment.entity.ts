import { Customers } from 'src/modules/customer/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LatePayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payment_type: string;

  @Column({ nullable: true, type: 'float' })
  rent: number;

  @Column({ default: false })
  paid: boolean;

  @Column({ default: false })
  un_paid: boolean;

  @CreateDateColumn()
  created_date: Date;

  @ManyToOne(() => Customers, (customer) => customer.Late_payment)
  customer: Customers;
}
