import { LatePayment } from 'src/modules/payment_details/entities/late_payment.entity';
import { Payment } from 'src/modules/payment_details/entities/payment.entity';
import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  address: string;

  @Column()
  company_name: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  nationality_id: string;

  @Column()
  country: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  mobileNumber: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  grace_days: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  profile_img: string;

  @Column({ type: 'text', array: true })
  images: string[];

  @ManyToOne(() => PropertyAds, (property) => property.customers)
  propertyAds: PropertyAds;

  @OneToMany(() => Payment, (payment) => payment.customer, {
    onDelete: 'CASCADE',
  })
  payment_details: Payment;

  @OneToMany(() => LatePayment, (payment) => payment.customer, {
    onDelete: 'CASCADE',
  })
  Late_payment: LatePayment;
}
